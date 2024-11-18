'use client'

import axios from 'axios';
import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { EmailContext, Email } from './Email';

const fetchEmails = async (page: number): Promise<Email[]> => {
  try {
    const response = await axios.get(`https://flipkart-email-mock.now.sh/?page=${page}`);
    return response.data.list.map((email: any) => ({
      id: email.id,
      from: email.from,
      date: email.date,
      subject: email.subject,
      short_description: email.short_description,
      read: false,
      favorite: false,
    }));
  } catch (error: any) {
    if (error.response?.status === 500) {
      return [];
    }
    throw error;
  }
};

const EmailList = ({ filter }: { filter: string }) => {
  const { emails, setEmails, selectedEmailId, setSelectedEmailId, markAsRead, fetchedPages, setFetchedPages } = useContext(EmailContext)!;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver>();

  const loadEmails = useCallback(async (page: number) => {
    if (fetchedPages.includes(page)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedEmails = await fetchEmails(page);

      if (fetchedEmails.length === 0) {
        setHasMore(false);
        return;
      }

      setEmails(prev => {
        const newEmails = [...prev];
        fetchedEmails.forEach(email => {
          const existingEmail = newEmails.find(e => e.id === email.id);
          if (existingEmail) {
            // Preserve read and favorite status
            email.read = existingEmail.read;
            email.favorite = existingEmail.favorite;
          }
          const index = newEmails.findIndex(e => e.id === email.id);
          if (index !== -1) {
            newEmails[index] = email;
          } else {
            newEmails.push(email);
          }
        });
        return newEmails;
      });
      setFetchedPages(prev => [...prev, page]);
      setCurrentPage(page);
    } catch (error) {
      setError('Failed to load emails. Please try again later.');
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  }, [setEmails, fetchedPages, setFetchedPages]);

  useEffect(() => {
    if (filter === 'All' || filter === 'Unread') {
      loadEmails(1);
    }
  }, [loadEmails, filter]);

  const formatDate = (date: number) => {
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const lastEmailRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && (filter === 'All' || filter === 'Unread')) {
        loadEmails(currentPage + 1);
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, currentPage, loadEmails, filter]);

  const handleReadEmail = useCallback((id: string) => {
    markAsRead(id);
    setSelectedEmailId(id);
  }, [markAsRead, setSelectedEmailId]);

  const filteredEmails = emails.filter(email => {
    if (filter === 'Unread') return !email.read;
    if (filter === 'Read') return email.read;
    if (filter === 'Favorites') return email.favorite;
    return true;
  });

  return (
    <div>
      {error && (
        <div className="text-red-500 p-4 mb-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      <div className="space-y-5 overflow-y-auto h-[calc(100vh-100px)]">
        {filteredEmails.map((email, index) => (
          <div
            ref={index === filteredEmails.length - 1 ? lastEmailRef : undefined}
            key={email.id}
            onClick={() => handleReadEmail(email.id)}
            className={`p-4 flex gap-4 border rounded-lg cursor-pointer 
                ${email.read ? 'bg-gray-100' : 'bg-white'}
                ${selectedEmailId === email.id ? 'border border-pink-500' : ''}
            `}
          >
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
              {email.from.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div>
                <span className="font-medium">From: </span>
                <span className="text-muted-foreground">
                  {`${email.from.name} <${email.from.email}>`}
                </span>
              </div>
              <div className="mb-1">
                <span className="font-medium">Subject: </span>
                <span className="text-muted-foreground">{email.subject}</span>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-1">
                {email.short_description}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(email.date)}
                {email.favorite && <span className='ml-5 font-medium text-pink-500'>Favorite</span>}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-center py-4 text-muted-foreground">
            Loading more emails...
          </div>
        )}
        {!hasMore && !loading && filteredEmails.length > 0 && (
          <div className="text-center py-4 text-muted-foreground">
            You've reached the end of the list
          </div>
        )}
        {!loading && filteredEmails.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No emails avaiable for the selected filter!
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;
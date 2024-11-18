'use client'

import axios from "axios";
import { Loader } from 'lucide-react';
import { useEffect, useState, useContext, useCallback } from "react";
import { Button } from "./ui/button";
import { EmailContext } from "./Email";

const EmailDetail = () => {
  const { selectedEmailId, emails, toggleFavorite } = useContext(EmailContext)!;
  const [emailBody, setEmailBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedEmail = emails.find(email => email.id === selectedEmailId);

  const fetchEmailBody = useCallback(async () => {
    if (!selectedEmailId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://flipkart-email-mock.now.sh/?id=${selectedEmailId}`
      );
      setEmailBody(response.data.body);
    } catch (error) {
      setError("Failed to load email content. Please try again.");
      console.error("Error fetching email body:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedEmailId]);

  useEffect(() => {
    fetchEmailBody();
  }, [fetchEmailBody]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!selectedEmail) {
    return null;
  }

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

  return (
    <article className="p-6 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex items-start mb-6">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold mr-4">
          {selectedEmail.from.name[0].toUpperCase()}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {selectedEmail.subject}
              </h1>
              <time className="text-sm text-gray-500">{formatDate(selectedEmail.date)}</time>
            </div>
  
            <Button
              variant="destructive"
              className={`text-white ${selectedEmail.favorite ? 'bg-gray-500 hover:bg-gray-600' : 'bg-pink-500 hover:bg-pink-600'} border rounded-lg`}
              onClick={() => toggleFavorite(selectedEmail.id)}
              aria-label={selectedEmail.favorite ? "Remove from favorites" : "Mark as favorite"}
            >
              {selectedEmail.favorite ? "Remove from favorites" : "Mark as favorite"}
            </Button>
          </div>
        
          <div
            className="mt-6 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: emailBody }}
          />
        </div>
      </div>
    </article>
  );
};

export default EmailDetail;
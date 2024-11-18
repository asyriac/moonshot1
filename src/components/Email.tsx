'use client'

import React, { createContext, useState, useCallback, useEffect } from "react";
import EmailFilters from "./EmailFilters";
import EmailList from "./EmailList";
import EmailDetail from "./EmailDetails";

export interface Email {
  id: string;
  from: {
    email: string;
    name: string;
  };
  date: number;
  subject: string;
  short_description: string;
  read: boolean;
  favorite: boolean;
}

interface EmailContextProps {
  emails: Email[];
  setEmails: React.Dispatch<React.SetStateAction<Email[]>>;
  toggleFavorite: (emailId: string) => void;
  selectedEmailId: string | null;
  setSelectedEmailId: React.Dispatch<React.SetStateAction<string | null>>;
  markAsRead: (emailId: string) => void;
  fetchedPages: number[];
  setFetchedPages: React.Dispatch<React.SetStateAction<number[]>>;
}

export const EmailContext = createContext<EmailContextProps | undefined>(undefined);

const EmailApp = () => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [emails, setEmails] = useState<Email[]>([]);
  const [fetchedPages, setFetchedPages] = useState<number[]>([]);

  useEffect(() => {
    const storedEmails = localStorage.getItem('emails');
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails));
    }
  }, []);

  const saveEmailsToLocalStorage = useCallback((updatedEmails: Email[]) => {
    localStorage.setItem('emails', JSON.stringify(updatedEmails));
  }, []);

 

  const toggleFavorite = useCallback((emailId: string) => {
    setEmails((prevEmails) => {
      const updatedEmails = prevEmails.map((email) =>
        email.id === emailId ? { ...email, favorite: !email.favorite } : email
      );
      saveEmailsToLocalStorage(updatedEmails);
      return updatedEmails;
    });
  }, [saveEmailsToLocalStorage]);

  const markAsRead = useCallback((emailId: string) => {
    setEmails((prevEmails) => {
      const updatedEmails = prevEmails.map((email) =>
        email.id === emailId ? { ...email, read: true } : email
      );
      saveEmailsToLocalStorage(updatedEmails);
      return updatedEmails;
    });
  }, [saveEmailsToLocalStorage]);

  const contextValue: EmailContextProps = {
    emails,
    setEmails,
    toggleFavorite,
    selectedEmailId,
    setSelectedEmailId,
    markAsRead,
    fetchedPages,
    setFetchedPages,
  };

  return (
    <EmailContext.Provider value={contextValue}>
      <div className="max-w-screen-xl px-6 mt-5 mx-auto">
        <EmailFilters filter={filter} setFilter={setFilter} />
        <div className="flex flex-col lg:flex-row">
          {(!selectedEmailId || window.innerWidth >= 1024) && (
            <div className={`${selectedEmailId ? "w-full lg:w-1/2" : "w-full"}`}>
              <EmailList filter={filter} />
            </div>
          )}
          {selectedEmailId && (
            <div className="w-full lg:w-1/2">
              <EmailDetail />
            </div>
          )}
        </div>
      </div>
    </EmailContext.Provider>
  );
};

export default EmailApp;
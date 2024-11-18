import { useEffect, useState, useRef } from 'react';

const useIntersectionObserver = (callback: () => void, options: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          callback();
        }
      },
      options
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [callback, options]);

  return { observerRef, isIntersecting };
};

export default useIntersectionObserver;

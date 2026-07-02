'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Loading from './Loading';

export default function RouteChangeLoader({ children }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // Reduced delay

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (loading) {
    return <Loading />;
  }

  return children;
}
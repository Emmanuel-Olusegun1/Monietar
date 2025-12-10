'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    // Only run in browser + production build
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (window as any).serwist
    ) {
      (window as any).serwist.register();
    }
  }, []);

  // This component renders nothing
  return null;
}
'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator && (window as any).serwist) {
        console.log('Registering SW manually...');  // Debug log—check console after deploy
        try {
          await (window as any).serwist.register({ immediate: true });
          console.log('SW registered successfully!');
        } catch (error) {
          console.error('SW registration failed:', error);
        }
      } else {
        // Retry after a short delay (fixes timing issues in production)
        setTimeout(registerServiceWorker, 1000);
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}
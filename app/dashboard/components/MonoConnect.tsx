'use client';

import { useEffect, useRef } from 'react';

interface MonoConnectProps {
  onSuccess: (authCode: string) => void;
  onClose: () => void;
  onEvent?: (event: any) => void;
}

// Define types for Mono Connect
interface MonoConnectOptions {
  key: string;
  onSuccess: (data: { code: string }) => void;
  onClose: () => void;
  onLoad?: () => void;
  onEvent?: (event: string, data: any) => void;
}

interface MonoConnectInstance {
  setup: () => void;
  open: () => void;
  close: () => void;
}

// Type for the module
interface MonoModule {
  default?: new (options: MonoConnectOptions) => MonoConnectInstance;
  MonoConnect?: new (options: MonoConnectOptions) => MonoConnectInstance;
}

declare global {
  interface Window {
    MonoConnect?: new (options: MonoConnectOptions) => MonoConnectInstance;
  }
}

export default function MonoConnect({ onSuccess, onClose, onEvent }: MonoConnectProps) {
  const monoConnectRef = useRef<MonoConnectInstance | null>(null);

  useEffect(() => {
    const initializeMono = async () => {
      try {
        onEvent?.({ type: 'LOADING' });
        
        console.log('Importing Mono package...');
        
        let MonoConnectConstructor: new (options: MonoConnectOptions) => MonoConnectInstance;

        // Try dynamic import first
        try {
          const monoModule = await import('@mono.co/connect.js') as MonoModule;
          console.log('Mono module loaded via import:', monoModule);
          
          // Handle different export formats
          MonoConnectConstructor = monoModule.default || monoModule.MonoConnect!;
          
          if (typeof MonoConnectConstructor !== 'function') {
            throw new Error('MonoConnect constructor not found in module');
          }
        } catch (importError) {
          console.log('Dynamic import failed, trying script tag method:', importError);
          
          // Load via script tag
          await new Promise<void>((resolve, reject) => {
            if (window.MonoConnect) {
              resolve();
              return;
            }

            const script = document.createElement('script');
            script.src = 'https://connect.withmono.com/connect.js';
            script.async = true;
            script.onload = () => {
              if (window.MonoConnect) {
                resolve();
              } else {
                reject(new Error('MonoConnect not available after script load'));
              }
            };
            script.onerror = () => reject(new Error('Failed to load Mono Connect script'));
            document.head.appendChild(script);
          });

          MonoConnectConstructor = window.MonoConnect!;
        }

        const publicKey = process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY;
        
        if (!publicKey) {
          throw new Error('Mono public key not configured');
        }

        console.log('Initializing Mono Connect with key:', publicKey.substring(0, 10) + '...');

        // Initialize Mono Connect
        monoConnectRef.current = new MonoConnectConstructor({
          key: publicKey,
          onSuccess: (data: { code: string }) => {
            console.log('Mono connection successful:', data);
            onSuccess(data.code);
            onEvent?.({ type: 'SUCCESS', data });
          },
          onClose: () => {
            console.log('Mono connection closed');
            onClose();
            onEvent?.({ type: 'CLOSED' });
          },
          onLoad: () => {
            console.log('Mono Connect loaded successfully');
            onEvent?.({ type: 'LOADED' });
          },
          onEvent: (event: string, data: any) => {
            console.log('Mono event:', event, data);
            onEvent?.({ type: event.toUpperCase(), data });
          }
        });

        // Setup and open the widget
        monoConnectRef.current.setup();
        monoConnectRef.current.open();
        
        onEvent?.({ type: 'OPENED' });

      } catch (error) {
        console.error('Error initializing Mono Connect:', error);
        onEvent?.({ type: 'ERROR', error });
        
        // Show user-friendly error message
        setTimeout(() => {
          alert('Failed to load bank connection. Please try again or contact support.');
          onClose();
        }, 1000);
      }
    };

    initializeMono();

    // Cleanup function
    return () => {
      if (monoConnectRef.current) {
        try {
          monoConnectRef.current.close();
        } catch (error) {
          console.error('Error closing Mono Connect:', error);
        }
      }
    };
  }, [onSuccess, onClose, onEvent]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connect Bank Account
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Loading Secure Connection
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we connect to your bank...
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Securely connect your bank account using Mono. Your credentials are never stored.
          </p>
        </div>
      </div>
    </div>
  );
}
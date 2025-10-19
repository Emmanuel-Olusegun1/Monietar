'use client';

import { useEffect, useRef } from 'react';

interface MonoConnectProps {
  onSuccess: (authCode: string) => void;
  onClose: () => void;
  onEvent?: (event: any) => void;
}

export default function MonoConnect({ onSuccess, onClose, onEvent }: MonoConnectProps) {
  const monoConnectRef = useRef<any>(null);

  useEffect(() => {
    const initializeMono = async () => {
      try {
        onEvent?.({ type: 'LOADING' });
        
        console.log('Importing Mono package...');
        
        // Import the Mono Connect package - try different import methods
        const monoModule = await import('@mono.co/connect.js');
        console.log('Mono module:', monoModule);
        
        // The package might export differently - let's check what's available
        const MonoConnect = monoModule.default || monoModule.MonoConnect || monoModule;
        console.log('MonoConnect constructor:', MonoConnect);
        
        if (typeof MonoConnect !== 'function') {
          throw new Error('MonoConnect is not a constructor. Available exports: ' + Object.keys(monoModule).join(', '));
        }

        const publicKey = process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY;
        
        if (!publicKey) {
          throw new Error('Mono public key not configured');
        }

        console.log('Initializing Mono Connect with key:', publicKey.substring(0, 10) + '...');

        // Initialize Mono Connect
        monoConnectRef.current = new MonoConnect({
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
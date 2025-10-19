'use client';

import { useState } from 'react';

export default function TestMono() {
  const [status, setStatus] = useState<string>('');

  const testMonoConnection = async () => {
    setStatus('Testing...');
    
    try {
      const publicKey = process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY;
      
      if (!publicKey) {
        setStatus('❌ NEXT_PUBLIC_MONO_PUBLIC_KEY is not set');
        return;
      }

      setStatus(`✅ Public key found: ${publicKey.substring(0, 10)}...`);

      // Test if we can load the Mono script
      const script = document.createElement('script');
      script.src = 'https://connect.withmono.com/connect.js';
      script.async = true;
      
      script.onload = () => {
        if (window.MonoConnect) {
          setStatus('✅ Mono script loaded successfully! MonoConnect is available.');
        } else {
          setStatus('❌ Script loaded but MonoConnect not found on window');
        }
      };
      
      script.onerror = () => {
        setStatus('❌ Failed to load Mono script - check network or CORS');
      };

      document.head.appendChild(script);

    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Mono Connection Test</h1>
        
        <button
          onClick={testMonoConnection}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-4 hover:bg-blue-700"
        >
          Test Mono Connection
        </button>
        
        <div className="p-4 bg-gray-50 rounded">
          <pre className="whitespace-pre-wrap">{status || 'Click to test...'}</pre>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Common Issues:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Invalid Mono public key</li>
            <li>Network restrictions</li>
            <li>Ad blockers blocking the script</li>
            <li>Mono service downtime</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    MonoConnect: any;
  }
}
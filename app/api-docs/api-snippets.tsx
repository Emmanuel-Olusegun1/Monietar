'use client';

import { useState } from 'react';
import { Terminal, Copy, Check, Code2 } from 'lucide-react';

const ENDPOINTS_DATA = [
  {
    id: 'auth',
    name: 'Authentication',
    method: 'POST',
    path: '/v1/auth/token',
    description: 'Exchange your secure app keys for a transient, cryptographic bearer session token.',
    payload: `{
  "client_id": "mon_live_7x923...",
  "client_secret": "sec_key_44109..."
}`,
    response: `{
  "status": "authenticated",
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`
  },
  {
    id: 'push-ledger',
    name: 'Ingest Transaction',
    method: 'POST',
    path: '/v1/ledger/entry',
    description: 'Programmatically stream transaction footprints from custom checkout flows right to your ledger.',
    payload: `{
  "account_id": "acc_01JK89",
  "amount": 2500.00,
  "currency": "USD",
  "reference": "TXN_REF_99012",
  "metadata": {
    "channel": "SaaS Stripe Webhook",
    "region": "West Africa"
  }
}`,
    response: `{
  "entry_id": "led_entry_99341",
  "status": "reconciled",
  "synchronized_at": "2026-06-07T02:20:00Z",
  "balance_snapshot": 142500.00
}`
  }
];

export default function ApiSnippets() {
  const [activeTab, setActiveTab] = useState('auth');
  const [copied, setCopied] = useState(false);

  const currentEndpoint = ENDPOINTS_DATA.find(ep => ep.id === activeTab) || ENDPOINTS_DATA[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-4">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar Controls */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Direct Integrations
            </div>
            {ENDPOINTS_DATA.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setActiveTab(ep.id)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex flex-col gap-1 ${
                  activeTab === ep.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-tight">{ep.name}</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    activeTab === ep.id ? 'bg-emerald-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ep.method}
                  </span>
                </div>
                <span className={`text-[11px] font-mono truncate ${activeTab === ep.id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {ep.path}
                </span>
              </button>
            ))}
          </div>

          {/* Playground Showcase Window */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            
            {/* Header Control Panel */}
            <div className="bg-slate-900/60 border-b border-slate-800/80 px-5 py-3 flex items-center justify-between text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2 font-mono">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-slate-200">https://api.monietar.com</span>
                <span className="text-slate-500">{currentEndpoint.path}</span>
              </div>
              <button 
                onClick={() => handleCopy(currentEndpoint.payload)}
                className="hover:text-white transition-colors flex items-center gap-1.5 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>

            {/* Context parameters */}
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Endpoint Protocol</h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                  {currentEndpoint.description}
                </p>
              </div>

              {/* Layout split for Payload vs Response */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">Request Body</div>
                  <pre className="bg-slate-900 border border-slate-800/60 p-4 rounded-xl overflow-x-auto text-[11px] sm:text-xs font-mono text-slate-300 leading-relaxed">
                    <code>{currentEndpoint.payload}</code>
                  </pre>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">Expected Response</div>
                  <pre className="bg-slate-900 border border-slate-800/60 p-4 rounded-xl overflow-x-auto text-[11px] sm:text-xs font-mono text-emerald-400 leading-relaxed">
                    <code>{currentEndpoint.response}</code>
                  </pre>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Handle/Suppress benign ResizeObserver loop errors/warnings that trigger in iframe or charting environments
if (typeof window !== 'undefined') {
  const _ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      super((entries, observer) => {
        window.requestAnimationFrame(() => {
          callback(entries, observer);
        });
      });
    }
  };
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = createRoot(document.getElementById('root')!);

if (!PUBLISHABLE_KEY) {
  root.render(
    <StrictMode>
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md rounded-lg border border-white/10 bg-white/5 p-6 shadow-xl">
          <h1 className="text-xl font-semibold">Authentication is not configured</h1>
          <p className="mt-2 text-sm text-slate-300">
            Add VITE_CLERK_PUBLISHABLE_KEY to your environment before opening Ledgerly.
          </p>
        </div>
      </div>
    </StrictMode>,
  );
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>,
  );
}

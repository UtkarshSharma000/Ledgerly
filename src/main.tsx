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

if (!PUBLISHABLE_KEY) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || ''} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>,
);

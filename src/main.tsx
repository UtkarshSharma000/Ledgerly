import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Block the Unicorn Studio watermark image network request
const BLOCKED_URL = 'https://assets.unicorn.studio/media/us_fwb.png';
const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

const originalImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
if (originalImageSrc) {
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    set(val) {
      if (val && typeof val === 'string' && val.includes('us_fwb.png')) {
        return originalImageSrc.set?.call(this, EMPTY_IMAGE);
      }
      return originalImageSrc.set?.call(this, val);
    },
    get() {
      return originalImageSrc.get?.call(this);
    }
  });
}

const originalSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name: string, value: any) {
  if (name === 'src' && typeof value === 'string' && value.includes('us_fwb.png')) {
    return originalSetAttribute.call(this, name, EMPTY_IMAGE);
  }
  return originalSetAttribute.apply(this, arguments as any);
};

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

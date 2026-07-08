export const GUEST_MODE_KEY = 'ledgerly_guest_mode';

export function isGuestMode() {
  return typeof window !== 'undefined' && window.localStorage.getItem(GUEST_MODE_KEY) === '1';
}

export function enableGuestMode() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(GUEST_MODE_KEY, '1');
  }
}

export function disableGuestMode() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(GUEST_MODE_KEY);
  }
}

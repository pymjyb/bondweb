// Simple password authentication for admin page
// Note: This is client-side only and should not be considered highly secure
// For production use, consider implementing proper server-side authentication

const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password
const SESSION_KEY = 'admin_authenticated';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Simple hash function (not cryptographically secure, but better than plain text)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const sessionData = sessionStorage.getItem(SESSION_KEY);
  if (!sessionData) return false;

  try {
    const { timestamp, hash } = JSON.parse(sessionData);
    const now = Date.now();
    
    // Check if session has expired
    if (now - timestamp > SESSION_TIMEOUT) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    
    // Verify the hash matches the current password
    return hash === simpleHash(ADMIN_PASSWORD);
  } catch {
    return false;
  }
}

// Authenticate with password
export function authenticate(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    const sessionData = {
      timestamp: Date.now(),
      hash: simpleHash(ADMIN_PASSWORD),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return true;
  }
  return false;
}

// Logout
export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// Get password hint (optional - you can remove this for better security)
export function getPasswordHint(): string {
  // Return empty string for no hint, or provide a hint
  return '';
}

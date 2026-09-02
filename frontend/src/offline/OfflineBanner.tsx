/**
 * OWNER: Member 5 (Offline, Print & Share).
 *
 * Says "Offline — your saved packs still work" rather than an error. Being
 * offline is the expected state in her classroom, so it must never read as a
 * failure. This banner is also the visual proof during the airplane-mode demo.
 */
import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (online) return null;
  return (
    <div className="offline-banner" role="status">
      Offline — your saved packs still work.
    </div>
  );
}

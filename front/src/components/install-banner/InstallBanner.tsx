import { useEffect, useState } from 'react';
import { XIcon } from '@phosphor-icons/react';
import './InstallBanner.css';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

function getSupportedBrowser(): 'chrome' | 'edge' | 'samsung' | 'unsupported' {
  const ua = navigator.userAgent;
  if (/SamsungBrowser/i.test(ua)) return 'samsung';
  if (/Edg\//i.test(ua)) return 'edge';
  if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) return 'chrome';
  return 'unsupported';
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as NavigatorWithStandalone).standalone === true
  );
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (getSupportedBrowser() === 'unsupported') return;
    if (sessionStorage.getItem('install-banner-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('install-banner-dismissed', '1');
  };

  if (!visible) return null;

  return (
    <div className="install-banner">
      <div className="install-banner-inner">
        <div className="install-banner-text">
          <span className="install-banner-title">Installer l'application</span>
          <span className="install-banner-desc">
            Accédez-y rapidement depuis votre écran d'accueil.
          </span>
        </div>
        <div className="install-banner-actions">
          <button className="install-banner-btn" onClick={handleInstall}>
            Installer
          </button>
          <button className="install-banner-close" onClick={handleDismiss} aria-label="Fermer">
            <XIcon size={18} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

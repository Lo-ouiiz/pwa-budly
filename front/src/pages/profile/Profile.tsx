import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/constant';
import { Button } from '@/components/ui/button';
import { authStore } from '@/lib/auth';
import { useUser } from '@/lib/hooks/useUser';
import {
  UserIcon,
  ReceiptIcon,
  FileTextIcon,
  LockKeyIcon,
  SignOutIcon,
  CaretRightIcon,
  ShieldCheckIcon,
  TrashIcon,
  BellIcon,
  EnvelopeIcon,
} from '@phosphor-icons/react';
import './Profile.css';

const getRandomProfileImage = () => {
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  return `/images/profile-${randomNumber}.jpeg`;
};

const menuSections = [
  {
    title: 'Mon compte',
    items: [
      {
        label: 'Mes informations',
        icon: UserIcon,
        href: '/profil/informations',
      },
      {
        label: 'Mes factures',
        icon: ReceiptIcon,
        href: '/profil/factures',
      },
      {
        label: 'Mes reçus fiscaux',
        icon: FileTextIcon,
        href: '/profil/recus-fiscaux',
      },
    ],
  },
  {
    title: 'Sécurité',
    items: [
      {
        label: 'Modifier mon mot de passe',
        icon: LockKeyIcon,
        href: '/profil/modifier-mot-de-passe',
      },
      {
        label: 'Authentification à deux facteurs',
        icon: ShieldCheckIcon,
        href: '/profil/authentification-2fa',
      },
      {
        label: 'Supprimer mon compte',
        icon: TrashIcon,
        href: '/profil/supprimer-compte',
      },
    ],
  },
  {
    title: 'Communication',
    items: [
      {
        label: 'Préférences de notification',
        icon: BellIcon,
        href: '/profil/notifications',
      },
      {
        label: 'Newsletter',
        icon: EnvelopeIcon,
        href: '/profil/newsletter',
      },
    ],
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();
  const profileImage = getRandomProfileImage();

  const handleLogout = async () => {
    try {
      await fetch(API_BASE_URL + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      authStore.accessToken = null;
      navigate('/connexion');
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-left">
          <div className="profile-avatar-container">
            <img src={profileImage} alt="Photo de profil" className="profile-avatar" />
          </div>
          {user && <h1 className="profile-name">Bonjour {user.firstName}</h1>}
        </div>
        <div className="profile-logout profile-logout-desktop">
          <Button
            onClick={handleLogout}
            variant="destructive-outline"
            className="w-full justify-center gap-2"
          >
            <SignOutIcon size={20} />
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="profile-sections">
        {menuSections.map((section) => (
          <div key={section.title} className="profile-section">
            <h3 className="profile-section-title">{section.title}</h3>
            <div className="profile-tiles-list">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className="profile-tile"
                  >
                    <div className="profile-tile-container">
                      <Icon size={18} />
                      <span className="profile-tile-label">{item.label}</span>
                    </div>
                    <CaretRightIcon size={18} className="profile-tile-chevron" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="profile-logout profile-logout-mobile">
        <Button
          onClick={handleLogout}
          variant="destructive-outline"
          className="w-full justify-center gap-2"
        >
          <SignOutIcon size={20} />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}

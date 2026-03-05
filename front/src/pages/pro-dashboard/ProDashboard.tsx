import ComingSoon from '@/components/coming-soon/ComingSoon';
import { Button } from '@/components/ui/button';
import { authStore } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/constant';
import { SignOutIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export default function ProDashboard() {
  const navigate = useNavigate();

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
    <div>
      <ComingSoon />
      <Button
        onClick={handleLogout}
        variant="destructive-outline"
        className="w-full justify-center gap-2"
      >
        <SignOutIcon size={20} />
        Déconnexion
      </Button>
    </div>
  );
}

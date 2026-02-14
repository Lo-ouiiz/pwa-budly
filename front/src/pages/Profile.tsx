import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authStore } from '@/lib/auth';

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/auth/logout', {
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
    <div className="p-4">
      <h1>Mon Profil</h1>
      <p>Bienvenue sur votre profil !</p>

      <Button onClick={handleLogout} className="mt-4">
        Déconnexion
      </Button>
    </div>
  );
}

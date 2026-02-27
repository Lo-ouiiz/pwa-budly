import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, PawPrintIcon, CalendarIcon, ReceiptIcon } from '@phosphor-icons/react';
import './Success.css';
import SponsorshipHero from '@/components/sponsorship-hero/SponsorshipHero';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  const { animalName, animalPhoto, planName, amount, endDate } = location.state ?? {};

  if (!animalName) {
    navigate('/');
    return null;
  }

  const formattedEndDate = new Date(endDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="success-page">
      <SponsorshipHero animalPhoto={animalPhoto} animalName={animalName} />

      <div className="success-content">
        <div className="success-icon">
          <CheckCircleIcon size={64} weight="fill" />
        </div>

        <h1>Merci pour votre parrainage !</h1>
        <p className="success-subtitle">
          Votre paiement a été accepté et votre parrainage est actif.
        </p>

        <div className="success-details">
          <div className="success-detail-row">
            <PawPrintIcon size={20} weight="fill" />
            <span>Animal parrainé : {animalName}</span>
          </div>
          <div className="success-detail-row">
            <ReceiptIcon size={20} weight="fill" />
            <span>
              Formule : {planName} - {amount}€
            </span>
          </div>
          <div className="success-detail-row">
            <CalendarIcon size={20} weight="fill" />
            <span>Parrainage actif jusqu'au {formattedEndDate}</span>
          </div>
        </div>

        <div className="success-actions">
          <Button size="lg" onClick={() => navigate('/animaux')}>
            Voir mes parrainages
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}

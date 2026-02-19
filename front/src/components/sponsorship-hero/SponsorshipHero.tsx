import { ArrowLeftIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import './SponsorshipHero.css';

interface SponsorshipHeroProps {
  animalPhoto?: string;
  animalName?: string;
  onBack?: () => void;
}

export default function SponsorshipHero({ animalPhoto, animalName, onBack }: SponsorshipHeroProps) {
  return (
    <div className="sponsorship-hero">
      {onBack && (
        <Button variant="outline" className="sponsorship-back-button" onClick={onBack}>
          <ArrowLeftIcon size={24} weight="bold" />
          <span className="back-button-text">Retour</span>
        </Button>
      )}

      {animalPhoto && (
        <img src={animalPhoto} alt={animalName || 'Animal'} className="sponsorship-hero-image" />
      )}
    </div>
  );
}

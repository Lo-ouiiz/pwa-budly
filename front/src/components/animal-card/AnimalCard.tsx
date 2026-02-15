import type { Animal } from '@/lib/interfaces';
import { PawPrintIcon, MapPinIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import './AnimalCard.css';

interface AnimalCardProps {
  animal: Animal;
}

export default function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <div className="animal-card">
      <div
        className="animal-card-image"
        style={{
          backgroundImage: animal.photos[0] ? `url(${animal.photos[0]})` : 'none',
          backgroundColor: animal.photos[0] ? 'transparent' : 'var(--muted)',
        }}
      />
      <div className="animal-card-body">
        <span className="animal-card-title">{animal.name}</span>
        <div className="animal-card-info">
          <PawPrintIcon weight="fill" className="animal-card-icon" />
          <span className="animal-card-info-text">{animal.species.name}</span>
        </div>
        <div className="animal-card-info">
          <MapPinIcon weight="fill" className="animal-card-icon" />
          <span className="animal-card-info-text">{animal.zoo.name}</span>
        </div>
        <Button variant="secondary" size="sm" className="animal-card-button">
          Voir plus
          <ArrowRightIcon weight="bold" />
        </Button>
      </div>
    </div>
  );
}

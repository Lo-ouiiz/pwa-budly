import { Link } from 'react-router-dom';
import type { Animal } from '@/lib/interfaces';
import { PawPrintIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import './ProAnimalCard.css';

interface ProAnimalCardProps {
  animal: Animal;
}

export default function ProAnimalCard({ animal }: ProAnimalCardProps) {
  return (
    <Link to={`/pro/gestion-animaux`} className="pro-animal-card">
      <div
        className="pro-animal-card-image"
        style={{
          backgroundImage: animal.photos[0] ? `url(${animal.photos[0]})` : 'none',
          backgroundColor: animal.photos[0] ? 'transparent' : 'var(--muted)',
        }}
      />
      <div className="pro-animal-card-body">
        <span className="pro-animal-card-title">{animal.name}</span>
        <div className="pro-animal-card-info">
          <PawPrintIcon weight="fill" className="pro-animal-card-icon" />
          <span className="pro-animal-card-info-text">
            {animal.subSpecies ? animal.subSpecies.name : animal.species.name}
          </span>
        </div>
        <Button variant="secondary" size="sm" className="pro-animal-card-button">
          Gérer
        </Button>
      </div>
    </Link>
  );
}

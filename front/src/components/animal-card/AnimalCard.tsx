import { Link } from 'react-router-dom';
import type { Animal } from '@/lib/interfaces';
import { PawPrintIcon, MapPinIcon, MedalIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import './AnimalCard.css';
import { Badge } from '../ui/badge';

interface AnimalCardProps {
  animal: Animal;
  showBadges?: boolean;
  isBest?: boolean;
}

export default function AnimalCard({
  animal,
  showBadges = false,
  isBest = false,
}: AnimalCardProps) {
  return (
    <Link to={`/animal/${animal.slug}`} state={{ animalId: animal.id }} className="animal-card">
      <div
        className="animal-card-image"
        style={{
          backgroundImage: animal.photos[0] ? `url(${animal.photos[0]})` : 'none',
          backgroundColor: animal.photos[0] ? 'transparent' : 'var(--muted)',
        }}
      >
        {isBest && (
          <Badge className="animal-card-best-badge" variant={'secondary'}>
            <MedalIcon size={18} weight="fill" />
            Meilleure correspondance
          </Badge>
        )}
      </div>
      <div className="animal-card-body">
        <span className="animal-card-title">{animal.name}</span>
        <div className="animal-card-info">
          <PawPrintIcon weight="fill" className="animal-card-icon" />
          <span className="animal-card-info-text">
            {animal.subSpecies ? animal.subSpecies.name : animal.species.name}
          </span>
        </div>
        <div className="animal-card-info">
          <MapPinIcon weight="fill" className="animal-card-icon" />
          <span className="animal-card-info-text">{animal.zoo.name}</span>
        </div>
        {showBadges && (
          <div className="animal-card-badges">
            {animal.traits.map((trait, index) => (
              <Badge key={index} variant="secondary">
                {trait}
              </Badge>
            ))}
          </div>
        )}
        <Button variant="secondary" size="sm" className="animal-card-button">
          Voir plus
        </Button>
      </div>
    </Link>
  );
}

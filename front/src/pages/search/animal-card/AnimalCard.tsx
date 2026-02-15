import type { Animal } from '@/lib/interfaces';
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
        <span className="animal-card-info">{animal.species.name}</span>
      </div>
    </div>
  );
}

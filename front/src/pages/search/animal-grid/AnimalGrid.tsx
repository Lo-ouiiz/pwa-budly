import { Skeleton } from '@/components/ui/skeleton';
import type { Animal } from '@/lib/interfaces';
import AnimalCard from '../animal-card/AnimalCard';
import './AnimalGrid.css';

interface AnimalGridProps {
  animals: Animal[];
  loading: boolean;
  limit: number;
}

export default function AnimalGrid({ animals, loading, limit }: AnimalGridProps) {
  if (loading) {
    return (
      <div className="animal-list">
        {[...Array(limit)].map((_, i) => (
          <Skeleton key={i} className="animal-card-skeleton" />
        ))}
      </div>
    );
  }

  if (animals.length === 0) {
    return <p className="no-animals">Aucun animal ne correspond aux filtres appliqués.</p>;
  }

  return (
    <div className="animal-list">
      {animals.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  );
}

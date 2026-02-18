import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import type { Animal } from '@/lib/interfaces';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AnimalCarousel from './animal-carousel/AnimalCarousel';
import AnimalHeader from './animal-header/AnimalHeader';
import AnimalCharacteristics from './animal-characteristics/AnimalCharacteristics';
import ConservationStatus from '../../components/conservation-status/ConservationStatus';
import './AnimalDetails.css';

export default function AnimalDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  const animalId = location.state?.animalId;

  useEffect(() => {
    if (!animalId) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    fetch(`http://localhost:3000/animals/${animalId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Animal not found');
        }
        return res.json();
      })
      .then((data: Animal) => {
        setAnimal(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [animalId]);

  const handleSponsorClick = () => {
    if (animal) {
      navigate('/offres-parrainage', {
        state: {
          zooId: animal.zooId,
          zooName: animal.zoo.name,
          animalName: animal.name,
          animalPhoto: animal.photos[0],
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="animal-detail">
        <Skeleton className="animal-detail-hero" />
        <div className="animal-detail-body">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="animal-detail">
        <div className="animal-detail-header">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeftIcon size={20} weight="bold" />
            Retour
          </Button>
        </div>
        <div className="animal-detail-not-found">
          <h1>Animal non trouvé</h1>
          <p>L'animal que vous recherchez n'existe pas.</p>
          <Button asChild>
            <Link to="/recherche">Voir tous les animaux</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animal-detail">
      <div className="animal-detail-hero">
        <Button
          variant="outline"
          className="animal-detail-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon size={24} weight="bold" />
          <span className="back-button-text">Retour</span>
        </Button>

        <AnimalCarousel photos={animal.photos} animalName={animal.name} />
      </div>

      <div className="animal-detail-body">
        <AnimalHeader
          name={animal.name}
          speciesName={animal.subSpecies ? animal.subSpecies.name : animal.species.name}
          zooName={animal.zoo.name}
          traits={animal.traits}
        />

        <div>
          <h3>À propos de {animal.name}</h3>
          <p>{animal.description}</p>
        </div>

        <AnimalCharacteristics
          age={animal.age}
          gender={animal.gender}
          birthPlace={animal.birthPlace}
          birthDate={animal.birthDate}
        />

        <ConservationStatus status={animal.conservationStatus} />
      </div>

      <div className="animal-detail-sponsor-footer">
        <Button size="lg" className="animal-detail-sponsor-button" onClick={handleSponsorClick}>
          Je parraine {animal.name}
        </Button>
      </div>
    </div>
  );
}

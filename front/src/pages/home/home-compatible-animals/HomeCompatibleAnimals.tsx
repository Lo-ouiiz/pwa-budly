import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/constant';
import type { Animal, Trait } from '@/lib/interfaces';
import { useUser } from '@/lib/hooks/useUser';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import AnimalCard from '@/components/animal-card/AnimalCard';
import './HomeCompatibleAnimals.css';

export default function HomeCompatibleAnimals() {
  const { traits, loading: userLoading } = useUser();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (userLoading || !traits.length) return;

    const params = new URLSearchParams();
    traits.forEach((t) => params.append('traits', t));
    params.set('limit', '20');

    fetch(`${API_BASE_URL}/animals?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.items ?? [])
          .map((animal: Animal) => ({
            animal,
            commonCount: animal.traits.filter((t) => traits.includes(t as Trait)).length,
          }))
          .sort(
            (a: { commonCount: number }, b: { commonCount: number }) =>
              b.commonCount - a.commonCount,
          )
          .slice(0, 5)
          .map(({ animal }: { animal: Animal }) => animal);
        setAnimals(sorted);
      })
      .catch(() => setAnimals([]))
      .finally(() => setFetched(true));
  }, [userLoading, traits]);

  // Encore en train de charger le user
  if (userLoading || (!fetched && traits.length > 0)) {
    return (
      <section className="home-compatible-section">
        <div className="home-compatible-header">
          <h1>Mes matchs</h1>
        </div>
        <Carousel opts={{ align: 'start', dragFree: true }} className="home-compatible-carousel">
          <CarouselContent>
            {[...Array(5)].map((_, i) => (
              <CarouselItem key={i} className="home-compatible-carousel-item">
                <Skeleton className="animal-card-skeleton" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  if (!traits.length || !animals.length) return null;

  return (
    <section className="home-compatible-section">
      <div className="home-compatible-header">
        <h1>Mes matchs</h1>
      </div>
      <Carousel opts={{ align: 'start', dragFree: true }} className="home-compatible-carousel">
        <CarouselContent>
          {animals.map((animal, index) => (
            <CarouselItem key={animal.id} className="home-compatible-carousel-item">
              <AnimalCard animal={animal} isBest={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="home-compatible-arrows">
          <CarouselPrevious className="home-compatible-carousel-prev">
            <ArrowLeftIcon size={20} weight="bold" />
          </CarouselPrevious>
          <CarouselNext className="home-compatible-carousel-next">
            <ArrowRightIcon size={20} weight="bold" />
          </CarouselNext>
        </div>
      </Carousel>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import type { Animal, RequestDataAnimals } from '@/lib/interfaces';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import './HomeAnimals.css';
import AnimalCard from '@/components/animal-card/AnimalCard';

export default function HomeAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    fetch(`http://localhost:3000/animals?limit=${limit}`)
      .then((res) => res.json())
      .then((data: RequestDataAnimals) => {
        setAnimals(data.items);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="home-animals-section">
        <div className="home-animals-header">
          <h1>Parrainer un animal</h1>
        </div>
        <Carousel opts={{ align: 'start', dragFree: true }} className="home-animals-carousel">
          <CarouselContent>
            {[...Array(limit)].map((_, i) => (
              <CarouselItem key={i} className="home-animals-carousel-item">
                <Skeleton className="animal-card-skeleton" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  if (animals.length === 0) {
    return (
      <section className="home-animals-section">
        <div className="home-animals-header">
          <h1>Parrainer un animal</h1>
        </div>
        <p className="p-4 text-center">Aucun animal trouvé.</p>
      </section>
    );
  }

  return (
    <section className="home-animals-section">
      <div className="home-animals-header">
        <h1>Parrainer un animal</h1>
      </div>
      <Carousel opts={{ align: 'start', dragFree: true }} className="home-animals-carousel">
        <CarouselContent>
          {animals.map((animal) => (
            <CarouselItem key={animal.id} className="home-animals-carousel-item">
              <AnimalCard animal={animal} />
            </CarouselItem>
          ))}
          <CarouselItem className="home-animals-carousel-item">
            <div className="home-animals-see-more-card">
              <Button asChild variant="outline" size="lg">
                <Link to="/recherche">
                  Voir plus
                  <ArrowRightIcon weight="bold" />
                </Link>
              </Button>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="home-animals-arrows">
          <CarouselPrevious className="home-animals-carousel-prev">
            <ArrowLeftIcon size={20} weight="bold" />
          </CarouselPrevious>
          <CarouselNext className="home-animals-carousel-next">
            <ArrowRightIcon size={20} weight="bold" />
          </CarouselNext>
        </div>
      </Carousel>
    </section>
  );
}

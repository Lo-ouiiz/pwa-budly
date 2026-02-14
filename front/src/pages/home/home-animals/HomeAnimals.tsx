import { useEffect, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import './HomeAnimals.css';

type Animal = {
  id: number;
  name: string;
  photos: string[];
};

export default function HomeAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/animals')
      .then((res) => res.json())
      .then((data: Animal[]) => {
        setAnimals(data);
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
            {[...Array(3)].map((_, i) => (
              <CarouselItem key={i} className="home-animals-carousel-item">
                <Skeleton className="h-60 w-full rounded-xl" />
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
              <div
                className="home-animals-card"
                style={{ backgroundImage: `url(${animal.photos[0]})` }}
              >
                <div className="home-animals-card-footer">
                  <p className="home-animals-card-title">{animal.name}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
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

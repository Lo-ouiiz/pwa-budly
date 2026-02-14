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
import './HomeZoos.css';

type Zoo = {
  id: number;
  name: string;
  logo: string;
  photos: string[];
};

export default function HomeZoos() {
  const [zoos, setZoos] = useState<Zoo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/zoos')
      .then((res) => res.json())
      .then((data: Zoo[]) => {
        setZoos(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="home-zoos-section">
        <div className="home-zoos-header">
          <h1>Nos zoos partenaires</h1>
        </div>

        <Carousel opts={{ align: 'start', dragFree: true }} className="home-zoos-carousel">
          <CarouselContent>
            {[...Array(3)].map((_, i) => (
              <CarouselItem key={i} className="home-zoos-carousel-item">
                <Skeleton className="h-60 w-full rounded-xl" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  if (zoos.length === 0) {
    return (
      <section className="home-zoos-section">
        <div className="home-zoos-header">
          <h1>Nos zoos partenaires</h1>
        </div>
        <p className="p-4 text-center">Aucun zoo trouvé.</p>
      </section>
    );
  }

  return (
    <section className="home-zoos-section">
      <div className="home-zoos-header">
        <h1>Nos zoos partenaires</h1>
      </div>

      <Carousel opts={{ align: 'start', dragFree: true }} className="home-zoos-carousel">
        <CarouselContent>
          {zoos.map((zoo) => (
            <CarouselItem key={zoo.id} className="home-zoos-carousel-item">
              <div className="home-zoos-card" style={{ backgroundImage: `url(${zoo.photos[0]})` }}>
                <div className="home-zoos-card-footer">
                  <p className="home-zoos-card-title">{zoo.name}</p>
                  <img src={zoo.logo} alt={zoo.name} className="home-zoos-card-logo" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="home-zoos-arrows">
          <CarouselPrevious className="home-zoos-carousel-prev">
            <ArrowLeftIcon size={20} weight="bold" />
          </CarouselPrevious>

          <CarouselNext className="home-zoos-carousel-next">
            <ArrowRightIcon size={20} weight="bold" />
          </CarouselNext>
        </div>
      </Carousel>
    </section>
  );
}

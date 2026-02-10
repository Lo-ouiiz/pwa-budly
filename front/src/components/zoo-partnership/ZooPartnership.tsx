import { useEffect, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import './ZooPartnership.css';
import { Skeleton } from '../ui/skeleton';

type Zoo = {
  id: number;
  name: string;
  logo: string;
  photos: string[];
};

export default function ZooPartnership() {
  const [zoos, setZoos] = useState<Zoo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/zoos')
      .then((res) => res.json())
      .then((data: Zoo[]) => {
        console.log(data);
        setZoos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des zoos:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="zoo-section">
        <div className="zoo-header">
          <h1>Nos zoos partenaires</h1>
        </div>
        <Carousel opts={{ align: 'start', dragFree: true }} className="zoo-carousel">
          <CarouselContent>
            {[...Array(3)].map((_, i) => (
              <CarouselItem key={i} className="zoo-carousel-item">
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
      <section className="zoo-section">
        <div className="zoo-header">
          <h1>Nos zoos partenaires</h1>
        </div>
        <p className="p-4 text-center">Aucun zoo trouvé.</p>;
      </section>
    );
  }

  return (
    <section className="zoo-section">
      <div className="zoo-header">
        <h1>Nos zoos partenaires</h1>
      </div>

      <Carousel opts={{ align: 'start', dragFree: true }} className="zoo-carousel">
        <CarouselContent>
          {zoos.map((zoo) => (
            <CarouselItem key={zoo.name} className="zoo-carousel-item">
              <div className="zoo-card" style={{ backgroundImage: `url(${zoo.photos[0]})` }}>
                <div className="zoo-card-overlay" />
                <div className="zoo-card-content">
                  <img src={zoo.logo} alt={`Logo de ${zoo.name}`} className="zoo-card-logo" />
                  <h3 className="zoo-card-title">{zoo.name}</h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="zoo-arrows">
          <CarouselPrevious className="zoo-carousel-prev">
            <ArrowLeftIcon size={18} weight="bold" />
          </CarouselPrevious>

          <CarouselNext className="zoo-carousel-next">
            <ArrowRightIcon size={18} weight="bold" />
          </CarouselNext>
        </div>
      </Carousel>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/constant';
import { ArrowLeftIcon, ArrowRightIcon, MapPinIcon } from '@phosphor-icons/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
  slug: string;
  city?: string;
};

export default function HomeZoos() {
  const [zoos, setZoos] = useState<Zoo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_BASE_URL + '/zoos')
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
              <Link to="/" className="home-zoos-card">
                <div
                  className="home-zoos-card-image"
                  style={{
                    backgroundImage: zoo.photos[0] ? `url(${zoo.photos[0]})` : 'none',
                    backgroundColor: zoo.photos[0] ? 'transparent' : 'var(--muted)',
                  }}
                />
                <div className="home-zoos-card-body">
                  <div className="home-zoos-card-content">
                    <div className="home-zoos-card-info-wrapper">
                      <span className="home-zoos-card-title">{zoo.name}</span>
                      {zoo.city && (
                        <div className="home-zoos-card-info">
                          <MapPinIcon weight="fill" className="home-zoos-card-icon" />
                          <span className="home-zoos-card-info-text">{zoo.city}</span>
                        </div>
                      )}
                    </div>
                    {zoo.logo && (
                      <img src={zoo.logo} alt={zoo.name} className="home-zoos-card-logo" />
                    )}
                  </div>
                  <Button variant="secondary" size="sm" className="home-zoos-card-button">
                    Découvrir
                  </Button>
                </div>
              </Link>
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

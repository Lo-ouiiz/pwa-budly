import { useState, useRef } from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import './AnimalCarousel.css';

interface AnimalCarouselProps {
  photos: string[];
  animalName: string;
}

export default function AnimalCarousel({ photos, animalName }: AnimalCarouselProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.offsetWidth * index;
      carouselRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const nextPhoto = () => {
    const newIndex = (currentPhotoIndex + 1) % photos.length;
    setCurrentPhotoIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const prevPhoto = () => {
    const newIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    setCurrentPhotoIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setCurrentPhotoIndex(newIndex);
  };

  return (
    <>
      <div ref={carouselRef} className="animal-carousel-container" onScroll={handleScroll}>
        {photos.map((photo, index) => (
          <div key={index} className="animal-carousel-slide">
            <img
              src={photo || '/placeholder-animal.jpg'}
              alt={`${animalName} - Photo ${index + 1}`}
              className="animal-carousel-image"
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <Button
            variant="outline"
            className="carousel-button carousel-button-prev carousel-button-desktop"
            onClick={prevPhoto}
          >
            <CaretLeftIcon size={32} weight="bold" />
          </Button>
          <Button
            variant="outline"
            className="carousel-button carousel-button-next carousel-button-desktop"
            onClick={nextPhoto}
          >
            <CaretRightIcon size={32} weight="bold" />
          </Button>

          <div className="carousel-indicators">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${currentPhotoIndex === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPhotoIndex(index);
                  scrollToIndex(index);
                }}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

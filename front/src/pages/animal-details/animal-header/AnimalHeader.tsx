import { MapPinIcon, PawPrintIcon } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import './AnimalHeader.css';

interface AnimalHeaderProps {
  name: string;
  speciesName: string;
  zooName: string;
  traits: string[];
}

export default function AnimalHeader({ name, speciesName, zooName, traits }: AnimalHeaderProps) {
  return (
    <div className="animal-header">
      <h2>{name}</h2>
      <div className="animal-header-zoo">
        <div>
          <PawPrintIcon size={16} weight="fill" />
          <span>{speciesName}</span>
        </div>
        •
        <div>
          <MapPinIcon size={16} weight="fill" />
          <span>{zooName}</span>
        </div>
      </div>
      <div className="animal-header-traits">
        {traits.map((trait, index) => (
          <Badge key={index} variant="secondary">
            {trait}
          </Badge>
        ))}
      </div>
    </div>
  );
}

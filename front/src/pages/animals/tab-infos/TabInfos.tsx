import type { Animal } from '@/lib/interfaces';
import AnimalHeader from '@/pages/animal-details/animal-header/AnimalHeader';
import ConservationStatus from '@/components/conservation-status/ConservationStatus';
import {
  CakeIcon,
  GenderIntersexIcon,
  BarbellIcon,
  ArrowsVerticalIcon,
  CalendarHeartIcon,
} from '@phosphor-icons/react';
import './TabInfos.css';

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));

export default function TabInfos({ animal }: { animal: Animal }) {
  return (
    <div className="infos-tab">
      <div className="infos-body">
        <AnimalHeader
          name={animal.name}
          speciesName={animal.subSpecies ? animal.subSpecies.name : animal.species.name}
          zooName={animal.zoo.name}
          traits={animal.traits}
        />

        {animal.description && (
          <div>
            <h3 className="infos-section-title">À propos de {animal.name}</h3>
            <p className="infos-text">{animal.description}</p>
          </div>
        )}

        {animal.story && (
          <div>
            <h3 className="infos-section-title">Son histoire</h3>
            <p className="infos-text">{animal.story}</p>
          </div>
        )}

        <ConservationStatus status={animal.conservationStatus} />

        <div className="infos-complementaires">
          <h3 className="infos-section-title">Informations complémentaires</h3>
          <div className="infos-tiles-list">
            {animal.age && (
              <div className="infos-tile">
                <div className="infos-tile-container">
                  <CakeIcon size={18} />
                  <span className="infos-tile-label">Âge</span>
                </div>
                <span className="infos-tile-value">{animal.age} ans</span>
              </div>
            )}
            {animal.gender && (
              <div className="infos-tile">
                <div className="infos-tile-container">
                  <GenderIntersexIcon size={18} />
                  <span className="infos-tile-label">Genre</span>
                </div>
                <span className="infos-tile-value">{animal.gender}</span>
              </div>
            )}
            {animal.weight && (
              <div className="infos-tile">
                <div className="infos-tile-container">
                  <BarbellIcon size={18} />
                  <span className="infos-tile-label">Poids</span>
                </div>
                <span className="infos-tile-value">{animal.weight} kg</span>
              </div>
            )}
            {animal.size && (
              <div className="infos-tile">
                <div className="infos-tile-container">
                  <ArrowsVerticalIcon size={18} />
                  <span className="infos-tile-label">Taille</span>
                </div>
                <span className="infos-tile-value">{animal.size} m</span>
              </div>
            )}
            {animal.lifeExpectancyYears && (
              <div className="infos-tile">
                <div className="infos-tile-container">
                  <CalendarHeartIcon size={18} />
                  <span className="infos-tile-label">Espérance de vie</span>
                </div>
                <span className="infos-tile-value">{animal.lifeExpectancyYears} ans</span>
              </div>
            )}
          </div>
          <div className="infos-tiles-list">
            {animal.birthPlace && animal.birthDate && (
              <div className="infos-tile full">
                <span className="infos-tile-label">Naissance</span>
                <span className="infos-tile-value">
                  {fmt(animal.birthDate)} · {animal.birthPlace}
                </span>
              </div>
            )}
            {animal.naturalHabitat && (
              <div className="infos-tile full">
                <span className="infos-tile-label">Habitat naturel</span>
                <span className="infos-tile-value">{animal.naturalHabitat}</span>
              </div>
            )}
            {animal.diet && (
              <div className="infos-tile full">
                <span className="infos-tile-label">Régime alimentaire</span>
                <span className="infos-tile-value">{animal.diet}</span>
              </div>
            )}
            {animal.physicalSpecificity && (
              <div className="infos-tile full">
                <span className="infos-tile-label">Particularités physiques</span>
                <span className="infos-tile-value">{animal.physicalSpecificity}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

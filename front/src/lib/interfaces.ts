export type ConservationStatus = 'LC' | 'NT' | 'VU' | 'EN' | 'CR';

export interface Animal {
  age: number;
  birthDate: string;
  birthPlace: string;
  conservationStatus: ConservationStatus;
  description: string;
  diet: string;
  gender: string;
  id: number;
  lifeExpectancyYears: number;
  name: string;
  naturalHabitat: string;
  photos: string[];
  physicalSpecificity: string;
  size: number;
  slug: string;
  species: { id: number; name: string; createdAt: string };
  speciesId: number;
  sponsorshipImpact: string;
  story: string;
  subSpecies: { id: number; name: string; speciesId: number };
  subSpeciesId: number;
  traits: string[];
  weight: number;
  zooId: number;
  zoo: { name: string };
}

export interface RequestDataAnimals {
  page: number;
  totalPages: number;
  totalItems: number;
  items: Animal[];
}

export interface Zoo {
  id: number;
  name: string;
  slug: string;
  logo: string;
}

export interface SponsorshipPlan {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  taxReducedPrice: number | null;
  benefits: string[];
  durationMonths: number;
  zooId: number;
  deletedAt: string | null;
  zoo: Zoo;
}

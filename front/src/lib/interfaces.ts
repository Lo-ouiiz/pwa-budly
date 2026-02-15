export interface Animal {
  age: number;
  birthDate: string;
  birthPlace: string;
  conservationStatus: string;
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
}

export interface RequestDataAnimals {
  page: number;
  totalPages: number;
  totalItems: number;
  items: Animal[];
}

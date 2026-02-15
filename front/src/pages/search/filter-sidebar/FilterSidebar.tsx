import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { XIcon, CaretDown } from '@phosphor-icons/react';
import './FilterSidebar.css';

interface Species {
  id: number;
  name: string;
}

interface Zoo {
  id: number;
  name: string;
}

interface Filters {
  species: string[];
  gender: string[];
  conservationStatus: string[];
  zoos: number[];
  traits: string[];
}

interface FilterSidebarProps {
  filters: Filters;
  sortOrder: 'asc' | 'desc';
  availableSpecies: Species[];
  availableZoos: Zoo[];
  loadingSpecies: boolean;
  loadingZoos: boolean;
  showFilters: boolean;
  onFilterChange: (filterType: keyof Filters, value: string | number) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
  onClose: () => void;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Mâle' },
  { value: 'female', label: 'Femelle' },
];

const CONSERVATION_STATUS_OPTIONS = [
  { value: 'CR', label: 'En danger critique (CR)' },
  { value: 'EN', label: 'En danger (EN)' },
  { value: 'VU', label: 'Vulnérable (VU)' },
  { value: 'NT', label: 'Quasi menacé (NT)' },
  { value: 'LC', label: 'Préoccupation mineure (LC)' },
];

const PERSONALITY_TRAITS = [
  'Solitaire',
  'Sociable',
  'Affectueux',
  'Territorial',
  'Protecteur',
  'Indépendant',
  'Amical',
  'Curieux',
  'Paresseux',
  'Energique',
  'Joueur',
  'Endormi',
  'Timide',
  'Audacieux',
  'Colérique',
  'Calme',
  'Sensible',
  'Méfiant',
  'Joyeux',
  'Drôle',
  'Grognon',
  'Mystérieux',
  'Fier',
  'Arrogant',
  'Charmant',
  'Majestueux',
];

export default function FilterSidebar({
  filters,
  sortOrder,
  availableSpecies,
  availableZoos,
  loadingSpecies,
  loadingZoos,
  showFilters,
  onFilterChange,
  onSortOrderChange,
  onClearFilters,
  onClose,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.species.length > 0 ||
    filters.gender.length > 0 ||
    filters.conservationStatus.length > 0 ||
    filters.zoos.length > 0 ||
    filters.traits.length > 0;

  return (
    <aside className={`filters-sidebar ${showFilters ? 'filters-sidebar-open' : ''}`}>
      <div className="filters-sidebar-header">
        <h2 className="filters-title">Filtres / tri</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="filters-close-btn">
          <XIcon />
        </Button>
      </div>

      <div className="filters-content">
        <div className="sort-section">
          <span className="sort-label">Trier les animaux</span>
          <Select
            value={sortOrder}
            onValueChange={(value: string) => onSortOrderChange(value as 'asc' | 'desc')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Par ordre alphabétique</SelectItem>
              <SelectItem value="desc">Par ordre alphabétique inversé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Accordion
          type="multiple"
          defaultValue={['species', 'gender', 'conservation', 'zoos', 'traits']}
        >
          {/* Filtre Espèces */}
          <AccordionItem value="species">
            <AccordionTrigger className="accordion-trigger">
              <div className="accordion-trigger-content">
                <span>Espèces</span>
                {filters.species.length > 0 && (
                  <span className="filter-count">({filters.species.length})</span>
                )}
              </div>
              <CaretDown className="accordion-chevron" weight="bold" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="checkbox-list">
                {loadingSpecies ? (
                  <div className="filter-loading">Chargement...</div>
                ) : availableSpecies.length === 0 ? (
                  <div className="filter-empty">Aucune espèce disponible</div>
                ) : (
                  availableSpecies.map((species) => (
                    <label key={species.id} className="checkbox-item">
                      <Checkbox
                        checked={filters.species.includes(species.name)}
                        onCheckedChange={() => onFilterChange('species', species.name)}
                      />
                      <span className="checkbox-label">{species.name}</span>
                    </label>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filtre Zoos */}
          <AccordionItem value="zoos">
            <AccordionTrigger className="accordion-trigger">
              <div className="accordion-trigger-content">
                <span>Zoos</span>
                {filters.zoos.length > 0 && (
                  <span className="filter-count">({filters.zoos.length})</span>
                )}
              </div>
              <CaretDown className="accordion-chevron" weight="bold" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="checkbox-list">
                {loadingZoos ? (
                  <div className="filter-loading">Chargement...</div>
                ) : availableZoos.length === 0 ? (
                  <div className="filter-empty">Aucun zoo disponible</div>
                ) : (
                  availableZoos.map((zoo) => (
                    <label key={zoo.id} className="checkbox-item">
                      <Checkbox
                        checked={filters.zoos.includes(zoo.id)}
                        onCheckedChange={() => onFilterChange('zoos', zoo.id)}
                      />
                      <span className="checkbox-label">{zoo.name}</span>
                    </label>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filtre Genre */}
          <AccordionItem value="gender">
            <AccordionTrigger className="accordion-trigger">
              <div className="accordion-trigger-content">
                <span>Genre</span>
                {filters.gender.length > 0 && (
                  <span className="filter-count">({filters.gender.length})</span>
                )}
              </div>
              <CaretDown className="accordion-chevron" weight="bold" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="checkbox-list">
                {GENDER_OPTIONS.map((option) => (
                  <label key={option.value} className="checkbox-item">
                    <Checkbox
                      checked={filters.gender.includes(option.value)}
                      onCheckedChange={() => onFilterChange('gender', option.value)}
                    />
                    <span className="checkbox-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filtre Statut de conservation */}
          <AccordionItem value="conservation">
            <AccordionTrigger className="accordion-trigger">
              <div className="accordion-trigger-content">
                <span>Statut de conservation</span>
                {filters.conservationStatus.length > 0 && (
                  <span className="filter-count">({filters.conservationStatus.length})</span>
                )}
              </div>
              <CaretDown className="accordion-chevron" weight="bold" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="checkbox-list">
                {CONSERVATION_STATUS_OPTIONS.map((option) => (
                  <label key={option.value} className="checkbox-item">
                    <Checkbox
                      checked={filters.conservationStatus.includes(option.value)}
                      onCheckedChange={() => onFilterChange('conservationStatus', option.value)}
                    />
                    <span className="checkbox-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filtre Traits de personnalité */}
          <AccordionItem value="traits">
            <AccordionTrigger className="accordion-trigger">
              <div className="accordion-trigger-content">
                <span>Traits de personnalité</span>
                {filters.traits.length > 0 && (
                  <span className="filter-count">({filters.traits.length})</span>
                )}
              </div>
              <CaretDown className="accordion-chevron" weight="bold" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="checkbox-list">
                {PERSONALITY_TRAITS.map((trait) => (
                  <label key={trait} className="checkbox-item">
                    <Checkbox
                      checked={filters.traits.includes(trait)}
                      onCheckedChange={() => onFilterChange('traits', trait)}
                    />
                    <span className="checkbox-label">{trait}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {hasActiveFilters && (
          <Button variant="destructive-outline" size="sm" onClick={onClearFilters}>
            <XIcon />
            Effacer tous les filtres
          </Button>
        )}
      </div>
    </aside>
  );
}

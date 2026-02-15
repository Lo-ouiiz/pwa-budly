import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Animal, RequestDataAnimals } from '@/lib/interfaces';
import { FunnelIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import FilterSidebar from './filter-sidebar/FilterSidebar';
import AnimalGrid from './animal-grid/AnimalGrid';
import Pagination from './pagination/Pagination';
import './Search.css';

interface Filters {
  species: string[];
  gender: string[];
  conservationStatus: string[];
  zoos: number[];
  traits: string[];
}

interface Species {
  id: number;
  name: string;
}

interface Zoo {
  id: number;
  name: string;
}

export default function Search() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [availableSpecies, setAvailableSpecies] = useState<Species[]>([]);
  const [availableZoos, setAvailableZoos] = useState<Zoo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSpecies, setLoadingSpecies] = useState(true);
  const [loadingZoos, setLoadingZoos] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState<Filters>({
    species: [],
    gender: [],
    conservationStatus: [],
    zoos: [],
    traits: [],
  });

  const limit = 10;

  useEffect(() => {
    const fetchSpecies = async () => {
      setLoadingSpecies(true);
      try {
        const res = await fetch('http://localhost:3000/species');
        const data: Species[] = await res.json();
        setAvailableSpecies(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des espèces:', err);
      } finally {
        setLoadingSpecies(false);
      }
    };
    fetchSpecies();
  }, []);

  useEffect(() => {
    const fetchZoos = async () => {
      setLoadingZoos(true);
      try {
        const res = await fetch('http://localhost:3000/zoos');
        const data: Zoo[] = await res.json();
        setAvailableZoos(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des zoos:', err);
      } finally {
        setLoadingZoos(false);
      }
    };
    fetchZoos();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sortOrder: sortOrder,
          });

          if (searchQuery) {
            params.append('search', searchQuery);
          }

          filters.species.forEach((species) => params.append('species', species));
          filters.gender.forEach((gender) => params.append('gender', gender));
          filters.conservationStatus.forEach((status) =>
            params.append('conservationStatus', status),
          );
          filters.zoos.forEach((zooId) => params.append('zooId', String(zooId)));
          filters.traits.forEach((trait) => params.append('traits', trait));

          const res = await fetch(`http://localhost:3000/animals?${params.toString()}`);
          const data: RequestDataAnimals = await res.json();
          setAnimals(data.items);
          setTotalPages(data.totalPages);
          setPage(data.page);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, filters, sortOrder, searchQuery]);

  const handleFilterChange = (filterType: keyof Filters, value: string | number) => {
    setFilters((prev) => {
      const currentValues = prev[filterType] as (string | number)[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
    setPage(1);
  };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      species: [],
      gender: [],
      conservationStatus: [],
      zoos: [],
      traits: [],
    });
    setSearchQuery('');
    setPage(1);
  };

  const hasActiveFilters =
    filters.species.length > 0 ||
    filters.gender.length > 0 ||
    filters.conservationStatus.length > 0 ||
    filters.zoos.length > 0 ||
    filters.traits.length > 0 ||
    searchQuery.length > 0;

  const totalActiveFilters =
    filters.species.length +
    filters.gender.length +
    filters.conservationStatus.length +
    filters.zoos.length +
    filters.traits.length +
    (searchQuery ? 1 : 0);

  return (
    <section className="search-animals-section">
      <div className="search-header-mobile">
        <div className="search-input-wrapper-mobile">
          <MagnifyingGlassIcon className="search-input-icon" weight="bold" />
          <Input
            type="text"
            placeholder="Animal ou une espèce..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle-mobile"
        >
          <FunnelIcon weight="regular" />
          <span>Filtrer</span>
          {hasActiveFilters && <span className="filter-badge">{totalActiveFilters}</span>}
        </Button>
      </div>

      {showFilters && <div className="filters-overlay" onClick={() => setShowFilters(false)} />}

      <div className="search-content">
        <FilterSidebar
          filters={filters}
          sortOrder={sortOrder}
          searchQuery={searchQuery}
          availableSpecies={availableSpecies}
          availableZoos={availableZoos}
          loadingSpecies={loadingSpecies}
          loadingZoos={loadingZoos}
          showFilters={showFilters}
          onFilterChange={handleFilterChange}
          onSortOrderChange={handleSortOrderChange}
          onSearchChange={handleSearchChange}
          onClearFilters={clearFilters}
          onClose={() => setShowFilters(false)}
        />

        <main className="search-main">
          <AnimalGrid animals={animals} loading={loading} limit={limit} />

          {!loading && animals.length > 0 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </main>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Animal, RequestDataAnimals } from '@/lib/interfaces';
import './Search.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export default function Search() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/animals?page=${page}&limit=${limit}`);
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
  }, [page]);

  if (loading) {
    return (
      <section className="search-animals-section">
        <h1 className="search-title">Liste des animaux</h1>
        <div className="animal-list">
          {[...Array(limit)].map((_, i) => (
            <Skeleton key={i} className="animal-card-skeleton" />
          ))}
        </div>
      </section>
    );
  }

  if (animals.length === 0) {
    return (
      <section className="search-animals-section">
        <h1 className="search-title">Liste des animaux</h1>
        <p className="no-animals">Aucun animal trouvé.</p>
      </section>
    );
  }

  return (
    <section className="search-animals-section">
      <h1 className="search-title">Liste des animaux</h1>

      <div className="animal-list">
        {animals.map((animal) => (
          <div key={animal.id} className="animal-card">
            <div className="animal-card-image" data-image={animal.photos[0]} />
            <div className="animal-card-body">
              <span className="animal-card-title">{animal.name}</span>
              <span className="animal-card-info">{animal.species.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="pagination-button"
        >
          <ArrowLeftIcon />
          <span className="mr-1 hidden sm:inline">Précédent</span>
        </Button>

        <span className="pagination-page">
          Page {page} sur {totalPages}
        </span>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="pagination-button"
        >
          <span className="mr-1 hidden sm:inline">Suivant</span>
          <ArrowRightIcon />
        </Button>
      </div>
    </section>
  );
}

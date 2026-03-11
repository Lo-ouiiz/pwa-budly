import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/constant';
import { authStore } from '@/lib/auth';
import { useUser } from '@/lib/hooks/useUser';
import type { Animal, RequestDataAnimals } from '@/lib/interfaces';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import ProAnimalCard from '@/components/pro-animal-card/ProAnimalCard';
import Pagination from '@/pages/search/pagination/Pagination';
import './ProAnimalList.css';

export default function ProAnimalList() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const limit = 20;

  useEffect(() => {
    if (!user?.zooId) return;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          zooId: String(user.zooId),
        });

        if (searchQuery) params.append('search', searchQuery);

        const res = await fetch(`${API_BASE_URL}/animals?${params.toString()}`, {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
          credentials: 'include',
        });
        const data: RequestDataAnimals = await res.json();
        setAnimals(data.items);
        setTotalPages(data.totalPages);
        setPage(data.page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [user?.zooId, page, searchQuery]);

  return (
    <section className="pro-animal-list-section">
      <div className="pro-animal-list-header">
        <h1>Gestion des animaux</h1>
        <Button onClick={() => navigate('/pro/ajouter-animal')}>
          <PlusIcon weight="bold" />
          Ajouter un animal
        </Button>
      </div>

      <div className="pro-animal-list-search">
        <div className="pro-animal-list-search-wrapper">
          <MagnifyingGlassIcon className="pro-animal-list-search-icon" weight="bold" />
          <Input
            type="text"
            placeholder="Rechercher un animal..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pro-animal-list-search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="pro-animal-list-grid">
          {[...Array(limit)].map((_, i) => (
            <Skeleton key={i} className="pro-animal-list-skeleton" />
          ))}
        </div>
      ) : animals.length === 0 ? (
        <p className="pro-animal-list-empty">Aucun animal trouvé.</p>
      ) : (
        <div className="pro-animal-list-grid">
          {animals.map((animal) => (
            <ProAnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}

      {!loading && animals.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </section>
  );
}

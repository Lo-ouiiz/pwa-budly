import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/constant';
import { type Sponsorship } from '@/lib/interfaces';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TabDon from './tab-don/TabDon';
import TabSante from './tab-sante/TabSante';
import TabInfos from './tab-infos/TabInfos';
import TabMedias from './tab-medias/TabMedias';
import './Animals.css';

const firstPhoto = (photos: string[], fallback = '/placeholder-animal.jpg') =>
  photos?.[0] ?? fallback;

export default function Animals() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    fetchWithAuth(API_BASE_URL + '/sponsorships/user/me')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json() as Promise<Sponsorship[]>;
      })
      .then((data) => {
        setSponsorships(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Impossible de charger vos parrainages.');
        setLoading(false);
      });
  }, []);

  const selected = sponsorships[activeIdx];

  if (loading) {
    return (
      <div className="animals-page">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="flex gap-3 mb-4">
          <Skeleton className="w-[68px] h-[68px] rounded-lg shrink-0" />
          <Skeleton className="w-[68px] h-[68px] rounded-lg shrink-0" />
          <Skeleton className="w-[68px] h-[68px] rounded-lg shrink-0" />
        </div>
        <Skeleton className="w-full h-[60px] rounded-lg mb-4" />
        <Skeleton className="w-full h-20 rounded-lg mb-3" />
        <Skeleton className="w-full h-20 rounded-lg" />
      </div>
    );
  }
  if (error) return <div className="animals-error">{error}</div>;

  if (!sponsorships.length) {
    return (
      <div className="animals-empty">
        <h1 className="animals-title">Mon tableau de bord</h1>
        <p>Vous n'avez aucun parrainage actif pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="animals-page">
      <h1 className="animals-title">Mon tableau de bord</h1>

      <div className="animals-layout">
        <aside className="animals-sidebar">
          <div className="animals-chips-list">
            {sponsorships.map((sp, i) => (
              <button
                key={sp.id}
                className={`animal-chip ${i === activeIdx ? 'active' : ''}`}
                onClick={() => setActiveIdx(i)}
                aria-label={`Sélectionner ${sp.animal.name}`}
              >
                <div className="animal-chip-avatar">
                  <img
                    className="animal-chip-img"
                    src={firstPhoto(sp.animal.photos)}
                    alt={sp.animal.name}
                  />
                </div>
                <span className="animal-chip-name">{sp.animal.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {selected && (
          <div className="animals-main" key={selected.id}>
            <div className="animal-hero">
              <img
                className="animal-hero-img"
                src={firstPhoto(selected.animal.photos)}
                alt={selected.animal.name}
              />
              <div className="animal-hero-text">
                <h2 className="animal-hero-name">{selected.animal.name}</h2>
                <span className="animal-hero-species">
                  {selected.animal.subSpecies
                    ? selected.animal.subSpecies.name
                    : selected.animal.species.name}
                </span>
              </div>
            </div>

            <Tabs defaultValue="medias" className="animal-tabs">
              <TabsList variant="line" className="animal-tabs-list">
                <TabsTrigger value="medias" className="animal-tab-trigger">
                  Fil d'actualité
                </TabsTrigger>
                <TabsTrigger value="don" className="animal-tab-trigger">
                  Mon don
                </TabsTrigger>
                <TabsTrigger value="sante" className="animal-tab-trigger">
                  Carnet de santé
                </TabsTrigger>
                <TabsTrigger value="infos" className="animal-tab-trigger">
                  Informations {selected.animal.name}
                </TabsTrigger>
                <div className="tabs-filler" />
              </TabsList>

              <TabsContent value="medias">
                <TabMedias animal={selected.animal} />
              </TabsContent>
              <TabsContent value="don">
                <TabDon sponsorship={selected} />
              </TabsContent>
              <TabsContent value="sante">
                <TabSante />
              </TabsContent>
              <TabsContent value="infos">
                <TabInfos animal={selected.animal} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

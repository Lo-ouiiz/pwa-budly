import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import type { SponsorshipPlan } from '@/lib/interfaces';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SponsorshipHero from './sponsorship-hero/SponsorshipHero';
import PlanTabs from './plan-tabs/PlanTabs';
import PlanDetail from './plan-detail/PlanDetail';
import './Sponsorships.css';

export default function Sponsorships() {
  const location = useLocation();
  const navigate = useNavigate();

  const zooId = location.state?.zooId;
  const animalName = location.state?.animalName;
  const animalPhoto = location.state?.animalPhoto;

  const [plans, setPlans] = useState<SponsorshipPlan[]>([]);
  const [loading, setLoading] = useState(!!zooId);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  useEffect(() => {
    if (!zooId) {
      return;
    }

    fetch(`http://localhost:3000/plans?zooId=${zooId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Plans not found');
        }
        return res.json();
      })
      .then((data: SponsorshipPlan[]) => {
        setPlans(data);
        if (data.length > 0) {
          setSelectedPlan(data[0].id.toString());
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [zooId]);

  const handlePaymentClick = () => {
    navigate('/paiement', {
      state: {
        zooId,
        planId: plans[0].id,
        animalName,
        animalPhoto,
      },
    });
  };

  if (!zooId) {
    return (
      <div className="sponsorship-page">
        <div className="sponsorship-header">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeftIcon size={20} weight="bold" />
            Retour
          </Button>
        </div>
        <div className="no-plans">
          <h2>Zoo non trouvé</h2>
          <p>Impossible de charger les offres de parrainage.</p>
          <Button onClick={() => navigate('/recherche')}>Retour à la recherche</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="sponsorship-page">
        <div className="sponsorship-hero">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="sponsorship-content">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="sponsorship-page">
        <div className="sponsorship-header">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeftIcon size={20} weight="bold" />
            Retour
          </Button>
        </div>
        <div className="no-plans">
          <h2>Aucune offre disponible</h2>
          <p>Ce zoo ne propose pas d'offres de parrainage pour le moment.</p>
          <Button onClick={() => navigate('/recherche')}>Retour à la recherche</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="sponsorship-page">
      <SponsorshipHero
        animalPhoto={animalPhoto}
        animalName={animalName}
        onBack={() => navigate(-1)}
      />

      <div className="sponsorship-content">
        <div className="sponsorship-intro">
          <h1>Je choisis ma formule de parrainage</h1>
          <p>
            En parrainant {animalName}, vous contribuez directement à son bien-être et à la
            protection de son espèce.
          </p>
        </div>

        {plans.length === 1 ? (
          <PlanDetail
            name={plans[0].name}
            description={plans[0].description}
            basePrice={plans[0].basePrice}
            taxReducedPrice={plans[0].taxReducedPrice}
            durationMonths={plans[0].durationMonths}
            benefits={plans[0].benefits}
            animalName={animalName}
            onSubscribe={handlePaymentClick}
          />
        ) : (
          <PlanTabs
            plans={plans}
            selectedPlan={selectedPlan}
            onPlanChange={setSelectedPlan}
            animalName={animalName}
            onSubscribe={handlePaymentClick}
          />
        )}
      </div>
    </div>
  );
}

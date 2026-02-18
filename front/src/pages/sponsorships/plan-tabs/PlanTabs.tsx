import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlanDetail from '../plan-detail/PlanDetail';
import './PlanTabs.css';
import type { SponsorshipPlan } from '@/lib/interfaces';

interface PlanTabsProps {
  plans: SponsorshipPlan[];
  selectedPlan: string;
  onPlanChange: (value: string) => void;
  animalName?: string;
}

export default function PlanTabs({ plans, selectedPlan, onPlanChange, animalName }: PlanTabsProps) {
  return (
    <Tabs value={selectedPlan} onValueChange={onPlanChange} className="sponsorship-tabs">
      <TabsList className="sponsorship-tabs-list">
        {plans.map((plan) => (
          <TabsTrigger key={plan.id} value={plan.id.toString()} className="sponsorship-tab">
            <div className="tab-content">
              <span className="tab-name">{plan.name}</span>
              <span className="tab-price">{plan.basePrice}€</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {plans.map((plan) => (
        <TabsContent key={plan.id} value={plan.id.toString()} className="sponsorship-tab-content">
          <PlanDetail
            name={plan.name}
            description={plan.description}
            basePrice={plan.basePrice}
            taxReducedPrice={plan.taxReducedPrice}
            durationMonths={plan.durationMonths}
            benefits={plan.benefits}
            animalName={animalName}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

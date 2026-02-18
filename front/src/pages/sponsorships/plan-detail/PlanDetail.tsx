import { CheckIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import './PlanDetail.css';

interface PlanDetailProps {
  name: string;
  description: string;
  basePrice: number;
  taxReducedPrice: number | null;
  durationMonths: number;
  benefits: string[];
  animalName?: string;
  onSubscribe: () => void;
}

export default function PlanDetail({
  name,
  description,
  basePrice,
  taxReducedPrice,
  durationMonths,
  benefits,
  animalName,
  onSubscribe,
}: PlanDetailProps) {
  return (
    <div className="plan-detail">
      <div className="plan-header">
        <div className="plan-title-section">
          <h2>{name}</h2>
          <p className="plan-description">{description}</p>
        </div>
        <div className="plan-pricing">
          <div className="price-main">
            <span className="price-amount">{basePrice}€</span>
          </div>
          <p className="price-duration">Pour une durée de {durationMonths} mois</p>
        </div>
      </div>

      {taxReducedPrice && (
        <div className="price-tax">
          <div className="price-tax-content">
            <span className="price-tax-amount">{taxReducedPrice}€</span>
            <span className="price-tax-label">après déduction fiscale</span>
          </div>
          <p className="price-tax-info">
            Parrainer {animalName} c'est faire un don. <br />
            Ce dernier est déductible à 66 % de vos impôts (dans la limite de 20 % du revenu
            imposable de votre foyer).
          </p>
        </div>
      )}

      <div className="plan-benefits">
        <h4>Inclus dans la formule :</h4>
        <ul className="benefits-list">
          {benefits.map((benefit, index) => (
            <li key={index} className="benefit-item">
              <CheckIcon size={16} weight="bold" className="benefit-icon" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="plan-actions">
        <Button size="lg" className="sponsor-button" onClick={onSubscribe}>
          Je parraine {animalName} - {basePrice}€
        </Button>
      </div>
    </div>
  );
}

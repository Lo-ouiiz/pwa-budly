import './OrderSummary.css';

interface OrderSummaryProps {
  planName: string;
  planPrice: number;
  durationMonths: number;
  animalName: string;
}

export default function OrderSummary({
  planName,
  planPrice,
  durationMonths,
  animalName,
}: OrderSummaryProps) {
  const total = planPrice;

  return (
    <div className="order-summary">
      <div className="order-summary-content">
        <div className="summary-section">
          <h2>Formule sélectionnée</h2>
          <div className="summary-plan">
            <span className="plan-name">{planName}</span>
            <span className="plan-animal">pour {animalName}</span>
          </div>
        </div>

        <div className="summary-section">
          <h3>Détails</h3>
          <div className="summary-details">
            <div className="detail-row">
              <span>Montant</span>
              <span className="price-value">{planPrice}€</span>
            </div>
            <div className="detail-row">
              <span>Durée du parrainage</span>
              <span>{durationMonths} mois</span>
            </div>
          </div>
        </div>

        <div className="summary-total">
          <span>Total à payer</span>
          <span className="total-amount">{total}€</span>
        </div>
      </div>
    </div>
  );
}

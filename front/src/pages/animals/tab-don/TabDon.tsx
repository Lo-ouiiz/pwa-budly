import type { Sponsorship } from '@/lib/interfaces';
import './TabDon.css';

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));

const fmtEur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

export default function TabDon({ sponsorship }: { sponsorship: Sponsorship }) {
  const { plan, amount, startDate, endDate, animal } = sponsorship;

  return (
    <div className="animal-tab-content">
      {animal.sponsorshipImpact && (
        <div>
          <p className="don-section-title">Impact de votre don</p>
          <div className="don-impact">{animal.sponsorshipImpact}</div>
        </div>
      )}

      <div className="don-plan-card">
        <div className="don-plan-label">Formule de parrainage</div>
        <div className="don-plan-name">{plan.name}</div>
        <div className="don-plan-stats">
          <div className="don-stat">
            <span className="don-stat-label">Montant</span>
            <span className="don-stat-value">{fmtEur(amount)}</span>
          </div>
          <div className="don-stat">
            <span className="don-stat-label">Durée</span>
            <span className="don-stat-value">{plan.durationMonths} mois</span>
          </div>
        </div>
      </div>

      <div className="don-dates-grid">
        <div className="don-info-tile">
          <span className="don-info-tile-label">Début</span>
          <span className="don-info-tile-value">{fmt(startDate)}</span>
        </div>
        {endDate && (
          <div className="don-info-tile">
            <span className="don-info-tile-label">Fin</span>
            <span className="don-info-tile-value">{fmt(endDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

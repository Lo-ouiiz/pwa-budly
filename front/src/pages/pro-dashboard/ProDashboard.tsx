import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/constant';
import { authStore } from '@/lib/auth';
import { useUser } from '@/lib/hooks/useUser';
import './ProDashboard.css';
import { NotePencilIcon, PawPrintIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

interface RevenueMonth {
  label: string;
  total: number;
}

interface Metrics {
  totalAnimals: number;
  sponsoredAnimals: number;
  newSponsorsThisMonth: number;
  revenueThisMonth: number;
  revenueByMonth: RevenueMonth[];
  renewalRate: number;
}

function GaugeChart({
  value,
  max,
  label,
  color = 'var(--primary)',
}: {
  value: number;
  max: number;
  label: string;
  color?: string;
}) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = 45;
  const stroke = 10;
  const cx = 60;
  const cy = 60;
  const circumference = Math.PI * r;
  const offset = circumference * (1 - pct);

  return (
    <div className="pro-dashboard-gauge">
      <svg viewBox="0 0 120 70" className="pro-dashboard-gauge-svg">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" className="pro-dashboard-gauge-value">
          {value}
        </text>
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="8" fill="var(--muted-foreground)">
          / {max} {label}
        </text>
      </svg>
      <span className="pro-dashboard-gauge-label">{label}</span>
    </div>
  );
}

function BarChart({ data }: { data: RevenueMonth[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="pro-dashboard-barchart">
      <div className="pro-dashboard-barchart-bars">
        {data.map((d, i) => (
          <div key={d.label} className="pro-dashboard-barchart-col">
            <span className="pro-dashboard-barchart-amount">
              {d.total > 0 ? `${d.total.toLocaleString('fr-FR')}€` : ''}
            </span>
            <div className="pro-dashboard-barchart-bar-wrapper">
              <div
                className="pro-dashboard-barchart-bar"
                style={{
                  height: `${(d.total / max) * 100}%`,
                  background: i === data.length - 1 ? 'var(--secondary)' : 'var(--primary)',
                }}
              />
            </div>
            <span className="pro-dashboard-barchart-label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProDashboard() {
  const { user } = useUser();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.zooId) return;
    fetch(`${API_BASE_URL}/dashboard/metrics?zooId=${user.zooId}`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data: Metrics) => setMetrics(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.zooId]);

  return (
    <section className="pro-dashboard-section">
      <div className="pro-dashboard-block">
        <h1>Les 4 métriques principales</h1>

        <div className="pro-dashboard-metrics">
          <div className="pro-dashboard-metric pro-dashboard-metric-revenue">
            <span className="pro-dashboard-metric-label">Revenus par mois</span>
            {loading || !metrics ? (
              <div className="pro-dashboard-metric-loading" />
            ) : (
              <BarChart data={metrics.revenueByMonth} />
            )}
          </div>

          <div className="pro-dashboard-metric pro-dashboard-metric-sponsored">
            <span className="pro-dashboard-metric-label">Animaux parrainés</span>
            {loading || !metrics ? (
              <div className="pro-dashboard-metric-loading" />
            ) : (
              <GaugeChart
                value={metrics.sponsoredAnimals}
                max={metrics.totalAnimals}
                label="animaux"
              />
            )}
          </div>

          <div className="pro-dashboard-metric pro-dashboard-metric-new-sponsors">
            <span className="pro-dashboard-metric-label">Nouveaux parrains ce mois</span>
            {loading || !metrics ? (
              <div className="pro-dashboard-metric-loading" />
            ) : (
              <GaugeChart
                value={metrics.newSponsorsThisMonth}
                max={metrics.sponsoredAnimals}
                label="parrains"
                color="var(--secondary)"
              />
            )}
          </div>

          <div className="pro-dashboard-metric pro-dashboard-metric-renewal">
            <span className="pro-dashboard-metric-label">Taux de renouvellement</span>
            {loading || !metrics ? (
              <div className="pro-dashboard-metric-loading" />
            ) : (
              <div className="pro-dashboard-renewal">
                <span className="pro-dashboard-renewal-value">{metrics.renewalRate}</span>
                <span className="pro-dashboard-renewal-suffix">%</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="pro-dashboard-block">
        <h2>Actions rapides</h2>
        <div className="pro-dashboard-quick-actions">
          <button
            className="pro-dashboard-quick-action"
            onClick={() => navigate('/pro/ajouter-animal')}
          >
            <div className="pro-dashboard-quick-action-icon">
              <PawPrintIcon size={22} weight="fill" />
            </div>
            <span>Ajouter un animal</span>
          </button>
          <button
            className="pro-dashboard-quick-action"
            onClick={() => navigate('/pro/publications/ajouter')}
          >
            <div className="pro-dashboard-quick-action-icon">
              <NotePencilIcon size={22} weight="fill" />
            </div>
            <span>Ajouter une publication</span>
          </button>
        </div>
      </div>
    </section>
  );
}

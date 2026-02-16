import './ConservationStatus.css';

type ConservationStatusType = 'LC' | 'NT' | 'VU' | 'EN' | 'CR';

interface ConservationStatusProps {
  status: ConservationStatusType;
}

export default function ConservationStatus({ status }: ConservationStatusProps) {
  const statusClass = status.toLowerCase().replace('_', '-');

  return (
    <div>
      <h3>Statut de conservation</h3>
      <div className="conservation-scale">
        <div className={`conservation-arrow conservation-arrow-${statusClass}`}>
          <div className="arrow-pointer">▼</div>
        </div>

        <div className="conservation-scale-bar">
          <div className="conservation-level conservation-lc">
            <span className="conservation-label">LC</span>
          </div>
          <div className="conservation-level conservation-nt">
            <span className="conservation-label">NT</span>
          </div>
          <div className="conservation-level conservation-vu">
            <span className="conservation-label">VU</span>
          </div>
          <div className="conservation-level conservation-en">
            <span className="conservation-label">EN</span>
          </div>
          <div className="conservation-level conservation-cr">
            <span className="conservation-label">CR</span>
          </div>
        </div>

        <div className="conservation-legends">
          <span className="conservation-legend">Préoccupation mineure</span>
          <span className="conservation-legend">Quasi menacé</span>
          <span className="conservation-legend">Vulnérable</span>
          <span className="conservation-legend">En danger</span>
          <span className="conservation-legend">En danger critique</span>
        </div>
      </div>
    </div>
  );
}

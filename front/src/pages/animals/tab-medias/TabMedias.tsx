import type { Animal } from '@/lib/interfaces';
import './TabMedias.css';

export default function TabMedias({ animal }: { animal: Animal }) {
  if (!animal.photos?.length) {
    return (
      <div className="animal-tab-content">
        <p className="media-empty">Aucun média disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="animal-tab-content">
      <div className="sante-coming">
        <p className="sante-coming-title">Bientôt disponible</p>
        <p className="sante-coming-desc">
          Le fil d'actualité de votre animal sera bientôt accessible depuis cette section.
        </p>
      </div>
    </div>
  );
}

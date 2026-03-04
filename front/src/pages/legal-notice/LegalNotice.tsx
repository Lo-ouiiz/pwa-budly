import './LegalNotice.css';

export default function LegalNotice() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <h1 className="legal-title">Mentions légales</h1>
        <p className="legal-subtitle">Dernière mise à jour : 1er mars 2026</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2 className="legal-section-title">Éditeur du site</h2>
          <p className="legal-text">
            Le site "Budly" est édité par la société <strong>Budly</strong>, société dont le siège
            social est situé à <strong>Grenoble, France</strong> et immatriculée sous le numéro{' '}
            <strong>RCS Grenoble 38 [NUMÉRO SIREN]</strong> auprès du Registre du Commerce et des
            Sociétés du Tribunal de commerce de Grenoble.
          </p>
          <ul className="legal-list">
            <li>
              <strong>Numéro de TVA intracommunautaire :</strong> FR[XX] [NUMÉRO SIREN]
            </li>
            <li>
              <strong>Email :</strong>{' '}
              <a href="mailto:budly@gmail.com" className="legal-link">
                budly@gmail.com
              </a>
            </li>
            <li>
              <strong>Téléphone :</strong>{' '}
              <a href="tel:+33478085313" className="legal-link">
                04 78 08 53 13
              </a>
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">Directeur de la publication</h2>
          <p className="legal-text">Le Directeur de la publication du site est Mélanie Cusanno.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">Conception et réalisation</h2>
          <p className="legal-text">
            Le site internet a été conçu et réalisé par Louise Mendiburu.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">Hébergement</h2>
          <p className="legal-text">
            Le site est hébergé par <strong>Railway Corp</strong>, société basée aux États-Unis.
          </p>
          <p className="legal-text">
            Site web :{' '}
            <a
              href="https://railway.app"
              target="_blank"
              rel="noopener noreferrer"
              className="legal-link"
            >
              railway.app
            </a>
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">Sous-traitants de données</h2>
          <p className="legal-text">
            Les sous-traitants ultérieurs de données à caractère personnel intervenant dans le cadre
            de la mise en œuvre des services en ligne sont notamment :
          </p>
          <ul className="legal-list">
            <li>
              <strong>Railway</strong> - Hébergement des données et infrastructure
            </li>
            <li>
              <strong>Stripe</strong> - Gestion des paiements en ligne
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">Propriété intellectuelle</h2>
          <p className="legal-text">
            L'ensemble des contenus présents sur le site Budly (textes, images, logos, graphismes,
            etc.) est protégé par le droit d'auteur, le droit des marques et/ou le droit des dessins
            et modèles. Toute reproduction, représentation, modification, publication ou adaptation
            de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé,
            est interdite, sauf autorisation écrite préalable de Budly.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">Limitations de responsabilité</h2>
          <p className="legal-text">
            Budly s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur
            ce site. Toutefois, Budly ne peut garantir l'exactitude, la précision ou l'exhaustivité
            des informations mises à disposition sur ce site.
          </p>
          <p className="legal-text">
            En conséquence, Budly décline toute responsabilité pour toute imprécision, inexactitude
            ou omission portant sur des informations disponibles sur le site.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">Droit applicable</h2>
          <p className="legal-text">
            Les présentes mentions légales sont régies par le droit français. En cas de litige et à
            défaut d'accord amiable, le litige sera porté devant les tribunaux compétents français.
          </p>
        </section>
      </div>
    </div>
  );
}

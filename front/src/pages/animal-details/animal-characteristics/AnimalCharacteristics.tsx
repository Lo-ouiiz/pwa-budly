import './AnimalCharacteristics.css';

interface AnimalCharacteristicsProps {
  age: number;
  gender: string;
  birthPlace: string;
  birthDate: string;
}

export default function AnimalCharacteristics({
  age,
  gender,
  birthPlace,
  birthDate,
}: AnimalCharacteristicsProps) {
  return (
    <div>
      <h3>Caractéristiques</h3>
      <div className="animal-characteristics">
        <div className="characteristic-item">
          <span className="characteristic-label">Âge :</span>
          <span>{age} ans</span>
        </div>
        <div className="characteristic-item">
          <span className="characteristic-label">Sexe :</span>
          <span>{gender === 'male' ? 'Mâle' : 'Femelle'}</span>
        </div>
        <div className="characteristic-item">
          <span className="characteristic-label">Lieu de naissance :</span>
          <span>{birthPlace}</span>
        </div>
        <div className="characteristic-item">
          <span className="characteristic-label">Date de naissance :</span>
          <span>{new Date(birthDate).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
}

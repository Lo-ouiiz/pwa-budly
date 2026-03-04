import { useNavigate } from 'react-router-dom';
import {
  FileTextIcon,
  ShieldCheckIcon,
  LockKeyIcon,
  CaretRightIcon,
  QuestionIcon,
  EnvelopeIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import './Settings.css';

const legalItems = [
  {
    label: 'Mentions légales',
    icon: FileTextIcon,
    href: '/mentions-legales',
  },
  {
    label: "Conditions générales d'utilisation",
    icon: ShieldCheckIcon,
    href: '/cgu',
  },
  {
    label: 'Politique de confidentialité',
    icon: LockKeyIcon,
    href: '/politique-confidentialite',
  },
];
const helpItems = [
  {
    label: "Centre d'aide / FAQ",
    icon: QuestionIcon,
    href: '/aide',
  },
  {
    label: 'Nous contacter',
    icon: EnvelopeIcon,
    href: '/contact',
  },
  {
    label: 'Signaler un problème',
    icon: WarningCircleIcon,
    href: '/signaler',
  },
];

export default function Settings() {
  const navigate = useNavigate();
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Paramètres</h1>
      </div>
      <div className="settings-sections">
        <div className="settings-section">
          <h3 className="settings-section-title">Aide</h3>
          <div className="settings-tiles-list">
            {helpItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="settings-tile"
                >
                  <div className="settings-tile-container">
                    <Icon size={20} weight="duotone" />
                    <span className="settings-tile-label">{item.label}</span>
                  </div>
                  <CaretRightIcon size={20} className="settings-tile-chevron" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="settings-section">
          <h3 className="settings-section-title">Légal</h3>
          <div className="settings-tiles-list">
            {legalItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="settings-tile"
                >
                  <div className="settings-tile-container">
                    <Icon size={20} weight="duotone" />
                    <span className="settings-tile-label">{item.label}</span>
                  </div>
                  <CaretRightIcon size={20} className="settings-tile-chevron" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

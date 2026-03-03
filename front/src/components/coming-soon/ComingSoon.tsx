import { HourglassIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import './ComingSoon.css';

interface ComingSoonProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export default function ComingSoon({
  title = 'Page en construction',
  message = 'Cette page arrivera bientôt. Nous travaillons activement à son développement.',
  showBackButton = true,
}: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div className="coming-soon">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">
          <HourglassIcon size={64} weight="regular" />
        </div>
        <h1 className="coming-soon-title">{title}</h1>
        <p className="coming-soon-message">{message}</p>
        {showBackButton && (
          <Button onClick={() => navigate(-1)} variant="outline">
            Retour
          </Button>
        )}
      </div>
    </div>
  );
}

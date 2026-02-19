import { Button } from '@/components/ui/button';
import { PaymentElement, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import './PaymentMethodForm.css';

interface PaymentMethodFormProps {
  planPrice: number;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function PaymentMethodForm({
  planPrice,
  onSubmit,
  onBack,
  isLoading,
}: PaymentMethodFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="payment-method-form">
      <h2>Choisir une méthode de paiement</h2>

      <ExpressCheckoutElement
        onConfirm={() => {
          onSubmit();
        }}
      />

      <div className="payment-divider">
        <span>ou</span>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-element-wrapper">
          <PaymentElement />
        </div>

        <div className="payment-form-actions">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Traitement...' : `Payer ${planPrice}€`}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={isLoading}>
            Retour aux informations
          </Button>
        </div>
      </form>
    </div>
  );
}

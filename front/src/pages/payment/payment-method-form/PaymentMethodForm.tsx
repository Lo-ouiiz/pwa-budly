import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentElement, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import { Skeleton } from '@/components/ui/skeleton';
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
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="payment-method-form">
      <h2>Choisir une méthode de paiement</h2>

      <ExpressCheckoutElement onConfirm={onSubmit} />

      <div className="payment-divider">
        <span>ou</span>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-element-wrapper">
          {!isPaymentElementReady && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <div style={{ display: 'flex', gap: '12px' }}>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          <PaymentElement onReady={() => setIsPaymentElementReady(true)} />
        </div>

        <div className="payment-form-actions">
          <Button type="submit" size="lg" disabled={isLoading || !isPaymentElementReady}>
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

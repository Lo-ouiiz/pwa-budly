import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import PaymentForm from './payment-form/PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function getCSSVariable(varName: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
}

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  const planId = location.state?.planId;
  const planName = location.state?.planName;
  const planPrice = location.state?.planPrice;
  const durationMonths = location.state?.durationMonths;
  const animalId = location.state?.animalId;
  const animalName = location.state?.animalName;
  const animalPhoto = location.state?.animalPhoto;

  useEffect(() => {
    if (!planPrice || !planId || hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    fetch('http://localhost:3000/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: planPrice * 100,
        currency: 'eur',
        metadata: {
          planId,
          animalId,
          planName,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur lors de la création du paiement');
        }
        return res.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => {
        console.error('Erreur PaymentIntent:', err);
        setError('Impossible de charger le formulaire de paiement');
      });
  }, [planPrice, planId, animalId, planName]);

  if (!planId || !planPrice) {
    return (
      <div className="payment-error">
        <h2>Erreur</h2>
        <p>Aucun plan sélectionné</p>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-error">
        <p>{error}</p>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="payment-page">
        <Skeleton className="h-48 w-full" />
        <div className="payment-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-2 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-2 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: getCSSVariable('--primary', '#0066cc'),
        colorBackground: getCSSVariable('--background', '#ffffff'),
        colorText: getCSSVariable('--foreground', '#1a1a1a'),
        colorDanger: getCSSVariable('--destructive', '#df1b41'),
        fontFamily: '"Montserrat", system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '10px',
      },
      rules: {
        '.Input': {
          border: `1px solid ${getCSSVariable('--border', '#e0e0e0')}`,
          boxShadow: 'none',
        },
        '.Input:focus': {
          border: `1px solid ${getCSSVariable('--primary', '#0066cc')}`,
          boxShadow: `0 0 0 1px ${getCSSVariable('--primary', '#0066cc')}`,
        },
        '.Label': {
          fontWeight: '600',
          marginBottom: '8px',
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        planId={planId}
        planName={planName}
        planPrice={planPrice}
        durationMonths={durationMonths}
        animalId={animalId}
        animalName={animalName}
        animalPhoto={animalPhoto}
      />
    </Elements>
  );
}

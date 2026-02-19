import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import SponsorshipHero from '@/components/sponsorship-hero/SponsorshipHero';
import OrderSummary from '../order-summary/OrderSummary';
import PersonalInfoForm from '../personal-info-form/PersonalInfoForm';
import PaymentMethodForm from '../payment-method-form/PaymentMethodForm';
import { WarningCircleIcon, CheckIcon } from '@phosphor-icons/react';
import { fetchWithAuth } from '@/lib/auth';
import './PaymentForm.css';

interface PaymentFormProps {
  planId: number;
  planName: string;
  planPrice: number;
  durationMonths: number;
  animalId: number;
  animalName: string;
  animalPhoto?: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
}

export default function PaymentForm({
  planId,
  planName,
  planPrice,
  durationMonths,
  animalId,
  animalName,
  animalPhoto,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'France',
    phone: '',
  });

  const updateUserIfNeeded = async () => {
    await fetchWithAuth('http://localhost:3000/users/me', {
      method: 'PATCH',
      body: JSON.stringify({
        street: personalInfo.street,
        postalCode: personalInfo.postalCode,
        city: personalInfo.city,
        country: personalInfo.country,
        phoneNumber: personalInfo.phone,
      }),
    });
  };

  const createSponsorship = async (paymentIntentId: string) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);
    console.log(animalId, planId, planPrice);
    try {
      const response = await fetchWithAuth('http://localhost:3000/sponsorships', {
        method: 'POST',
        body: JSON.stringify({
          animalId: animalId,
          planId: planId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          amount: planPrice,
          autoRenew: false,
          status: 'ACTIF',
          transactionId: paymentIntentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du parrainage');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur création parrainage:', error);
      throw error;
    }
  };

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data);
    setCurrentStep(3);
  };

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: `${personalInfo.firstName} ${personalInfo.lastName}`,
            email: personalInfo.email,
            phone: personalInfo.phone,
            address: {
              line1: personalInfo.street,
              postal_code: personalInfo.postalCode,
              city: personalInfo.city,
              country: 'FR',
            },
          },
        },
      },
    });

    if (error) {
      setMessage(error.message ?? 'Erreur lors du paiement');
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await updateUserIfNeeded();
        await createSponsorship(paymentIntent.id);
        navigate('/success', {
          state: {
            animalName,
            animalPhoto,
            animalId,
            planName,
            amount: planPrice,
            durationMonths,
            endDate: new Date(
              new Date().setMonth(new Date().getMonth() + durationMonths),
            ).toISOString(),
          },
        });
      } catch (err) {
        console.error(err);
        setMessage(
          "Paiement réussi mais erreur lors de l'enregistrement. Veuillez contacter le support.",
        );
        setIsLoading(false);
      }
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div
        className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
      >
        {currentStep > 1 ? (
          <span>
            <CheckIcon size={18} weight="regular" />
          </span>
        ) : (
          <span>1</span>
        )}
        <span className="step-label">Récapitulatif</span>
      </div>
      <div className="step-line" />
      <div
        className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
      >
        {currentStep > 2 ? (
          <span>
            <CheckIcon size={18} weight="regular" />
          </span>
        ) : (
          <span>2</span>
        )}
        <span className="step-label">Informations</span>
      </div>
      <div className="step-line" />
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
        <span>3</span>
        <span className="step-label">Paiement</span>
      </div>
    </div>
  );

  return (
    <div className="payment-page">
      <SponsorshipHero
        animalPhoto={animalPhoto}
        animalName={animalName}
        onBack={() => navigate(-1)}
      />
      <div className="payment-content">
        {renderStepIndicator()}

        {message && (
          <div className="payment-message-error">
            <div>
              <WarningCircleIcon size={18} weight="bold" />
            </div>
            <span>{message}</span>
          </div>
        )}

        {currentStep === 1 && (
          <div className="step-content">
            <OrderSummary
              planName={planName}
              planPrice={planPrice}
              durationMonths={durationMonths}
              animalName={animalName}
            />
            <Button size="lg" onClick={() => setCurrentStep(2)} className="next-button">
              Je continue
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <PersonalInfoForm
              onSubmit={handlePersonalInfoSubmit}
              onBack={() => setCurrentStep(1)}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <PaymentMethodForm
              planPrice={planPrice}
              onSubmit={handlePaymentSubmit}
              onBack={() => setCurrentStep(2)}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

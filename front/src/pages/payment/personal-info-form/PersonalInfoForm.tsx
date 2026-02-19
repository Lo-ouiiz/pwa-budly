import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/lib/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import './PersonalInfoForm.css';

const personalInfoSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis' }),
  lastName: z.string().min(1, { message: 'Le nom est requis' }),
  email: z.email({ message: "L'email est invalide" }),
  phone: z.string().min(1, { message: 'Le téléphone est requis' }),
  street: z.string().min(1, { message: "L'adresse est requise" }),
  postalCode: z.string().min(1, { message: 'Le code postal est requis' }),
  city: z.string().min(1, { message: 'La ville est requise' }),
  country: z.string().min(1, { message: 'Le pays est requis' }),
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfo) => void;
  onBack: () => void;
}

interface AddressFeature {
  properties: {
    id: string;
    label: string;
    name: string;
    postcode: string;
    city: string;
  };
}

export default function PersonalInfoForm({ onSubmit, onBack }: PersonalInfoFormProps) {
  const { user } = useUser();
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      street: user?.street || '',
      postalCode: user?.postalCode || '',
      city: user?.city || '',
      country: user?.country || 'France',
    },
  });

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('street', value, { shouldValidate: true });

    clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`,
      );
      const data = await res.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    }, 300);
  };

  const handleSelectSuggestion = (feature: AddressFeature) => {
    const props = feature.properties;
    setValue('street', props.name, { shouldValidate: true });
    setValue('postalCode', props.postcode, { shouldValidate: true });
    setValue('city', props.city, { shouldValidate: true });
    setValue('country', 'France', { shouldValidate: true });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const onSubmitForm: SubmitHandler<PersonalInfo> = (data) => {
    onSubmit(data);
  };

  const requiredLabel = (label: string) => (
    <>
      {label} <span className="required">*</span>
    </>
  );

  return (
    <form className="personal-info-form" onSubmit={handleSubmit(onSubmitForm)}>
      <h2>Vos informations personnelles</h2>

      <div className="form-row">
        <Field>
          <FieldLabel htmlFor="firstName">{requiredLabel('Prénom')}</FieldLabel>
          <InputGroup>
            <InputGroupInput id="firstName" placeholder="Jean" {...register('firstName')} />
          </InputGroup>
          {errors.firstName && <span className="auth-error">{errors.firstName.message}</span>}
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">{requiredLabel('Nom')}</FieldLabel>
          <InputGroup>
            <InputGroupInput id="lastName" placeholder="Dupont" {...register('lastName')} />
          </InputGroup>
          {errors.lastName && <span className="auth-error">{errors.lastName.message}</span>}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="email">{requiredLabel('Email')}</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="email"
            type="email"
            placeholder="jean.dupont@example.com"
            {...register('email')}
          />
        </InputGroup>
        {errors.email && <span className="auth-error">{errors.email.message}</span>}
      </Field>

      <Field>
        <FieldLabel htmlFor="phone">{requiredLabel('Téléphone')}</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            {...register('phone')}
          />
        </InputGroup>
        {errors.phone && <span className="auth-error">{errors.phone.message}</span>}
      </Field>

      <Field>
        <FieldLabel htmlFor="street">{requiredLabel('Adresse')}</FieldLabel>
        <div style={{ position: 'relative' }}>
          <InputGroup>
            <InputGroupInput
              id="street"
              placeholder="12 rue de la Paix"
              {...register('street')}
              onChange={handleStreetChange}
              autoComplete="off"
            />
          </InputGroup>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="address-suggestions">
              {suggestions.map((feature) => (
                <li key={feature.properties.id} onMouseDown={() => handleSelectSuggestion(feature)}>
                  {feature.properties.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.street && <span className="auth-error">{errors.street.message}</span>}
      </Field>

      <div className="form-row">
        <Field>
          <FieldLabel htmlFor="postalCode">{requiredLabel('Code postal')}</FieldLabel>
          <InputGroup>
            <InputGroupInput id="postalCode" placeholder="75001" {...register('postalCode')} />
          </InputGroup>
          {errors.postalCode && <span className="auth-error">{errors.postalCode.message}</span>}
        </Field>

        <Field>
          <FieldLabel htmlFor="city">{requiredLabel('Ville')}</FieldLabel>
          <InputGroup>
            <InputGroupInput id="city" placeholder="Paris" {...register('city')} />
          </InputGroup>
          {errors.city && <span className="auth-error">{errors.city.message}</span>}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="country">{requiredLabel('Pays')}</FieldLabel>
        <InputGroup>
          <InputGroupInput id="country" placeholder="France" {...register('country')} />
        </InputGroup>
        {errors.country && <span className="auth-error">{errors.country.message}</span>}
      </Field>

      <Button type="submit" size="lg" disabled={!isValid}>
        Je continue
      </Button>
      <Button variant="outline" type="button" size="lg" onClick={onBack}>
        Retour au récapitulatif
      </Button>
    </form>
  );
}

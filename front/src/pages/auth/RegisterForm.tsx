import { useState } from 'react';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type Props = {
  step: number;
  onBack: () => void;
  onNext: () => void;
};

const registerSchemaStep1 = z.object({
  email: z.email({ message: "L'email est invalide" }),
});

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const registerSchemaStep2 = z
  .object({
    firstName: z.string().min(1, { message: 'Le prénom est requis' }),
    lastName: z.string().min(1, { message: 'Le nom est requis' }),
    birthDate: z.string().min(1, { message: 'La date de naissance est requise' }),
    password: z
      .string()
      .min(8, {
        message:
          'Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial',
      })
      .regex(
        passwordRegex,
        'Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type Step1Values = z.infer<typeof registerSchemaStep1>;
type Step2Values = z.infer<typeof registerSchemaStep2>;

export default function RegisterForm({ step, onBack, onNext }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<Step1Values | Step2Values>({
    resolver: zodResolver(step === 1 ? registerSchemaStep1 : registerSchemaStep2),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {},
  });

  const handleNext = async () => {
    const valid = await trigger();
    if (valid) onNext();
  };

  const onSubmit = (data: Step1Values | Step2Values) => {
    if (step === 2) {
      const step2Data = data as Step2Values;
      console.log('Step 2:', step2Data);
      // envoyer à l'API
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      {step === 2 && (
        <button type="button" className="auth-back" onClick={onBack}>
          <ArrowLeftIcon size={18} weight="bold" />
          <span>Retour</span>
        </button>
      )}

      {step === 1 && (
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="email@exemple.com"
              {...register('email')}
            />
          </InputGroup>
          {'email' in errors && <span className="auth-error">{errors.email?.message}</span>}
          <Button type="button" onClick={handleNext} disabled={!isValid}>
            Continuer
          </Button>
        </Field>
      )}

      {step === 2 && (
        <>
          <Field>
            <FieldLabel htmlFor="lastName">Nom</FieldLabel>
            <InputGroup>
              <InputGroupInput id="lastName" placeholder="Votre nom" {...register('lastName')} />
            </InputGroup>
            {'lastName' in errors && <span className="auth-error">{errors.lastName?.message}</span>}
          </Field>

          <Field>
            <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="firstName"
                placeholder="Votre prénom"
                {...register('firstName')}
              />
            </InputGroup>
            {'firstName' in errors && (
              <span className="auth-error">{errors.firstName?.message}</span>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="birthDate">Date de naissance</FieldLabel>
            <InputGroup>
              <InputGroupInput id="birthDate" type="date" {...register('birthDate')} />
            </InputGroup>
            {'birthDate' in errors && (
              <span className="auth-error">{errors.birthDate?.message}</span>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
              />
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="icon-primary" size={20} />
                  ) : (
                    <EyeSlashIcon className="icon-primary" size={20} />
                  )}
                </button>
              </InputGroupAddon>
            </InputGroup>
            {'password' in errors && <span className="auth-error">{errors.password?.message}</span>}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="icon-primary" size={20} />
                  ) : (
                    <EyeSlashIcon className="icon-primary" size={20} />
                  )}
                </button>
              </InputGroupAddon>
            </InputGroup>
            {'confirmPassword' in errors && (
              <span className="auth-error">{errors.confirmPassword?.message}</span>
            )}
          </Field>

          <Button type="submit" disabled={!isValid}>
            Créer un compte
          </Button>
        </>
      )}
    </form>
  );
}

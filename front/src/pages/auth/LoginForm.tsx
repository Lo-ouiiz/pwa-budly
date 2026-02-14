import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authStore } from '@/lib/auth';
import * as z from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.email({ message: 'Email invalide' }),
  password: z.string().min(1, { message: 'Le mot de passe est requis' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || '/profil';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erreur connexion');
      }

      const json = await res.json();
      authStore.accessToken = json.accessToken;
      console.log('Login réussi, accessToken:', authStore.accessToken);

      navigate(redirectTo, { replace: true });

      //eslint-disable-next-line
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
        {errors.email && <span className="auth-error">{errors.email.message}</span>}
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
        {errors.password && <span className="auth-error">{errors.password.message}</span>}
      </Field>

      {errorMsg && <span className="auth-error">{errorMsg}</span>}

      <button type="button" className="auth-forgot">
        Mot de passe oublié ?
      </button>

      <Button type="submit" disabled={!isValid || loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
}

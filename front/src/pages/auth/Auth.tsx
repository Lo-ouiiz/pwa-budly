import { useState, useContext } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './Auth.css';
import { authStore } from '@/lib/auth';
import { Navigate, useLocation } from 'react-router-dom';
import UserContext from '@/lib/context/UserContext';
import Loader from '@/components/loader/Loader';

interface AuthProps {
  isPro?: boolean;
}

export default function Auth({ isPro = false }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState(1);
  const location = useLocation();
  const ctx = useContext(UserContext);
  const user = ctx?.user ?? null;
  const loading = ctx?.loading ?? true;

  if (loading) return <Loader />;

  if (authStore.accessToken && user) {
    const isProfessional = ['ZOO_ADMIN', 'ZOO_USER'].includes(user.role);
    const from = location.state?.from || (isProfessional ? '/pro/dashboard' : '/profil');
    const redirectState = location.state?.state;
    return <Navigate to={from} replace state={redirectState} />;
  }

  return (
    <section className="auth-section">
      <div className="auth-container">
        <h1 className="auth-title">
          {isPro ? 'Espace Budly Pro' : mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </h1>
        {mode === 'login' && <LoginForm />}
        {mode === 'register' && !isPro && (
          <RegisterForm step={step} onBack={() => setStep(1)} onNext={() => setStep(2)} />
        )}
        <div className="auth-switch">
          {isPro && (
            <button type="button" onClick={() => {}}>
              Pas encore de compte ? <span>Créer un compte</span>
            </button>
          )}
          {!isPro && mode === 'login' && (
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setStep(1);
              }}
            >
              Pas encore de compte ? <span>Créer un compte</span>
            </button>
          )}
          {!isPro && mode === 'register' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setStep(1);
              }}
            >
              Déjà un compte ? <span>Se connecter</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

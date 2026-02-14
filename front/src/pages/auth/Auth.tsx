import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './Auth.css';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState(1);

  return (
    <section className="auth-section">
      <div className="auth-container">
        <h1 className="auth-title">{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h1>

        {mode === 'login' && <LoginForm />}

        {mode === 'register' && (
          <RegisterForm step={step} onBack={() => setStep(1)} onNext={() => setStep(2)} />
        )}

        <div className="auth-switch">
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setStep(1);
              }}
            >
              Pas encore de compte ? <span>Créer un compte</span>
            </button>
          ) : (
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

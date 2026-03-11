import { useEffect, useState, useContext, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProvider } from './lib/context/UserContext';
import UserContext from './lib/context/UserContext';
import { authStore, initAuth } from './lib/auth';
import type { UserRole } from './lib/types/user';
import Loader from './components/loader/Loader';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import Search from './pages/search/Search';
import Animals from './pages/animals/Animals';
import Profile from './pages/profile/Profile';
import Auth from './pages/auth/Auth';
import NotFound from './pages/NotFound';
import AnimalDetail from './pages/animal-details/AnimalDetails';
import Sponsorships from './pages/sponsorships/Sponsorships';
import Payment from './pages/payment/Payment';
import Success from './pages/payment/success/Success';
import ProLayout from './components/layout/ProLayout';
import AnimalQuiz from './pages/animal-quiz/AnimalQuiz';
import ComingSoon from './components/coming-soon/ComingSoon';
import Settings from './pages/settings/Settings';
import LegalNotice from './pages/legal-notice/LegalNotice';
import ProDashboard from './pages/pro-dashboard/ProDashboard';
import ProAnimalAdd from './pages/pro-animal-add/ProAnimalAdd';
import ProAnimalList from './pages/pro-animal-list/ProAnimalList';
import ProProfile from './pages/pro-profile/ProProfile';

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
  const location = useLocation();
  const ctx = useContext(UserContext);
  const user = ctx?.user ?? null;
  const loading = ctx?.loading ?? true;

  if (!authStore.isReady || loading) return <Loader />;

  if (!authStore.accessToken) {
    return (
      <Navigate
        to="/connexion"
        replace
        state={{ from: location.pathname, state: location.state }}
      />
    );
  }

  if (roles && user && !roles.includes(user.role as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/quiz" element={<AnimalQuiz />} />
        <Route path="recherche" element={<Search />} />
        <Route path="animal/:slug" element={<AnimalDetail />} />
        <Route path="offres-parrainage/" element={<Sponsorships />} />
        <Route
          path="paiement/"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route path="/succes" element={<Success />} />
        <Route
          path="animaux"
          element={
            <ProtectedRoute>
              <Animals />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil/informations"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil/factures"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil/recus-fiscaux"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil/modifier-mot-de-passe"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil/authentification-2fa"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil/supprimer-compte"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil/notifications"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil/newsletter"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route path="connexion" element={<Auth />} />
        <Route path="parametres" element={<Settings />} />
        <Route path="aide" element={<ComingSoon />} />
        <Route path="contact" element={<ComingSoon />} />
        <Route path="signaler" element={<ComingSoon />} />
        <Route path="mentions-legales" element={<LegalNotice />} />
        <Route path="cgu" element={<ComingSoon />} />
        <Route path="politique-confidentialite" element={<ComingSoon />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/pro" element={<ProLayout />}>
        <Route index element={<Auth isPro={true} />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute roles={['ZOO_ADMIN', 'ZOO_USER']}>
              <ProDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="gestion-animaux"
          element={
            <ProtectedRoute roles={['ZOO_ADMIN']}>
              <ProAnimalList />
            </ProtectedRoute>
          }
        />
        <Route
          path="ajouter-animal"
          element={
            <ProtectedRoute roles={['ZOO_ADMIN']}>
              <ProAnimalAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil"
          element={
            <ProtectedRoute roles={['ZOO_ADMIN', 'ZOO_USER']}>
              <ProProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="parametres"
          element={
            <ProtectedRoute roles={['ZOO_ADMIN', 'ZOO_USER']}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initAuth().finally(() => setReady(true));
  }, []);

  if (!ready) return <Loader />;

  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}

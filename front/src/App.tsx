import { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProvider } from './lib/context/UserContext';
import { authStore, initAuth } from './lib/auth';
import Loader from './components/loader/Loader';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import Search from './pages/search/Search';
import Animals from './pages/animals/Animals';
import Profile from './pages/Profile';
import Auth from './pages/auth/Auth';
import NotFound from './pages/NotFound';
import AnimalDetail from './pages/animal-details/AnimalDetails';
import Sponsorships from './pages/sponsorships/Sponsorships';
import Payment from './pages/payment/Payment';
import Success from './pages/payment/success/Success';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!authStore.isReady) return <Loader />;

  if (!authStore.accessToken) {
    return (
      <Navigate
        to="/connexion"
        replace
        state={{
          from: location.pathname,
          state: location.state,
        }}
      />
    );
  }

  return children;
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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
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
            <Route path="connexion" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

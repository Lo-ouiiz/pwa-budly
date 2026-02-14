import { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authStore, initAuth } from './lib/auth';
import Loader from './components/loader/Loader';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import Search from './pages/Search';
import Animals from './pages/Animals';
import Profile from './pages/Profile';
import Auth from './pages/auth/Auth';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!authStore.isReady) return <Loader />;

  if (!authStore.accessToken) {
    return <Navigate to="/connexion" replace />;
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
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recherche" element={<Search />} />
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
    </BrowserRouter>
  );
}

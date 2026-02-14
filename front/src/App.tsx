import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import Search from './pages/Search';
import Animals from './pages/Animals';
import Profile from './pages/Profile';
import Auth from './pages/auth/Auth';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recherche" element={<Search />} />
          <Route path="animaux" element={<Animals />} />
          <Route path="profil" element={<Profile />} />
          <Route path="connexion" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

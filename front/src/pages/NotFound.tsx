import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center mt-20 p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Erreur 404</h1>
      <p className="mb-6">La page que vous recherchez n'existe pas.</p>

      <NavLink
        to="/"
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
      >
        Retour à l'accueil
      </NavLink>
    </div>
  );
}

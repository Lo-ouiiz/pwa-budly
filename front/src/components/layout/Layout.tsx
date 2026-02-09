import { Outlet } from 'react-router-dom';
import AppMenu from '../app-menu/AppMenu';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppMenu />
      <main className="flex-1 pt-14 md:pt-16">
        <Outlet />
      </main>
    </div>
  );
}

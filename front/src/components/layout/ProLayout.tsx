import { Outlet } from 'react-router-dom';
import './ProLayout.css';

export default function ProLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="pro-header">
        <div className="pro-header-inner">
          <img src="/logo-pro.svg" alt="logo pro" className="pro-header-logo" />
        </div>
      </header>
      <main className="flex-1 pt-14 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}

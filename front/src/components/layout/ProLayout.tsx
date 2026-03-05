import { Outlet } from 'react-router-dom';
import './ProLayout.css';
import ProAppMenu from '../pro-app-menu/ProAppMenu';

export default function ProLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ProAppMenu />
      <main className="flex-1 pt-14 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}

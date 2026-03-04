import {
  BellIcon,
  GearIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  PawPrintIcon,
  UserIcon,
} from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';
import InstallBanner from '../install-banner/InstallBanner';
import './AppMenu.css';
const navItems = [
  { label: 'Accueil', icon: HouseIcon, href: '/', showOnDesktop: false },
  {
    label: 'Exploration',
    icon: MagnifyingGlassIcon,
    href: '/recherche',
    showOnDesktop: true,
    desktopVariant: 'link',
  },
  {
    label: 'Tableau de bord',
    icon: PawPrintIcon,
    href: '/animaux',
    showOnDesktop: true,
    desktopVariant: 'link',
  },
  {
    label: 'Mon profil',
    icon: UserIcon,
    href: '/profil',
    showOnDesktop: false,
    desktopVariant: 'link',
  },
];
export default function AppMenu() {
  return (
    <>
      <InstallBanner />
      <header className="nav-desktop">
        <div className="nav-desktop-inner">
          <NavLink to="/">
            <img src="/logo/logo.svg" alt="logo" />
          </NavLink>
          <nav className="nav-desktop-links">
            {navItems
              .filter((item) => item.showOnDesktop)
              .map((item) => {
                const Icon = item.icon;
                if (item.desktopVariant === 'button') {
                  return (
                    <NavLink key={item.label} to={item.href} className="nav-desktop-account">
                      <Icon size={18} weight="regular" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                }
                return (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    className={({ isActive }) =>
                      isActive ? 'nav-desktop-link active' : 'nav-desktop-link'
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            <div className="nav-desktop-actions">
              <NavLink to="/profil" className="nav-desktop-icon" aria-label="Profil">
                {({ isActive }) => <UserIcon size={24} weight={isActive ? 'duotone' : 'regular'} />}
              </NavLink>
              <button className="nav-desktop-icon" aria-label="Notifications">
                <BellIcon size={24} weight="regular" />
              </button>
              <NavLink to="/parametres" className="nav-desktop-icon" aria-label="Paramètres">
                {({ isActive }) => <GearIcon size={24} weight={isActive ? 'duotone' : 'regular'} />}
              </NavLink>
            </div>
          </nav>
        </div>
      </header>
      <header className="nav-mobile-top">
        <NavLink to="/">
          <img src="/logo/logo.svg" alt="logo" />
        </NavLink>
        <div className="nav-mobile-top-actions">
          <button className="nav-mobile-top-icon" aria-label="Notifications">
            <BellIcon size={24} weight="regular" />
          </button>
          <NavLink to="/parametres" className="nav-mobile-top-icon" aria-label="Paramètres">
            {({ isActive }) => <GearIcon size={24} weight={isActive ? 'duotone' : 'regular'} />}
          </NavLink>
        </div>
      </header>
      <nav className="nav-mobile">
        <ul className="nav-mobile-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    isActive ? 'nav-mobile-item active' : 'nav-mobile-item'
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

import { ChartBarIcon, GarageIcon, GearIcon, PawPrintIcon, UserIcon } from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';
import InstallBanner from '../install-banner/InstallBanner';
import './ProAppMenu.css';

const navItems = [
  {
    label: 'Les animaux',
    icon: PawPrintIcon,
    href: '/pro/gestion-animaux',
    showOnDesktop: true,
    desktopVariant: 'link',
  },
  {
    label: 'Le zoo',
    icon: GarageIcon,
    href: '/pro/gestion-zoo',
    showOnDesktop: true,
    desktopVariant: 'link',
  },
  {
    label: 'Statistiques',
    icon: ChartBarIcon,
    href: '/pro/statistiques',
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

export default function ProAppMenu() {
  return (
    <>
      <InstallBanner />
      <header className="nav-desktop">
        <div className="nav-desktop-inner">
          <NavLink to="/">
            <img src="/logo/logo-pro.svg" alt="logo pro" />
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
              <NavLink to="/parametres" className="nav-desktop-icon" aria-label="Paramètres">
                {({ isActive }) => <GearIcon size={24} weight={isActive ? 'duotone' : 'regular'} />}
              </NavLink>
            </div>
          </nav>
        </div>
      </header>
      <header className="nav-mobile-top">
        <NavLink to="/">
          <img src="/logo/logo-pro.svg" alt="logo pro" />
        </NavLink>
        <div className="nav-mobile-top-actions">
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

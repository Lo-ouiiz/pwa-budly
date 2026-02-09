import { HouseIcon, MagnifyingGlassIcon, PawPrintIcon, UserIcon } from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';
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
    label: 'Mes animaux',
    icon: PawPrintIcon,
    href: '/animaux',
    showOnDesktop: true,
    desktopVariant: 'link',
  },
  {
    label: 'Mon profil',
    icon: UserIcon,
    href: '/profil',
    showOnDesktop: true,
    desktopVariant: 'button',
  },
];

export default function AppMenu() {
  return (
    <>
      <header className="nav-desktop">
        <h1 className="text-lg font-bold">
          <NavLink to="/">BUDLY</NavLink>
        </h1>
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
        </nav>
      </header>

      <header className="nav-mobile-top">
        <h1 className="text-lg font-bold">
          <span>BUDLY</span>
        </h1>
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
                  <Icon size={24} weight="regular" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

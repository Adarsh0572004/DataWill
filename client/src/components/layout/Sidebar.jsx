import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { section: 'Overview', items: [
    { to: '/dashboard',        icon: 'ph ph-house',          label: 'Dashboard' },
    { to: '/dashboard/assets', icon: 'ph ph-package',        label: 'Assets' },
    { to: '/dashboard/will',   icon: 'ph ph-clipboard-text', label: 'My Will' },
  ]},
  { section: 'People', items: [
    { to: '/dashboard/contacts', icon: 'ph ph-users',        label: 'Contacts' },
    { to: '/dashboard/messages', icon: 'ph ph-envelope',     label: 'Messages' },
  ]},
  { section: 'Security', items: [
    { to: '/dashboard/audit-log', icon: 'ph ph-scroll',      label: 'Audit Log' },
  ]},
];

function Sidebar({ userName = '', onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <i className={`ph ${mobileOpen ? 'ph-x' : 'ph-list'}`}></i>
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">DataWill</div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map((group) => (
            <div key={group.section}>
              <div className="sidebar__section">{group.section}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
                  }
                  onClick={closeMobile}
                >
                  <i className={`sidebar__icon ${item.icon}`}></i>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <NavLink to="/dashboard/settings" className={({ isActive }) =>
            `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
          } onClick={closeMobile}>
            <i className="sidebar__icon ph ph-gear"></i>
            Settings
          </NavLink>
          {userName && (
            <div className="sidebar__user">
              <div className="sidebar__avatar">{userName.charAt(0).toUpperCase()}</div>
              <span className="sidebar__username">{userName}</span>
            </div>
          )}
          {onLogout && (
            <button className="sidebar__logout" onClick={onLogout}>
              <i className="ph ph-sign-out"></i> Sign out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

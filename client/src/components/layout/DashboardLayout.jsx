import { Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

function DashboardLayout({ user, onLogout }) {
  return (
    <div className="dashboard-layout">
      <Sidebar userName={user?.name} onLogout={onLogout} />
      <main className="dashboard-layout__main">
        <div className="dashboard-layout__content animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;

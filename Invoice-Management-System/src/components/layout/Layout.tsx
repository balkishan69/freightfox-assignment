import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';
import styles from './layout.module.css';
import { MOCK_USERS } from '../../domain/rbac';

export const Layout: React.FC = () => {
  const { user, setUser } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div style={{ width: 24, height: 24, backgroundColor: 'var(--color-primary-500)', borderRadius: 4 }} />
          FreightFox
        </div>
        <nav className={styles.nav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
            end
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink 
            to="/invoices" 
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
          >
            <FileText size={20} />
            Invoices
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.pageTitle}>
            {/* Contextual title could go here if needed, or leave blank */}
          </div>
          
          <div className={styles.userProfile}>
            {/* Simple Role Switcher for Demo Purposes */}
            <select 
              value={user.role}
              onChange={(e) => {
                const role = e.target.value as keyof typeof MOCK_USERS;
                setUser(MOCK_USERS[role]);
              }}
              style={{
                marginRight: 'var(--space-4)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: 'var(--font-size-sm)'
              }}
              aria-label="Switch User Role"
            >
              {Object.keys(MOCK_USERS).map(role => (
                <option key={role} value={role}>View as: {role}</option>
              ))}
            </select>

            <div className={styles.userMeta}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
            <div className={styles.avatar}>
              {getInitials(user.name)}
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

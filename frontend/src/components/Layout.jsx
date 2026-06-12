import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Layout.css';

const Layout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/dashboard" className="logo-link">
              <div className="evidence-marker-small">
                <span className="marker-number">1</span>
              </div>
              <span className="app-title">SceneMap</span>
            </Link>
          </div>

          <nav className="header-nav">
            <Link 
              to="/dashboard" 
              className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </Link>
            <a href="#" className="nav-link">Cases</a>
            <a href="#" className="nav-link">Timeline</a>
          </nav>

          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{currentUser?.name}</span>
              <span className="user-badge">{currentUser?.badge}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 13L3 9L7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 9H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 3H14C14.5523 3 15 3.44772 15 4V14C15 14.5523 14.5523 15 14 15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 SceneMap - Interactive Field Evidence Logger</p>
        <p className="footer-note">Authorized Law Enforcement Use Only</p>
      </footer>
    </div>
  );
};

export default Layout;

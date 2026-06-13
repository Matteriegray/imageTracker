import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0b0f]">
      {/* Header */}
      <header className="bg-[#16171d] border-b border-[#2e303a] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {/* <div className="evidence-marker w-9 h-9">
              <span className="text-lg font-bold text-[#0a0b0f]">1</span>
            </div> */}
            <span className="text-2xl font-bold text-gray-100 tracking-tight">SceneMap</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2 flex-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-[#fbbf24]/10 text-[#fbbf24]'
                  : 'text-gray-400 hover:bg-[#1f2028] hover:text-gray-300'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/cases"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                location.pathname.startsWith('/cases')
                  ? 'bg-[#fbbf24]/10 text-[#fbbf24]'
                  : 'text-gray-400 hover:bg-[#1f2028] hover:text-gray-300'
              }`}
            >
              Cases
            </Link>
            <Link
              to="/timeline"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                location.pathname === '/timeline'
                  ? 'bg-[#fbbf24]/10 text-[#fbbf24]'
                  : 'text-gray-400 hover:bg-[#1f2028] hover:text-gray-300'
              }`}
            >
              Timeline
            </Link>
          </nav>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <Link 
              to="/profile"
              className="hidden sm:flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              {/* User Avatar */}
              <div className="w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center border-2 border-[#2e303a]">
                <span className="text-base font-bold text-[#0a0b0f]">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {/* User Info */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-100">{currentUser?.name}</span>
                <span className="text-xs text-gray-500">{currentUser?.badgeNumber ? `Badge #${currentUser.badgeNumber}` : 'View Profile'}</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#1f2028] border border-[#2e303a] hover:bg-[#2e303a] hover:border-[#fbbf24]/30 text-gray-300 rounded-lg font-medium transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 13L3 9L7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 9H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 3H14C14.5523 3 15 3.44772 15 4V14C15 14.5523 14.5523 15 14 15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#16171d] border-t border-[#2e303a] py-6 text-center">
        <p className="text-sm text-gray-500">&copy; 2026 SceneMap - Interactive Field Evidence Logger</p>
        <p className="text-xs text-gray-600 mt-1">Authorized Law Enforcement Use Only</p>
      </footer>
    </div>
  );
};

export default Layout;

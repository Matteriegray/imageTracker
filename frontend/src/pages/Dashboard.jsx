import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="evidence-marker-large">
            <span className="marker-number">★</span>
          </div>
          <h1>Welcome, {currentUser?.name}</h1>
          <div className="officer-info">
            <span className="badge">Badge: {currentUser?.badge}</span>
            <span className="role">{currentUser?.role}</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Active Cases</h3>
              <p className="stat-number">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <h3>Evidence Pins</h3>
              <p className="stat-number">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📸</div>
            <div className="stat-content">
              <h3>Scene Photos</h3>
              <p className="stat-number">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h3>Last Activity</h3>
              <p className="stat-number">Just now</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-button primary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create New Case
            </button>
            <button className="action-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 8L10 3L17 8V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V8Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              View Active Cases
            </button>
            <button className="action-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="5" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Case Timeline
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-empty">
            <p>No recent activity</p>
            <p className="activity-subtitle">Create your first case to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

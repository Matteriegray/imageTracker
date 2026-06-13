import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCases } from '../hooks/useCases';

const Dashboard = () => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { cases, loading } = useCases();

  const activeCount = cases.filter((c) => c.status === 'active').length;
  const closedCount = cases.filter((c) => c.status === 'closed').length;
  const evidenceCount = cases.reduce((sum, c) => sum + (c.evidenceCount || 0), 0);
  const photoCases = cases.filter((c) => !!c.sceneImageUrl);
  const scenePhotoCount = photoCases.length;

  const activityItems = cases
    .flatMap((caseItem) => {
      const events = [];
      const timestamp = caseItem.createdAt ? new Date(caseItem.createdAt).toISOString() : null;

      if (timestamp) {
        events.push({
          id: `${caseItem._id}-created`,
          title: 'Case Created',
          description: `New case "${caseItem.title}" was created`,
          user: caseItem.createdByName || currentUser?.name || 'Officer',
          timestamp,
          icon: '📋',
          color: 'blue'
        });
      }

      if (caseItem.sceneImageName) {
        events.push({
          id: `${caseItem._id}-photo`,
          title: 'Scene Photo Added',
          description: `Photo "${caseItem.sceneImageName}" attached to ${caseItem.title}`,
          user: caseItem.createdByName || currentUser?.name || 'Officer',
          timestamp,
          icon: '📸',
          color: 'green'
        });
      }

      if (caseItem.evidenceCount > 0) {
        events.push({
          id: `${caseItem._id}-evidence`,
          title: 'Evidence Logged',
          description: `${caseItem.evidenceCount} evidence item(s) recorded for ${caseItem.title}`,
          user: caseItem.createdByName || currentUser?.name || 'Officer',
          timestamp,
          icon: '📍',
          color: 'yellow'
        });
      }

      return events;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const lastActivityText = loading
    ? 'Loading...'
    : activityItems.length === 0
    ? 'No activity'
    : `${activityItems[0].title}: ${new Date(activityItems[0].timestamp).toLocaleString()}`;

  const recentActivity = activityItems.slice(0, 3);

  return (
    <div className="py-10 px-5 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center p-10 bg-gradient-to-br from-[#1f2028] to-[#16171d] border border-[#2e303a] rounded-xl mb-8 shadow-lg">
        <div className="evidence-marker w-20 h-20 mx-auto mb-5">
          <span className="text-4xl text-[#0a0b0f]">★</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">
          Welcome, {currentUser?.name}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
          <span className="px-3 py-1 bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-md text-[#fbbf24] font-medium">
            Badge: {currentUser?.badge}
          </span>
          <span className="font-medium">{currentUser?.role}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Active Cases */}
        <div 
          onClick={() => navigate('/cases')}
          className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex items-center gap-4 hover:border-[#fbbf24]/30 hover:-translate-y-1 transition-all duration-200 shadow-lg cursor-pointer group"
        >
          <div className="text-4xl flex items-center justify-center w-14 h-14 bg-[#1f2028] rounded-xl group-hover:scale-110 transition-transform">
            📋
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
              Active Cases
            </h3>
            <p className="text-3xl font-bold text-gray-100">{cases.filter((c) => c.status === 'active').length}</p>
          </div>
        </div>

        {/* Evidence Pins */}
        <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex items-center gap-4 hover:border-[#fbbf24]/30 hover:-translate-y-1 transition-all duration-200 shadow-lg cursor-pointer group">
          <div className="text-4xl flex items-center justify-center w-14 h-14 bg-[#1f2028] rounded-xl group-hover:scale-110 transition-transform">
            📍
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
              Evidence Pins
            </h3>
            <p className="text-3xl font-bold text-gray-100">{cases.reduce((sum, c) => sum + (c.evidenceCount || 0), 0)}</p>
          </div>
        </div>

        {/* Scene Photos */}
        <div
          onClick={() => setShowPhotoModal(true)}
          className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex items-center gap-4 hover:border-[#fbbf24]/30 hover:-translate-y-1 transition-all duration-200 shadow-lg cursor-pointer group"
        >
          <div className="text-4xl flex items-center justify-center w-14 h-14 bg-[#1f2028] rounded-xl group-hover:scale-110 transition-transform">
            📸
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
              Scene Photos
            </h3>
            <p className="text-3xl font-bold text-gray-100">{cases.filter((c) => !!c.sceneImageUrl).length}</p>
          </div>
        </div>

        {/* Closed Cases */}
        <div
          onClick={() => navigate('/cases?filter=closed')}
          className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex items-center gap-4 hover:border-[#fbbf24]/30 hover:-translate-y-1 transition-all duration-200 shadow-lg cursor-pointer group"
        >
          <div className="text-4xl flex items-center justify-center w-14 h-14 bg-[#1f2028] rounded-xl group-hover:scale-110 transition-transform">
            🔒
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
              Closed Cases
            </h3>
            <p className="text-3xl font-bold text-gray-100">{closedCount}</p>
          </div>
        </div>

        {/* Last Activity */}
        <div 
          onClick={() => navigate('/timeline')}
          className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex items-center gap-4 hover:border-[#fbbf24]/30 hover:-translate-y-1 transition-all duration-200 shadow-lg cursor-pointer group"
        >
          <div className="text-4xl flex items-center justify-center w-14 h-14 bg-[#1f2028] rounded-xl group-hover:scale-110 transition-transform">
            ⏱️
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
              Last Activity
            </h3>
            <p className="text-2xl font-bold text-gray-100">{lastActivityText}</p>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-[#2e303a] bg-[#0f1118] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e303a] px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-100">Scene Photos</h2>
                <p className="text-sm text-gray-400">Showing photos for cases with uploaded scene images.</p>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="rounded-full bg-[#16171d] px-4 py-2 text-sm font-medium text-gray-200 hover:bg-[#2e303a] transition-all"
              >
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
              {photoCases.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#2e303a] bg-[#16171d] p-12 text-center text-gray-400">
                  No scene photos available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {photoCases.map((caseItem) => (
                    <div key={caseItem._id} className="overflow-hidden rounded-3xl border border-[#2e303a] bg-[#181a21] shadow-lg">
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-100">{caseItem.title}</h3>
                            <p className="text-sm text-gray-400">{caseItem.location}</p>
                          </div>
                          <button
                            onClick={() => navigate(`/cases/${caseItem._id}`)}
                            className="text-sm font-medium text-[#fbbf24] hover:text-[#f59e0b]"
                          >
                            Open
                          </button>
                        </div>
                        <p className="mt-3 text-sm text-gray-400">{caseItem.sceneImageName}</p>
                      </div>
                      <img
                        src={caseItem.sceneImageUrl}
                        alt={caseItem.sceneImageName || caseItem.title}
                        className="h-72 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-8 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={() => navigate('/cases/new')}
            className="flex items-center justify-center gap-2 py-4 px-5 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold rounded-lg transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-[#fbbf24]/30"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create New Case
          </button>
          <button 
            onClick={() => navigate('/cases')}
            className="flex items-center justify-center gap-2 py-4 px-5 bg-[#1f2028] hover:bg-[#2e303a] text-gray-300 font-medium rounded-lg transition-all duration-200 border border-[#2e303a] hover:border-[#fbbf24]/30 hover:-translate-y-1"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 8L10 3L17 8V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V8Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            View Active Cases
          </button>
          <button 
            onClick={() => navigate('/timeline')}
            className="flex items-center justify-center gap-2 py-4 px-5 bg-[#1f2028] hover:bg-[#2e303a] text-gray-300 font-medium rounded-lg transition-all duration-200 border border-[#2e303a] hover:border-[#fbbf24]/30 hover:-translate-y-1"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="5" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Case Timeline
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-100">Recent Activity</h2>
          <button 
            onClick={() => navigate('/timeline')}
            className="text-sm text-[#fbbf24] hover:text-[#f59e0b] font-medium"
          >
            View All →
          </button>
        </div>
        
        {recentActivity.length === 0 ? (
          <div className="text-center py-16 bg-[#1f2028] rounded-xl border border-[#2e303a] text-gray-400">
            No recent activity yet. Create a case to begin tracking work.
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-[#1f2028] rounded-lg">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-gray-200 font-medium mb-1">{activity.title}</p>
                  <p className="text-sm text-gray-400">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

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
        <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex items-center gap-4 hover:border-[#fbbf24]/30 hover:-translate-y-1 transition-all duration-200 shadow-lg cursor-pointer group">
          <div className="text-4xl flex items-center justify-center w-14 h-14 bg-[#1f2028] rounded-xl group-hover:scale-110 transition-transform">
            📋
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
              Active Cases
            </h3>
            <p className="text-3xl font-bold text-gray-100">0</p>
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
            <p className="text-3xl font-bold text-gray-100">0</p>
          </div>
        </div>

        {/* Scene Photos */}
        <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex items-center gap-4 hover:border-[#fbbf24]/30 hover:-translate-y-1 transition-all duration-200 shadow-lg cursor-pointer group">
          <div className="text-4xl flex items-center justify-center w-14 h-14 bg-[#1f2028] rounded-xl group-hover:scale-110 transition-transform">
            📸
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
              Scene Photos
            </h3>
            <p className="text-3xl font-bold text-gray-100">0</p>
          </div>
        </div>

        {/* Last Activity */}
        <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex items-center gap-4 hover:border-[#fbbf24]/30 hover:-translate-y-1 transition-all duration-200 shadow-lg cursor-pointer group">
          <div className="text-4xl flex items-center justify-center w-14 h-14 bg-[#1f2028] rounded-xl group-hover:scale-110 transition-transform">
            ⏱️
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
              Last Activity
            </h3>
            <p className="text-2xl font-bold text-gray-100">Just now</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-8 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 py-4 px-5 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold rounded-lg transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-[#fbbf24]/30">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create New Case
          </button>
          <button className="flex items-center justify-center gap-2 py-4 px-5 bg-[#1f2028] hover:bg-[#2e303a] text-gray-300 font-medium rounded-lg transition-all duration-200 border border-[#2e303a] hover:border-[#fbbf24]/30 hover:-translate-y-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 8L10 3L17 8V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V8Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            View Active Cases
          </button>
          <button className="flex items-center justify-center gap-2 py-4 px-5 bg-[#1f2028] hover:bg-[#2e303a] text-gray-300 font-medium rounded-lg transition-all duration-200 border border-[#2e303a] hover:border-[#fbbf24]/30 hover:-translate-y-1">
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
        <h2 className="text-xl font-semibold text-gray-100 mb-5">Recent Activity</h2>
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-50">📭</div>
          <p className="text-gray-500 mb-2">No recent activity</p>
          <p className="text-sm text-gray-600">Create your first case to get started</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

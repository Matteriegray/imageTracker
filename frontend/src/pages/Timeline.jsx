import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCases } from '../hooks/useCases';

const Timeline = () => {
  const { currentUser } = useAuth();
  const { cases, loading } = useCases();
  const [filter, setFilter] = useState('all');

  const activities = cases
    .flatMap((caseItem) => {
      const timestamp = caseItem.createdAt ? new Date(caseItem.createdAt).toISOString() : null;
      const baseUser = caseItem.createdByName || currentUser?.name || 'Officer';
      const events = [];

      if (timestamp) {
        events.push({
          id: `${caseItem._id}-created`,
          type: 'case_created',
          title: 'Case Created',
          description: `New case "${caseItem.title}" was created`,
          user: baseUser,
          timestamp,
          icon: '📋',
          color: 'blue'
        });
      }

      if (caseItem.sceneImageName && timestamp) {
        events.push({
          id: `${caseItem._id}-photo`,
          type: 'photo_uploaded',
          title: 'Scene Photo Uploaded',
          description: `Photo "${caseItem.sceneImageName}" added to ${caseItem.title}`,
          user: baseUser,
          timestamp,
          icon: '📸',
          color: 'green'
        });
      }

      if (caseItem.evidenceCount > 0 && timestamp) {
        events.push({
          id: `${caseItem._id}-evidence`,
          type: 'evidence_added',
          title: 'Evidence Logged',
          description: `${caseItem.evidenceCount} evidence item(s) recorded for ${caseItem.title}`,
          user: baseUser,
          timestamp,
          icon: '📍',
          color: 'yellow'
        });
      }

      return events;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      green: 'bg-green-500/10 border-green-500/30 text-green-400',
      orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="py-10 px-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Activity Timeline</h1>
        <p className="text-gray-400">Chronological log of all case activities and evidence updates</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-[#fbbf24] text-[#0a0b0f]'
              : 'bg-[#1f2028] text-gray-400 hover:text-gray-300'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('case_created')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'case_created'
              ? 'bg-[#fbbf24] text-[#0a0b0f]'
              : 'bg-[#1f2028] text-gray-400 hover:text-gray-300'
          }`}
        >
          Cases
        </button>
        <button
          onClick={() => setFilter('evidence_added')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'evidence_added'
              ? 'bg-[#fbbf24] text-[#0a0b0f]'
              : 'bg-[#1f2028] text-gray-400 hover:text-gray-300'
          }`}
        >
          Evidence
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#2e303a]"></div>

        {/* Timeline Items */}
        <div className="space-y-6">
          {activities
            .filter(activity => filter === 'all' || activity.type === filter)
            .map((activity, index) => (
              <div key={activity.id} className="relative pl-16">
                {/* Icon */}
                <div className="absolute left-0 top-0 w-12 h-12 bg-[#16171d] border-2 border-[#2e303a] rounded-full flex items-center justify-center text-2xl">
                  {activity.icon}
                </div>

                {/* Content */}
                <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-5 hover:border-[#fbbf24]/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100 mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-gray-400">{activity.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-xs font-medium border ${getColorClasses(activity.color)}`}>
                      {activity.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M14 14C14 11.7909 11.3137 10 8 10C4.68629 10 2 11.7909 2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      {activity.user}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 4V8L11 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Empty State */}
      {activities.filter(a => filter === 'all' || a.type === filter).length === 0 && (
        <div className="text-center py-16 bg-[#16171d] border border-[#2e303a] rounded-xl">
          <div className="text-6xl mb-4 opacity-50">📭</div>
          <p className="text-gray-500 mb-2">No activities found</p>
          <p className="text-sm text-gray-600">Activities will appear here as cases progress</p>
        </div>
      )}
    </div>
  );
};

export default Timeline;

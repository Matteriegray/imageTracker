import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Cases = () => {
  const { authToken } = useAuth();
  const location = useLocation();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, closed

  useEffect(() => {
    const loadCases = async () => {
      try {
        const response = await fetch(`${API_URL}/api/cases`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Unable to load cases');
        }

        const data = await response.json();
        setCases(data);
      } catch (err) {
        console.error('Fetch cases error:', err);
        setError('Unable to load cases. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      loadCases();
    } else {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const requestedFilter = searchParams.get('filter');

    if (requestedFilter === 'active' || requestedFilter === 'closed' || requestedFilter === 'all') {
      setFilter(requestedFilter);
    } else {
      setFilter('all');
    }
  }, [location.search]);

  const filteredCases = cases.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const closeCase = async (caseId) => {
    try {
      const response = await fetch(`${API_URL}/api/cases/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: 'closed' })
      });

      if (!response.ok) {
        throw new Error('Unable to close case');
      }

      const updatedCase = await response.json();
      setCases(prev => prev.map((c) => (c._id === updatedCase._id ? updatedCase : c)));
    } catch (err) {
      console.error('Close case error:', err);
      alert('Unable to close case. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="py-10 px-5 max-w-7xl mx-auto text-gray-300">
        <p className="text-xl font-medium">Loading cases...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-500/10 border-green-500/30 text-green-400'
      : 'bg-gray-500/10 border-gray-500/30 text-gray-400';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-500/10 border-red-500/30 text-red-400';
    if (priority === 'medium') return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  };

  return (
    <div className="py-10 px-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Case Management</h1>
          <p className="text-gray-400">Manage and track all crime scene investigations</p>
        </div>
        <Link
          to="/cases/new"
          className="flex items-center gap-2 px-6 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold rounded-lg transition-all hover:-translate-y-0.5 shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Create New Case
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-[#fbbf24] text-[#0a0b0f]'
              : 'bg-[#1f2028] text-gray-400 hover:text-gray-300'
          }`}
        >
          All Cases ({cases.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'active'
              ? 'bg-[#fbbf24] text-[#0a0b0f]'
              : 'bg-[#1f2028] text-gray-400 hover:text-gray-300'
          }`}
        >
          Active ({cases.filter(c => c.status === 'active').length})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'closed'
              ? 'bg-[#fbbf24] text-[#0a0b0f]'
              : 'bg-[#1f2028] text-gray-400 hover:text-gray-300'
          }`}
        >
          Closed ({cases.filter(c => c.status === 'closed').length})
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Cases Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredCases.map(caseItem => (
          <div
            key={caseItem._id}
            className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 hover:border-[#fbbf24]/30 transition-all hover:-translate-y-1 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-100">{caseItem.title}</h3>
                  <span className={`px-3 py-1 rounded-md text-xs font-medium border ${getStatusColor(caseItem.status)}`}>
                    {caseItem.status?.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-md text-xs font-medium border ${getPriorityColor(caseItem.priority)}`}>
                    {caseItem.priority?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Case #: {caseItem.caseNumber}</p>
                <p className="text-sm text-gray-400">📍 {caseItem.location}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Link
                  to={`/cases/${caseItem._id}`}
                  className="px-4 py-2 bg-[#1f2028] hover:bg-[#2e303a] text-gray-300 rounded-lg text-sm font-medium transition-all"
                >
                  View Details
                </Link>
                {caseItem.status === 'active' ? (
                  <button
                    onClick={() => closeCase(caseItem._id)}
                    className="px-4 py-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] rounded-lg text-sm font-medium transition-all"
                  >
                    Close Case
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-lg border border-gray-600 text-xs text-gray-400 uppercase tracking-[0.08em]">
                    Closed
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-[#2e303a] text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4V8L11 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {caseItem.createdAt ? new Date(caseItem.createdAt).toLocaleDateString() : 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M14 14C14 11.7909 11.3137 10 8 10C4.68629 10 2 11.7909 2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {caseItem.createdByName || 'Officer'}
              </div>
              <div className="flex items-center gap-2 text-[#fbbf24]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L9.5 5L13 5.5L10.5 8L11 11.5L8 10L5 11.5L5.5 8L3 5.5L6.5 5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                {caseItem.evidenceCount ?? 0} Evidence Items
              </div>
            </div>
          </div>
        ))}

        {filteredCases.length === 0 && (
          <div className="text-center py-16 bg-[#16171d] border border-[#2e303a] rounded-xl">
            <div className="text-6xl mb-4 opacity-50">📂</div>
            <p className="text-gray-500 mb-2">No {filter} cases found</p>
            <p className="text-sm text-gray-600">Create a new case to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;

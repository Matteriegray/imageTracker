import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChainOfCustody from '../components/ChainOfCustody';
import EvidenceRelationshipGraph from '../components/EvidenceRelationshipGraph';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Evidence = () => {
  const { authToken } = useAuth();
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [evidence, setEvidence] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    evidenceType: 'other',
    description: '',
    location: ''
  });

  useEffect(() => {
    loadEvidence();
  }, [caseId]);

  const loadEvidence = async () => {
    try {
      const response = await fetch(`${API_URL}/api/evidence/case/${caseId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to load evidence');

      const data = await response.json();
      setEvidence(data);
    } catch (err) {
      console.error('Error loading evidence:', err);
      setError('Unable to load evidence');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvidence = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/evidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          caseId,
          ...formData
        })
      });

      if (!response.ok) throw new Error('Failed to create evidence');

      const newEvidence = await response.json();
      setEvidence([newEvidence, ...evidence]);
      setFormData({
        evidenceType: 'other',
        description: '',
        location: ''
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating evidence:', err);
      alert('Failed to create evidence');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'weapon': 'bg-red-500/10 border-red-500/30 text-red-300',
      'dna': 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      'document': 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      'photo': 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      'trace': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
      'other': 'bg-gray-500/10 border-gray-500/30 text-gray-300'
    };
    return colors[type] || colors['other'];
  };

  const getTypeIcon = (type) => {
    const icons = {
      'weapon': '🔫',
      'dna': '🧬',
      'document': '📄',
      'photo': '📸',
      'trace': '🔍',
      'other': '📦'
    };
    return icons[type] || '📦';
  };

  const getStatusColor = (status) => {
    const colors = {
      'collected': 'bg-green-500/10 border-green-500/30 text-green-300',
      'in-transit': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
      'stored': 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      'analyzed': 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      'released': 'bg-gray-500/10 border-gray-500/30 text-gray-300'
    };
    return colors[status] || colors['collected'];
  };

  if (loading) {
    return (
      <div className="py-10 px-5 max-w-7xl mx-auto text-gray-300">
        <p className="text-xl font-medium">Loading evidence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 px-5 max-w-7xl mx-auto">
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-3 bg-[#1f2028] text-gray-300 rounded-lg hover:bg-[#2e303a] transition-all"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 px-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Evidence Management</h1>
          <p className="text-gray-400">Track and manage all evidence for this case</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold rounded-lg transition-all"
          >
            {showForm ? 'Cancel' : '+ Add Evidence'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-[#1f2028] text-gray-300 rounded-lg hover:bg-[#2e303a] transition-all"
          >
            Back to Case
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreateEvidence} className="mb-8 p-6 bg-[#16171d] border border-[#2e303a] rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Evidence Type
              </label>
              <select
                value={formData.evidenceType}
                onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value })}
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              >
                <option value="weapon">Weapon</option>
                <option value="dna">DNA</option>
                <option value="document">Document</option>
                <option value="photo">Photo</option>
                <option value="trace">Trace</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
                required
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Where it was found"
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
          >
            Create Evidence
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Evidence List */}
        <div className="lg:col-span-1">
          <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-100 mb-4">Evidence Items ({evidence.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {evidence.length > 0 ? (
                evidence.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedEvidence(item)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedEvidence?._id === item._id
                        ? 'bg-[#2e303a] border-[#fbbf24]'
                        : 'bg-[#1f2028] border-[#2e303a] hover:border-[#fbbf24]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getTypeIcon(item.evidenceType)}</span>
                      <span className="font-semibold text-gray-100 text-sm">{item.description.substring(0, 20)}...</span>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No evidence logged yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Selected Evidence Details */}
        <div className="lg:col-span-2">
          {selectedEvidence ? (
            <div className="space-y-6">
              <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{getTypeIcon(selectedEvidence.evidenceType)}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100">{selectedEvidence.description}</h2>
                    <div className={`inline-block px-3 py-1 rounded-md text-sm font-semibold mt-2 ${getTypeColor(selectedEvidence.evidenceType)}`}>
                      {selectedEvidence.evidenceType.toUpperCase()}
                    </div>
                  </div>
                </div>

                {selectedEvidence.location && (
                  <div className="mb-4 p-3 bg-[#1f2028] rounded-lg">
                    <p className="text-sm text-gray-400">Location Found</p>
                    <p className="text-gray-100">{selectedEvidence.location}</p>
                  </div>
                )}

                <div className={`inline-block px-3 py-1 rounded-md text-sm font-semibold ${getStatusColor(selectedEvidence.status)}`}>
                  Status: {selectedEvidence.status}
                </div>
              </div>

              {/* Chain of Custody */}
              <ChainOfCustody
                evidenceId={selectedEvidence._id}
                chainOfCustody={selectedEvidence.chainOfCustody}
                onAddEntry={(updatedEvidence) => {
                  setSelectedEvidence(updatedEvidence);
                  setEvidence(evidence.map(e => e._id === updatedEvidence._id ? updatedEvidence : e));
                }}
              />
            </div>
          ) : (
            <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-12 shadow-lg text-center">
              <p className="text-gray-400 text-lg">Select an evidence item to view details and chain of custody</p>
            </div>
          )}
        </div>
      </div>

      {/* Relationship Graph */}
      <EvidenceRelationshipGraph caseId={caseId} />
    </div>
  );
};

export default Evidence;

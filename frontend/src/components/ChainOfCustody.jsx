import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../api/config';

const ChainOfCustody = ({ evidenceId, chainOfCustody, onAddEntry }) => {
  const { authToken } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    action: 'transferred',
    transferredFrom: '',
    transferredTo: '',
    receivedBy: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/evidence/${evidenceId}/custody`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Unable to add custody entry');
      }

      const updatedEvidence = await response.json();
      onAddEntry(updatedEvidence);
      setShowForm(false);
      setFormData({
        action: 'transferred',
        transferredFrom: '',
        transferredTo: '',
        receivedBy: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error adding custody entry:', err);
      alert('Unable to add custody entry');
    }
  };

  const getActionColor = (action) => {
    const colors = {
      'collected': 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      'transferred': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
      'received': 'bg-green-500/10 border-green-500/30 text-green-300',
      'analyzed': 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      'stored': 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
    };
    return colors[action] || colors['collected'];
  };

  const getActionIcon = (action) => {
    const icons = {
      'collected': '📦',
      'transferred': '🚚',
      'received': '✅',
      'analyzed': '🔬',
      'stored': '🗄️'
    };
    return icons[action] || '📋';
  };

  return (
    <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
          🔗 Chain of Custody
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] rounded-lg text-sm font-medium transition-all"
        >
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[#1f2028] rounded-lg border border-[#2e303a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Action Type
              </label>
              <select
                name="action"
                value={formData.action}
                onChange={handleChange}
                className="w-full bg-[#16171d] border border-[#2e303a] rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              >
                <option value="transferred">Transferred</option>
                <option value="received">Received</option>
                <option value="analyzed">Analyzed</option>
                <option value="stored">Stored</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Transferred From
              </label>
              <input
                type="text"
                name="transferredFrom"
                value={formData.transferredFrom}
                onChange={handleChange}
                placeholder="Location or Department"
                className="w-full bg-[#16171d] border border-[#2e303a] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Transferred To
              </label>
              <input
                type="text"
                name="transferredTo"
                value={formData.transferredTo}
                onChange={handleChange}
                placeholder="Location or Department"
                className="w-full bg-[#16171d] border border-[#2e303a] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Received By
              </label>
              <input
                type="text"
                name="receivedBy"
                value={formData.receivedBy}
                onChange={handleChange}
                placeholder="Name / Badge Number"
                className="w-full bg-[#16171d] border border-[#2e303a] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional details about this custody transfer"
              rows="3"
              className="w-full bg-[#16171d] border border-[#2e303a] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all"
          >
            Log Entry
          </button>
        </form>
      )}

      <div className="space-y-4">
        {chainOfCustody && chainOfCustody.length > 0 ? (
          chainOfCustody.map((entry, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getActionColor(entry.action)} flex items-start gap-4`}
            >
              <div className="text-3xl">{getActionIcon(entry.action)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold capitalize">{entry.action}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString()}
                  </span>
                </div>
                {entry.officer && (
                  <div className="text-sm mb-2">
                    <span className="font-medium">Officer:</span> {entry.officer.name} ({entry.officer.badge})
                  </div>
                )}
                {entry.transferredFrom && (
                  <div className="text-sm mb-1">
                    <span className="font-medium">From:</span> {entry.transferredFrom}
                  </div>
                )}
                {entry.transferredTo && (
                  <div className="text-sm mb-1">
                    <span className="font-medium">To:</span> {entry.transferredTo}
                  </div>
                )}
                {entry.receivedBy && (
                  <div className="text-sm mb-1">
                    <span className="font-medium">Received by:</span> {entry.receivedBy}
                  </div>
                )}
                {entry.notes && (
                  <div className="text-sm mt-2 p-2 bg-black/20 rounded">
                    {entry.notes}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">No custody entries yet</p>
        )}
      </div>
    </div>
  );
};

export default ChainOfCustody;

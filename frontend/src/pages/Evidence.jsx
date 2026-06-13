import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChainOfCustody from '../components/ChainOfCustody';
import EvidenceRelationshipGraph from '../components/EvidenceRelationshipGraph';
import { API_URL } from '../api/config';

const Evidence = () => {
  const { authToken } = useAuth();
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseDetail, setCaseDetail] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [formData, setFormData] = useState({
    evidenceType: 'other',
    itemName: '',
    pinXPercent: '',
    pinYPercent: '',
    bagSerialNumber: '',
    description: '',
    collectedBy: ''
  });

  const currentPhoto = caseDetail?.scenePhotos?.[selectedPhotoIndex] || { url: caseDetail?.sceneImageUrl, name: caseDetail?.sceneImageName };

  useEffect(() => {
    if (caseId && authToken) {
      loadEvidence();
      loadCaseDetail();
    }
  }, [caseId, authToken]);

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

  const loadCaseDetail = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cases/${caseId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to load case details');
      const data = await response.json();
      setCaseDetail(data);
    } catch (err) {
      console.error('Error loading case detail:', err);
    }
  };

  const handleImageClick = (e) => {
    if (!currentPhoto?.url) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const xFixed = Number(x.toFixed(2));
    const yFixed = Number(y.toFixed(2));

    setSelectedPoint({ x: xFixed, y: yFixed });
    setFormData(prev => ({
      ...prev,
      pinXPercent: xFixed,
      pinYPercent: yFixed
    }));
    if (!showForm) setShowForm(true);
  };

  const handleCreateEvidence = async (e) => {
    e.preventDefault();

    const categoryMap = {
      weapon: 'weapon',
      dna: 'biological',
      document: 'document',
      photo: 'digital',
      trace: 'trace',
      other: 'other'
    };

    try {
      const response = await fetch(`${API_URL}/api/evidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          caseId,
          itemName: formData.itemName,
          pinXPercent: Number(formData.pinXPercent),
          pinYPercent: Number(formData.pinYPercent),
          bagSerialNumber: formData.bagSerialNumber,
          category: categoryMap[formData.evidenceType] || 'other',
          description: formData.description,
          collectedBy: formData.collectedBy,
          photoId: currentPhoto?._id
        })
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message || 'Failed to create evidence');
      }

      const newEvidence = await response.json();
      setEvidence([newEvidence, ...evidence]);
      setFormData({
        evidenceType: 'other',
        itemName: '',
        pinXPercent: '',
        pinYPercent: '',
        bagSerialNumber: '',
        description: '',
        collectedBy: ''
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating evidence:', err);
      alert(err.message || 'Failed to create evidence');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'weapon': 'bg-red-500/10 border-red-500/30 text-red-300',
      'biological': 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      'document': 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      'digital': 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      'trace': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
      'impression': 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
      'other': 'bg-gray-500/10 border-gray-500/30 text-gray-300'
    };
    return colors[type] || colors['other'];
  };

  const getTypeIcon = (type) => {
    const icons = {
      'weapon': '🔫',
      'biological': '🧬',
      'document': '📄',
      'digital': '📸',
      'trace': '🔍',
      'impression': '🧾',
      'other': '📦'
    };
    return icons[type] || '📦';
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

      {(caseDetail?.sceneImageUrl || caseDetail?.scenePhotos?.length > 0) && (
        <div className="mb-8 bg-[#16171d] border border-[#2e303a] rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-100">Scene Photos</h2>
              <p className="text-sm text-gray-400">Click any point on the image to capture X/Y coordinates for evidence.</p>
            </div>
            <div className="text-sm text-gray-300">
              {selectedPoint ? (
                <>{selectedPoint.x}% X, {selectedPoint.y}% Y</>
              ) : (
                'Click the photo to choose coordinates'
              )}
            </div>
          </div>

          {caseDetail?.scenePhotos?.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Photo</label>
              <select
                value={selectedPhotoIndex}
                onChange={(e) => {
                  setSelectedPhotoIndex(Number(e.target.value));
                  setSelectedPoint(null);
                }}
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              >
                {caseDetail.scenePhotos.map((photo, idx) => (
                  <option key={idx} value={idx}>
                    Photo {idx + 1}: {photo.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative rounded-xl overflow-hidden border border-[#2e303a] bg-black">
            <img
              src={currentPhoto?.url}
              alt={currentPhoto?.name || 'Scene photo'}
              onClick={handleImageClick}
              className="w-full h-auto cursor-crosshair object-contain"
            />

            {selectedPoint && (
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#fbbf24] bg-[#fbbf24]/40 shadow-xl"
                style={{ left: `${selectedPoint.x}%`, top: `${selectedPoint.y}%`, width: '18px', height: '18px' }}
              />
            )}

            {(() => {
              const visibleEvidence = (caseDetail?.scenePhotos?.length > 0)
                ? evidence.filter(ev => String(ev.photoId) === String(currentPhoto?._id))
                : evidence;

              return visibleEvidence.map((item, index) => (
              <button
                key={item._id}
                type="button"
                title={`${item.itemName} (${item.pinXPercent}%, ${item.pinYPercent}%)`}
                onClick={() => setSelectedEvidence(item)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/80 text-xs font-bold text-black transition-transform hover:scale-110`}
                style={{ left: `${item.pinXPercent}%`, top: `${item.pinYPercent}%`, width: '22px', height: '22px' }}
              >
                {item.pinNumber || index + 1}
              </button>
              ));
            })()}
          </div>
        </div>
      )}

      {caseDetail && !caseDetail.sceneImageUrl && !caseDetail.scenePhotos?.length && (
        <div className="mb-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-yellow-200">
          This case has no scene photos uploaded. Add scene photos when creating the case to use image-based evidence pinning.
        </div>
      )}

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
                  Item Name
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="Evidence item name"
                  required
                  className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pin X (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.pinXPercent}
                  onChange={(e) => setFormData({ ...formData, pinXPercent: e.target.value })}
                  placeholder="0-100"
                  required
                  className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pin Y (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.pinYPercent}
                  onChange={(e) => setFormData({ ...formData, pinYPercent: e.target.value })}
                  placeholder="0-100"
                  required
                  className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bag Serial Number
                </label>
                <input
                  type="text"
                  value={formData.bagSerialNumber}
                  onChange={(e) => setFormData({ ...formData, bagSerialNumber: e.target.value })}
                  placeholder="Evidence bag ID"
                  className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Collected By
                </label>
                <input
                  type="text"
                  value={formData.collectedBy}
                  onChange={(e) => setFormData({ ...formData, collectedBy: e.target.value })}
                  placeholder="Officer name"
                  className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
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
                      <span className="text-xl">{getTypeIcon(item.category)}</span>
                      <span className="font-semibold text-gray-100 text-sm">{item.itemName.substring(0, 20)}...</span>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.category)}`}>
                      {item.category}
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
                  <span className="text-4xl">{getTypeIcon(selectedEvidence.category)}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100">{selectedEvidence.itemName}</h2>
                    <div className={`inline-block px-3 py-1 rounded-md text-sm font-semibold mt-2 ${getTypeColor(selectedEvidence.category)}`}>
                      {selectedEvidence.category.toUpperCase()}
                    </div>
                  </div>
                </div>

                {selectedEvidence.bagSerialNumber && (
                  <div className="mb-4 p-3 bg-[#1f2028] rounded-lg">
                    <p className="text-sm text-gray-400">Bag Serial Number</p>
                    <p className="text-gray-100">{selectedEvidence.bagSerialNumber}</p>
                  </div>
                )}

                <div className="mb-4 p-3 bg-[#1f2028] rounded-lg">
                  <p className="text-sm text-gray-400">Collected By</p>
                  <p className="text-gray-100">{selectedEvidence.collectedBy || 'Unknown'}</p>
                </div>

                {selectedEvidence.description && (
                  <div className="mb-4 p-3 bg-[#1f2028] rounded-lg">
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="text-gray-100">{selectedEvidence.description}</p>
                  </div>
                )}
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

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CaseDetail = () => {
  const { authToken } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseDetail, setCaseDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCase = async () => {
      if (!authToken) return;
      try {
        const response = await fetch(`${API_URL}/api/cases/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Case not found');
          }
          throw new Error('Unable to load case details');
        }

        const data = await response.json();
        setCaseDetail(data);
      } catch (err) {
        console.error('Fetch case detail error:', err);
        setError(err.message || 'Unable to load case details');
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [authToken, id]);

  if (loading) {
    return (
      <div className="py-10 px-5 max-w-5xl mx-auto text-gray-300">
        <p className="text-xl font-medium">Loading case details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 px-5 max-w-5xl mx-auto">
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

  if (!caseDetail) {
    return null;
  }

  return (
    <div className="py-10 px-5 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Case Detail</h1>
          <p className="text-gray-400">Review the full investigation record and scene photo.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold rounded-lg transition-all"
        >
          Back to Cases
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 bg-[#16171d] border border-[#2e303a] rounded-xl p-6 shadow-lg">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
                {caseDetail.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-300">
                {caseDetail.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">{caseDetail.title}</h2>
            <p className="text-gray-400">{caseDetail.description || 'No description provided.'}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2e303a] bg-[#1f2028] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">Case Number</p>
              <p className="text-lg font-semibold text-gray-100">{caseDetail.caseNumber}</p>
            </div>
            <div className="rounded-xl border border-[#2e303a] bg-[#1f2028] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">Location</p>
              <p className="text-lg font-semibold text-gray-100">{caseDetail.location}</p>
            </div>
            <div className="rounded-xl border border-[#2e303a] bg-[#1f2028] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">Evidence Items</p>
              <p className="text-lg font-semibold text-gray-100">{caseDetail.evidenceCount ?? 0}</p>
            </div>
            <div className="rounded-xl border border-[#2e303a] bg-[#1f2028] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">Created</p>
              <p className="text-lg font-semibold text-gray-100">{new Date(caseDetail.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#2e303a] bg-[#1f2028] p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Investigator</h3>
            <p className="text-gray-300">{caseDetail.createdByName || 'Unknown'}</p>
            {caseDetail.sceneImageName && (
              <p className="mt-2 text-sm text-gray-400">Scene photo: {caseDetail.sceneImageName}</p>
            )}
          </div>
        </div>

        <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Scene Photo</h3>
          {caseDetail.sceneImageUrl ? (
            <img
              src={caseDetail.sceneImageUrl}
              alt={`Scene for ${caseDetail.title}`}
              className="w-full rounded-xl border border-[#2e303a] object-cover"
            />
          ) : (
            <div className="flex h-72 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2e303a] bg-[#12131a] text-center px-4">
              <div className="text-5xl mb-3">📷</div>
              <p className="text-gray-400 mb-2">No scene photo uploaded for this case.</p>
              {caseDetail.sceneImageName && (
                <p className="text-sm text-gray-500">Image name: {caseDetail.sceneImageName}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;

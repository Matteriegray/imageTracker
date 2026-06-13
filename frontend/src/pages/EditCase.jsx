import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { API_URL } from '../api/config';

const EditCase = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    priority: 'medium',
    scenePhotos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = [];

    for (const file of files) {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      newPhotos.push({
        name: file.name,
        url: dataUrl
      });
    }

    setFormData(prev => ({
      ...prev,
      scenePhotos: [...prev.scenePhotos, ...newPhotos]
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      scenePhotos: prev.scenePhotos.filter((_, i) => i !== index)
    }));
  };

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

        const caseData = await response.json();
        const existingScenePhotos = Array.isArray(caseData.scenePhotos) && caseData.scenePhotos.length > 0
          ? caseData.scenePhotos
          : caseData.sceneImageUrl
            ? [{
                name: caseData.sceneImageName || 'Scene photo',
                url: caseData.sceneImageUrl
              }]
            : [];

        setFormData({
          title: caseData.title,
          location: caseData.location,
          description: caseData.description || '',
          priority: caseData.priority || 'medium',
          scenePhotos: existingScenePhotos
        });
      } catch (err) {
        console.error('Load case error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [id, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/cases/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: formData.title,
          location: formData.location,
          description: formData.description,
          priority: formData.priority,
          scenePhotos: formData.scenePhotos,
          sceneImageName: formData.scenePhotos[0]?.name || null,
          sceneImageUrl: formData.scenePhotos[0]?.url || null
        })
      });

      if (!response.ok) {
        throw new Error('Unable to update case');
      }

      navigate(`/cases/${id}`);
    } catch (error) {
      console.error('Update case error:', error);
      alert('Unable to update case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 px-5 max-w-4xl mx-auto text-gray-300">
        <p className="text-xl font-medium">Loading case details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 px-5 max-w-4xl mx-auto">
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
    <div className="py-10 px-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Edit Case</h1>
        <p className="text-gray-400">Update the case information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Case Information */}
        <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Case Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Case Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Burglary - Downtown Bank"
                required
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., 123 Main St, Downtown"
                required
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                Priority Level <span className="text-red-400">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scene Photos
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImageUpload}
                className="w-full text-gray-100"
              />
            </div>

            {formData.scenePhotos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {formData.scenePhotos.map((photo, index) => (
                  <div key={`${photo.name}-${index}`} className="relative rounded-xl overflow-hidden border border-[#2e303a] bg-[#0f1117]">
                    <img src={photo.url} alt={photo.name} className="h-48 w-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-start justify-end p-2">
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="p-3 bg-[#16171d] text-sm text-gray-300">
                      <p className="truncate">Photo {index + 1}: {photo.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add case details, notes, or observations..."
                rows="6"
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#1f2028] text-gray-300 rounded-lg hover:bg-[#2e303a] transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] disabled:bg-gray-500 text-[#0a0b0f] rounded-lg transition-all font-semibold disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Case'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCase;

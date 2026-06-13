import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CreateCase = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    priority: 'medium',
    sceneImage: null,
    sceneImagePreview: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          sceneImage: file,
          sceneImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let sceneImageUrl = formData.sceneImagePreview;
      if (formData.sceneImage && !sceneImageUrl) {
        sceneImageUrl = await fileToDataUrl(formData.sceneImage);
      }

      const response = await fetch(`${API_URL}/api/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: formData.title,
          location: formData.location,
          description: formData.description,
          priority: formData.priority,
          sceneImageName: formData.sceneImage?.name || null,
          sceneImageUrl: sceneImageUrl || null
        })
      });

      if (!response.ok) {
        throw new Error('Unable to create case');
      }

      navigate('/cases');
    } catch (error) {
      console.error('Create case error:', error);
      alert('Unable to create case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Create New Case</h1>
        <p className="text-gray-400">Document a new crime scene investigation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Case Title */}
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the incident and initial observations..."
                rows={4}
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Scene Image Upload */}
        <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Scene Image</h2>
          <p className="text-sm text-gray-400 mb-4">Upload a top-down or wide-angle photo of the crime scene</p>
          
          <div className="border-2 border-dashed border-[#2e303a] rounded-xl p-8 text-center hover:border-[#fbbf24]/50 transition-all">
            {formData.sceneImagePreview ? (
              <div className="space-y-4">
                <img
                  src={formData.sceneImagePreview}
                  alt="Scene Preview"
                  className="mx-auto h-56 w-full max-w-xl object-cover rounded-xl border border-[#2e303a]"
                />
                <div className="text-gray-300 font-medium">{formData.sceneImage.name}</div>
                <div className="text-sm text-gray-500">{(formData.sceneImage.size / 1024).toFixed(2)} KB</div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, sceneImage: null, sceneImagePreview: null }))}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-5xl">📁</div>
                <div>
                  <label htmlFor="sceneImage" className="cursor-pointer">
                    <span className="text-[#fbbf24] hover:text-[#f59e0b] font-medium">Click to upload</span>
                    <span className="text-gray-400"> or drag and drop</span>
                  </label>
                  <input
                    id="sceneImage"
                    name="sceneImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="flex-1 px-6 py-3 bg-[#1f2028] hover:bg-[#2e303a] text-gray-300 font-medium rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold rounded-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-[#0a0b0f] border-t-transparent rounded-full animate-spin" />
                Creating Case...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16 10L14 8M14 8L12 6M14 8H7M7 8C7 9.06087 6.57857 10.0783 5.82843 10.8284C5.07828 11.5786 4.06087 12 3 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Create Case
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCase;

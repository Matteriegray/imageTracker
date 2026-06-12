import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    badgeNumber: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = signup(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0b0f] to-gray-900 p-8">
      <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-12 w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="evidence-marker w-12 h-12">
              <span className="text-2xl font-bold text-[#0a0b0f]">★</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Join SceneMap</h1>
          </div>
          <p className="text-gray-400 text-sm">Register as a Field Officer</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={isLoading}
              autoComplete="name"
              className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Officer Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="officer@department.gov"
              disabled={isLoading}
              autoComplete="email"
              className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          {/* Badge & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="badgeNumber" className="block text-sm font-medium text-gray-300 mb-2">
                Badge Number
              </label>
              <input
                id="badgeNumber"
                name="badgeNumber"
                type="text"
                value={formData.badgeNumber}
                onChange={handleChange}
                placeholder="OFC-482"
                disabled={isLoading}
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2">
                Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                placeholder="Metro PD"
                disabled={isLoading}
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="10.5" r="0.5" fill="currentColor"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-[#fbbf24]/30 hover:-translate-y-0.5 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0a0b0f] border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Officer Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#2e303a] text-center space-y-2">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#fbbf24] hover:text-[#f59e0b] font-semibold transition-colors">
              Sign In
            </Link>
          </p>
          <p className="text-xs text-gray-600">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

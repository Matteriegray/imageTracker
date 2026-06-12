import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0b0f] to-gray-900 p-5">
      <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-12 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="evidence-marker w-12 h-12">
              <span className="text-2xl font-bold text-[#0a0b0f]">1</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-100 tracking-tight">SceneMap</h1>
          </div>
          <p className="text-gray-400 text-sm">Interactive Field Evidence Logger</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Officer Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@department.gov"
              disabled={isLoading}
              autoComplete="email"
              className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
              className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

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

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-[#fbbf24]/30 hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0a0b0f] border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              'Access System'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#2e303a] text-center space-y-2">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#fbbf24] hover:text-[#f59e0b] font-semibold transition-colors">
              Create Account
            </Link>
          </p>
          <p className="text-xs text-gray-600">Authorized Personnel Only</p>
          <p className="text-xs text-gray-500 italic">Demo: Use any email/password to login</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

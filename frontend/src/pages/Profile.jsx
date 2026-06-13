import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    badgeNumber: currentUser?.badgeNumber || '',
    department: currentUser?.department || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: API call to update user profile
    console.log('Save profile:', formData);
    setIsEditing(false);
    alert('Profile update feature coming soon!');
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      badgeNumber: currentUser?.badgeNumber || '',
      department: currentUser?.department || '',
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: API call to delete account
      console.log('Delete account');
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="py-10 px-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 text-center">
            {/* Avatar */}
            <div className="w-24 h-24 mx-auto mb-4 bg-[#fbbf24] rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-[#0a0b0f]">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>

            {/* User Info */}
            <h2 className="text-xl font-bold text-gray-100 mb-1">{currentUser?.name}</h2>
            <p className="text-sm text-gray-400 mb-2">{currentUser?.email}</p>
            
            {currentUser?.badgeNumber && (
              <div className="inline-block px-3 py-1 bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-lg text-[#fbbf24] text-sm font-semibold mb-4">
                Badge #{currentUser.badgeNumber}
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-[#2e303a] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Role</span>
                <span className="text-sm font-semibold text-gray-100">{currentUser?.role || 'Officer'}</span>
              </div>
              {currentUser?.department && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Department</span>
                  <span className="text-sm font-semibold text-gray-100">{currentUser.department}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="text-sm font-semibold text-gray-100">
                  {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-100">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold rounded-lg transition-all"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-[#1f2028] hover:bg-[#2e303a] text-gray-300 font-medium rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] font-semibold rounded-lg transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                  />
                ) : (
                  <p className="text-gray-100 px-4 py-3 bg-[#1f2028] border border-[#2e303a] rounded-lg">
                    {currentUser?.name || 'N/A'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                  />
                ) : (
                  <p className="text-gray-100 px-4 py-3 bg-[#1f2028] border border-[#2e303a] rounded-lg">
                    {currentUser?.email || 'N/A'}
                  </p>
                )}
              </div>

              {/* Badge Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Badge Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="badgeNumber"
                    value={formData.badgeNumber}
                    onChange={handleChange}
                    className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                  />
                ) : (
                  <p className="text-gray-100 px-4 py-3 bg-[#1f2028] border border-[#2e303a] rounded-lg">
                    {currentUser?.badgeNumber || 'N/A'}
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-[#1f2028] border border-[#2e303a] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                  />
                ) : (
                  <p className="text-gray-100 px-4 py-3 bg-[#1f2028] border border-[#2e303a] rounded-lg">
                    {currentUser?.department || 'N/A'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Security</h3>
            
            <div className="space-y-4">
              {/* Change Password */}
              <button
                onClick={() => alert('Change password feature coming soon!')}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#1f2028] hover:bg-[#2e303a] border border-[#2e303a] rounded-lg text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 group-hover:text-[#fbbf24] transition-colors">
                    <path d="M10 2C7.79086 2 6 3.79086 6 6V8H4C3.44772 8 3 8.44772 3 9V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V9C17 8.44772 16.5523 8 16 8H14V6C14 3.79086 12.2091 2 10 2Z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="10" cy="12.5" r="1.5" fill="currentColor"/>
                  </svg>
                  <div>
                    <p className="text-gray-100 font-medium">Change Password</p>
                    <p className="text-xs text-gray-500">Update your account password</p>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-600 group-hover:text-gray-400 transition-colors">
                  <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Two-Factor Authentication */}
              <button
                onClick={() => alert('2FA feature coming soon!')}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#1f2028] hover:bg-[#2e303a] border border-[#2e303a] rounded-lg text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 group-hover:text-[#fbbf24] transition-colors">
                    <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p className="text-gray-100 font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-600 group-hover:text-gray-400 transition-colors">
                  <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h3>
            <p className="text-sm text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

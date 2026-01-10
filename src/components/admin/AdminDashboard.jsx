import { useState } from 'react';
import { signOut } from '../../supabase/authService';
import ArticleManager from './ArticleManager';
import CategoryManager from './CategoryManager';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('articles');

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const tabs = [
    { id: 'articles', label: 'Articles', icon: '📝' },
    { id: 'categories', label: 'Categories', icon: '📁' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-saffron sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-maroon flex items-center gap-2">
                <span>🔐</span>
                <span className="truncate">Admin Dashboard</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                Welcome, {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 sm:px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-md text-sm sm:text-base whitespace-nowrap"
            >
              🚪 Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-2 border-b-2 border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-3 font-semibold text-base sm:text-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-saffron border-b-4 border-saffron -mb-0.5'
                    : 'text-gray-600 hover:text-maroon hover:bg-amber-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'articles' && <ArticleManager />}
        {activeTab === 'categories' && <CategoryManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;


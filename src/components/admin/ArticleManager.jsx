import { useState, useEffect } from 'react';
import { getAllArticles, createArticle, updateArticle, deleteArticle } from '../../supabase/articlesService';
import { getAllCategories } from '../../supabase/categoriesService';
import { isoToHindiDate, hindiDateToIso } from '../../utils/hindiDate';

const ArticleManager = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    date: '',
  });
  const [datePickerValue, setDatePickerValue] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData] = await Promise.all([
        getAllArticles(),
        getAllCategories(),
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setDatePickerValue(dateValue);
    const hindiDate = isoToHindiDate(dateValue);
    setFormData(prev => ({ ...prev, date: hindiDate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, formData);
      } else {
        await createArticle(formData);
      }
      await loadData();
      resetForm();
    } catch (err) {
      setError('Failed to save article: ' + err.message);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      date: article.date || '',
    });
    // Convert Hindi date back to ISO format for the date picker
    const isoDate = hindiDateToIso(article.date);
    setDatePickerValue(isoDate);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await deleteArticle(id);
      await loadData();
    } catch (err) {
      setError('Failed to delete article: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      date: '',
    });
    setDatePickerValue('');
    setEditingArticle(null);
    setShowForm(false);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-maroon">Article Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-gradient-to-r from-saffron to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-saffron transition-all duration-300 shadow-md text-sm sm:text-base"
        >
          {showForm ? '✕ Cancel' : '+ New Article'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-2 border-saffron/20">
          <h3 className="text-lg sm:text-xl font-bold text-maroon mb-4">
            {editingArticle ? 'Edit Article' : 'Create New Article'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="article-title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="article-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="article-category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="article-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="article-date" className="block text-sm font-medium text-gray-700 mb-2">
                Date * (will be converted to Hindi)
              </label>
              <input
                type="date"
                id="article-date"
                value={datePickerValue}
                onChange={handleDateChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
              />
              {formData.date && (
                <p className="mt-2 text-sm text-gray-600 bg-amber-50 px-3 py-2 rounded border border-amber-200">
                  📅 Hindi format: <span className="font-semibold text-maroon">{formData.date}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="article-content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="article-content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows="12"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none font-mono text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-saffron to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-saffron transition-all duration-300 shadow-md text-sm sm:text-base"
              >
                {editingArticle ? 'Update Article' : 'Create Article'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Articles List - Hidden when form is shown */}
      {!showForm && (
        <>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-[640px]">
            <thead className="bg-gradient-to-r from-maroon to-maroon/90 text-white">
              <tr>
                <th className="pl-4 pr-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Title</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Category</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Date</th>
                <th className="pl-3 pr-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No articles found. Create your first article!
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-amber-50 transition-colors">
                    <td className="pl-4 pr-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{article.id}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                      {article.title}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                      <span className="px-2 py-1 bg-saffron/10 text-saffron rounded-full text-[10px] sm:text-xs font-semibold">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                      {article.date || '-'}
                    </td>
                    <td className="pl-3 pr-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-right">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:inline-flex">
                        <button
                          onClick={() => handleEdit(article)}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-[10px] sm:text-xs font-semibold whitespace-nowrap"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-[10px] sm:text-xs font-semibold whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-saffron/10 to-orange-100 rounded-lg p-4 border-l-4 border-saffron">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Total Articles:</span> {articles.length}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleManager;


import { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../supabase/categoriesService';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    display_order: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'display_order' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      await loadCategories();
      resetForm();
    } catch (err) {
      setError('Failed to save category: ' + err.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || '',
      display_order: category.display_order || 0,
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    const confirmMessage = `⚠️ WARNING: Deleting this category will also DELETE ALL ARTICLES in this category!\n\nAre you sure you want to delete the "${id}" category and all its articles?`;
    
    if (!confirm(confirmMessage)) return;

    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError('Failed to delete category: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      display_order: 0,
    });
    setEditingCategory(null);
    setShowForm(false);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-maroon">Category Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-gradient-to-r from-saffron to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-saffron transition-all duration-300 shadow-md text-sm sm:text-base"
        >
          {showForm ? '✕ Cancel' : '+ New Category'}
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
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category ID * (name in english, without space)
                </label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  required
                  disabled={editingCategory !== null}
                  pattern="[a-z0-9_-]+"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-saffron to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-saffron transition-all duration-300 shadow-md text-sm sm:text-base"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
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

      {/* Categories Table - Hidden when form is shown */}
      {!showForm && (
        <>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gradient-to-r from-maroon to-maroon/90 text-white">
                  <tr>
                    <th className="pl-4 pr-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">ID</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Description</th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold">Display Order</th>
                    <th className="pl-3 pr-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No categories found. Create your first category!
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                  <tr key={category.id} className="hover:bg-amber-50 transition-colors">
                    <td className="pl-4 pr-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <code className="bg-gray-100 px-2 py-1 rounded text-[10px] sm:text-xs">
                        {category.id}
                      </code>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 max-w-md">
                      {category.description || '-'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 text-center">
                      <span className="px-2 py-1 bg-saffron/10 text-saffron rounded-full text-[10px] sm:text-xs font-semibold">
                        {category.display_order}
                      </span>
                    </td>
                    <td className="pl-3 pr-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-right">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:inline-flex">
                        <button
                          onClick={() => handleEdit(category)}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-[10px] sm:text-xs font-semibold whitespace-nowrap"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
              <span className="font-semibold">Total Categories:</span> {categories.length}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryManager;


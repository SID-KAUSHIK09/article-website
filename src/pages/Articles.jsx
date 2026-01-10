import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/ArticleCard';

const Articles = () => {
  const location = useLocation();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('');
  const { articles, loading: articlesLoading, error: articlesError } = useArticles(selectedCategory);

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      // Check if returning from article detail with a category in state
      const returnCategory = location.state?.category;
      if (returnCategory) {
        setSelectedCategory(returnCategory);
      } else {
        setSelectedCategory(categories[0].id);
      }
    }
  }, [categories, selectedCategory, location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-maroon mb-4">लेख</h1>
          <p className="text-xl text-gray-700">
            मेरे द्वारा रचित साहित्यिक लेखों का संग्रह
          </p>
        </div>

        {/* Category Tabs Loading */}
        {categoriesLoading && (
          <div className="text-center mb-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
            <p className="text-gray-600 mt-2">श्रेणियां लोड हो रही हैं...</p>
          </div>
        )}

        {/* Category Tabs Error */}
        {categoriesError && (
          <div className="text-center mb-12">
            <p className="text-red-600">श्रेणियां लोड करने में त्रुटि: {categoriesError}</p>
          </div>
        )}

        {/* Category Tabs */}
        {!categoriesLoading && !categoriesError && categories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-maroon to-warmBrown text-white shadow-xl'
                      : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="text-xl font-bold">{category.name}</div>
                  <div className="text-sm opacity-90">{category.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Articles Loading State */}
        {articlesLoading && selectedCategory && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
            <p className="text-xl text-gray-600 mt-4">लेख लोड हो रहे हैं...</p>
          </div>
        )}

        {/* Articles Error State */}
        {articlesError && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-xl text-red-600 mb-2">लेख लोड करने में त्रुटि</p>
            <p className="text-gray-600">{articlesError}</p>
          </div>
        )}

        {/* Articles Grid */}
        {!articlesLoading && !articlesError && articles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                category={selectedCategory}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!articlesLoading && !articlesError && selectedCategory && articles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-gray-600">
              इस श्रेणी में अभी कोई लेख उपलब्ध नहीं है।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;


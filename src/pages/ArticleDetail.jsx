import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getArticleByCategoryAndId } from '../supabase/articlesService';
import { getCategoryById } from '../supabase/categoriesService';

const ArticleDetail = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when component loads
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [articleData, categoryData] = await Promise.all([
          getArticleByCategoryAndId(category, parseInt(id)),
          getCategoryById(category)
        ]);
        setArticle(articleData);
        setCategoryName(categoryData?.name || category);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-maroon mb-4"></div>
          <p className="text-xl text-gray-700">लेख लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  // Error or article not found
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-3xl font-bold text-maroon mb-4">
            {error ? 'लेख लोड करने में त्रुटि' : 'लेख नहीं मिला'}
          </h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            onClick={() => navigate('/articles', { state: { category } })}
            className="bg-gradient-to-r from-maroon to-warmBrown text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300"
          >
            लेख सूची पर वापस जाएं
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/articles', { state: { category } })}
          className="mb-8 flex items-center gap-2 text-warmBrown hover:text-maroon font-semibold transition-colors duration-300 group"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          वापस जाएं
        </button>

        {/* Article Content */}
        <article className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Article Header */}
          <header className="mb-8 border-b-2 border-saffron pb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-maroon mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {article.date}
              </span>
              <span className="px-3 py-1 bg-saffron/20 text-warmBrown rounded-full text-sm font-medium">
                {categoryName}
              </span>
            </div>
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-800 text-lg leading-relaxed mb-6 text-justify"
              >
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;


import { useState, useEffect } from 'react';
import { getArticlesByCategory } from '../supabase/articlesService';

/**
 * Custom React Hook for fetching articles
 * Usage: const { articles, loading, error } = useArticles(category);
 */

export const useArticles = (category = null) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      // Don't fetch if no category is selected
      if (!category) {
        setArticles([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getArticlesByCategory(category);
        setArticles(data || []);
      } catch (err) {
        console.error('Error in useArticles:', err);
        setError(err.message || 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category]);

  return { articles, loading, error };
};


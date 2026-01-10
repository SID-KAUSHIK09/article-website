import { useState, useEffect } from 'react';
import { getAllCategories } from '../supabase/categoriesService';

/**
 * Custom React Hook for fetching categories
 * Usage: const { categories, loading, error } = useCategories();
 */

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Error in useCategories:', err);
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};


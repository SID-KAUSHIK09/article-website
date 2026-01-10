import { supabase } from './config';

/**
 * Articles Service
 * All database operations for articles
 */

// Get all articles
export const getAllArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }

  return data;
};

// Get articles by category
export const getArticlesByCategory = async (category) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching articles by category:', error);
    throw error;
  }

  return data;
};

// Get single article by ID
export const getArticleById = async (id) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    throw error;
  }

  return data;
};

// Get article by category and ID
export const getArticleByCategoryAndId = async (category, id) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    throw error;
  }

  return data;
};

// Create new article (for admin panel later)
export const createArticle = async (articleData) => {
  const { data, error } = await supabase
    .from('articles')
    .insert([articleData])
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    throw error;
  }

  return data;
};

// Update article (for admin panel later)
export const updateArticle = async (id, articleData) => {
  const { data, error } = await supabase
    .from('articles')
    .update(articleData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating article:', error);
    throw error;
  }

  return data;
};

// Delete article (for admin panel later)
export const deleteArticle = async (id) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    throw error;
  }

  return true;
};


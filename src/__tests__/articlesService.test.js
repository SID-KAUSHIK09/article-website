import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createQueryMock } from '../test/supabaseMock';

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock('../supabase/config', () => ({ supabase: { from } }));

import {
  getAllArticles,
  getArticlesByCategory,
  getArticleByCategoryAndId,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../supabase/articlesService';

let query;
beforeEach(() => {
  query = createQueryMock();
  from.mockReturnValue(query);
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('articlesService', () => {
  it('lists all articles ordered by id', async () => {
    query.result = { data: [{ id: 1 }, { id: 2 }], error: null };

    await expect(getAllArticles()).resolves.toEqual([{ id: 1 }, { id: 2 }]);
    expect(from).toHaveBeenCalledWith('articles');
    expect(query.calls).toContainEqual(['order', 'id', { ascending: true }]);
  });

  it('filters articles by category', async () => {
    await getArticlesByCategory('poems');
    expect(query.calls).toContainEqual(['eq', 'category', 'poems']);
  });

  it('fetches one article by category and id', async () => {
    query.result = { data: { id: 7, title: 'T' }, error: null };

    await expect(getArticleByCategoryAndId('poems', 7)).resolves.toEqual({ id: 7, title: 'T' });
    expect(query.calls).toContainEqual(['eq', 'category', 'poems']);
    expect(query.calls).toContainEqual(['eq', 'id', 7]);
    expect(query.single).toHaveBeenCalled();
  });

  it('inserts a new article and returns the saved row', async () => {
    const article = { title: 'New', content: 'Body', category: 'poems', date: '' };
    query.result = { data: { id: 3, ...article }, error: null };

    await expect(createArticle(article)).resolves.toEqual({ id: 3, ...article });
    expect(query.insert).toHaveBeenCalledWith([article]);
  });

  it('updates only the article with the given id', async () => {
    await updateArticle(3, { title: 'Edited' });
    expect(query.update).toHaveBeenCalledWith({ title: 'Edited' });
    expect(query.calls).toContainEqual(['eq', 'id', 3]);
  });

  it('deletes an article by id', async () => {
    query.result = { error: null };
    await expect(deleteArticle(3)).resolves.toBe(true);
    expect(query.delete).toHaveBeenCalled();
    expect(query.calls).toContainEqual(['eq', 'id', 3]);
  });

  it('throws the Supabase error, e.g. when row level security rejects a write', async () => {
    const rlsError = { message: 'new row violates row-level security policy', code: '42501' };
    query.result = { data: null, error: rlsError };

    await expect(updateArticle(3, { title: 'x' })).rejects.toBe(rlsError);
  });
});

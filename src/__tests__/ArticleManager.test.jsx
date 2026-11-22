import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../supabase/articlesService', () => ({
  getAllArticles: vi.fn(),
  createArticle: vi.fn(),
  updateArticle: vi.fn(),
  deleteArticle: vi.fn(),
}));
vi.mock('../supabase/categoriesService', () => ({ getAllCategories: vi.fn() }));

import {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../supabase/articlesService';
import { getAllCategories } from '../supabase/categoriesService';
import ArticleManager from '../components/admin/ArticleManager';

const existing = {
  id: 5,
  title: 'पुराना लेख',
  content: 'पुरानी सामग्री',
  category: 'poems',
  date: '5 जनवरी 2026',
};

beforeEach(() => {
  getAllArticles.mockResolvedValue([existing]);
  getAllCategories.mockResolvedValue([{ id: 'poems', name: 'कविता' }]);
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

describe('ArticleManager (admin)', () => {
  it('lists existing articles', async () => {
    render(<ArticleManager />);
    expect(await screen.findByText('पुराना लेख')).toBeInTheDocument();
  });

  it('publishes a new article with the date converted to Hindi', async () => {
    const user = userEvent.setup();
    createArticle.mockResolvedValue({ id: 6 });
    render(<ArticleManager />);
    await screen.findByText('पुराना लेख');

    await user.click(screen.getByRole('button', { name: '+ New Article' }));
    await user.type(screen.getByLabelText('Title *'), 'नया लेख');
    await user.selectOptions(screen.getByLabelText('Category *'), 'poems');
    fireEvent.change(screen.getByLabelText(/^Date \*/), { target: { value: '2026-03-01' } });
    await user.type(screen.getByLabelText('Content *'), 'नई सामग्री');
    await user.click(screen.getByRole('button', { name: 'Create Article' }));

    expect(createArticle).toHaveBeenCalledWith({
      title: 'नया लेख',
      category: 'poems',
      date: '1 मार्च 2026',
      content: 'नई सामग्री',
    });
    expect(getAllArticles).toHaveBeenCalledTimes(2);
  });

  it('fills the form when editing and saves changes to that article', async () => {
    const user = userEvent.setup();
    updateArticle.mockResolvedValue({ ...existing, title: 'बदला हुआ' });
    render(<ArticleManager />);
    await user.click(await screen.findByRole('button', { name: 'Edit' }));

    expect(screen.getByLabelText(/^Date \*/)).toHaveValue('2026-01-05');
    const title = screen.getByLabelText('Title *');
    await user.clear(title);
    await user.type(title, 'बदला हुआ');
    await user.click(screen.getByRole('button', { name: 'Update Article' }));

    expect(updateArticle).toHaveBeenCalledWith(5, expect.objectContaining({ title: 'बदला हुआ' }));
  });

  it('deletes an article after confirmation', async () => {
    const user = userEvent.setup();
    deleteArticle.mockResolvedValue(true);
    render(<ArticleManager />);
    await user.click(await screen.findByRole('button', { name: 'Delete' }));

    expect(window.confirm).toHaveBeenCalled();
    expect(deleteArticle).toHaveBeenCalledWith(5);
  });

  it('shows the error when the database refuses a change', async () => {
    const user = userEvent.setup();
    updateArticle.mockRejectedValue(new Error('new row violates row-level security policy'));
    render(<ArticleManager />);
    await user.click(await screen.findByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Update Article' }));

    expect(
      await screen.findByText('Failed to save article: new row violates row-level security policy'),
    ).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../supabase/categoriesService', () => ({ getAllCategories: vi.fn() }));
vi.mock('../supabase/articlesService', () => ({ getArticlesByCategory: vi.fn() }));

import { getAllCategories } from '../supabase/categoriesService';
import { getArticlesByCategory } from '../supabase/articlesService';
import Articles from '../pages/Articles';

const categories = [
  { id: 'poems', name: 'कविता', description: 'Poems' },
  { id: 'essays', name: 'निबंध', description: 'Essays' },
];
const articlesByCategory = {
  poems: [{ id: 1, title: 'पहली कविता', content: 'text', date: '' }],
  essays: [{ id: 2, title: 'पहला निबंध', content: 'text', date: '' }],
};

const renderPage = (state) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/articles', state }]}>
      <Articles />
    </MemoryRouter>,
  );

beforeEach(() => {
  getAllCategories.mockResolvedValue(categories);
  getArticlesByCategory.mockImplementation(async (id) => articlesByCategory[id] ?? []);
});

describe('Articles page', () => {
  it('opens the first category by default', async () => {
    renderPage();
    expect(await screen.findByText('पहली कविता')).toBeInTheDocument();
    expect(getArticlesByCategory).toHaveBeenCalledWith('poems');
  });

  it('opens the category the reader came back from', async () => {
    renderPage({ category: 'essays' });
    expect(await screen.findByText('पहला निबंध')).toBeInTheDocument();
  });

  it('switches category when a tab is clicked', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('पहली कविता');

    await user.click(screen.getByRole('button', { name: /निबंध/ }));
    expect(await screen.findByText('पहला निबंध')).toBeInTheDocument();
    expect(screen.queryByText('पहली कविता')).not.toBeInTheDocument();
  });

  it('shows an empty state for a category with no articles', async () => {
    getArticlesByCategory.mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText(/अभी कोई लेख उपलब्ध नहीं है/)).toBeInTheDocument();
  });

  it('shows an error if categories fail to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    getAllCategories.mockRejectedValue(new Error('boom'));
    renderPage();
    expect(await screen.findByText(/श्रेणियां लोड करने में त्रुटि: boom/)).toBeInTheDocument();
  });
});

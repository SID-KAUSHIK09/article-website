import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';

vi.mock('../supabase/articlesService', () => ({ getArticleByCategoryAndId: vi.fn() }));
vi.mock('../supabase/categoriesService', () => ({ getCategoryById: vi.fn() }));

import { getArticleByCategoryAndId } from '../supabase/articlesService';
import { getCategoryById } from '../supabase/categoriesService';
import ArticleDetail from '../pages/ArticleDetail';

const ListPage = () => <p>list, came from {useLocation().state?.category}</p>;

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/article/:category/:id" element={<ArticleDetail />} />
        <Route path="/articles" element={<ListPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('ArticleDetail page', () => {
  it('loads the article from the URL and splits it into paragraphs', async () => {
    getArticleByCategoryAndId.mockResolvedValue({
      id: 9,
      title: 'शीर्षक',
      content: 'पहला अनुच्छेद\n\nदूसरा अनुच्छेद',
      date: '1 मई 2026',
    });
    getCategoryById.mockResolvedValue({ id: 'poems', name: 'कविता' });

    renderAt('/article/poems/9');

    expect(await screen.findByRole('heading', { name: 'शीर्षक' })).toBeInTheDocument();
    expect(getArticleByCategoryAndId).toHaveBeenCalledWith('poems', 9);
    expect(screen.getByText('पहला अनुच्छेद')).toBeInTheDocument();
    expect(screen.getByText('दूसरा अनुच्छेद')).toBeInTheDocument();
    expect(screen.getByText('कविता')).toBeInTheDocument();
  });

  it('shows an error and a way back when the article cannot be loaded', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    getArticleByCategoryAndId.mockRejectedValue(new Error('not found'));
    getCategoryById.mockResolvedValue(null);

    renderAt('/article/poems/404');

    expect(await screen.findByText('लेख लोड करने में त्रुटि')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'लेख सूची पर वापस जाएं' }));
    expect(screen.getByText('list, came from poems')).toBeInTheDocument();
  });
});

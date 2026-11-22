import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';

const renderCard = (article) =>
  render(
    <MemoryRouter>
      <ArticleCard article={article} category="poems" />
    </MemoryRouter>,
  );

describe('ArticleCard', () => {
  it('shows the title and date and links to the article page', () => {
    renderCard({ id: 4, title: 'वसंत', content: 'कुछ पंक्तियाँ', date: '5 जनवरी 2026' });

    expect(screen.getByRole('heading', { name: 'वसंत' })).toBeInTheDocument();
    expect(screen.getByText('5 जनवरी 2026')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/article/poems/4');
  });

  it('cuts the preview to 120 characters', () => {
    renderCard({ id: 1, title: 'Long', content: 'a'.repeat(300), date: '' });
    expect(screen.getByText(`${'a'.repeat(120)}...`)).toBeInTheDocument();
  });

  it('does not crash when an article has no content yet', () => {
    renderCard({ id: 2, title: 'Draft', content: null, date: '' });
    expect(screen.getByRole('heading', { name: 'Draft' })).toBeInTheDocument();
  });
});

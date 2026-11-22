import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>,
  );

describe('Navbar', () => {
  it('links to home, articles and admin', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'होम' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'लेख' })).toHaveAttribute('href', '/articles');
    expect(screen.getByRole('link', { name: 'एडमिन' })).toHaveAttribute('href', '/admin');
  });

  it('highlights the link for the current page', () => {
    renderAt('/articles');
    expect(screen.getByRole('link', { name: 'लेख' })).toHaveClass('bg-white/30');
    expect(screen.getByRole('link', { name: 'होम' })).not.toHaveClass('bg-white/30');
  });

  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup();
    const { container } = renderAt('/');
    const mobileMenu = () => container.querySelector('div.md\\:hidden');

    expect(mobileMenu()).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Main menu' }));
    expect(within(mobileMenu()).getAllByRole('link')).toHaveLength(3);

    await user.click(within(mobileMenu()).getByRole('link', { name: 'लेख' }));
    expect(mobileMenu()).toBeNull();
  });
});

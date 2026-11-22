import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const unsubscribe = vi.fn();
vi.mock('../supabase/authService', () => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe } } })),
}));
vi.mock('../components/admin/AdminLogin', () => ({ default: () => <p>login form</p> }));
vi.mock('../components/admin/AdminDashboard', () => ({
  default: ({ user }) => <p>dashboard for {user.email}</p>,
}));

import { getSession } from '../supabase/authService';
import Admin from '../pages/Admin';

describe('Admin page', () => {
  it('shows the login form when nobody is signed in', async () => {
    getSession.mockResolvedValue(null);
    render(<Admin />);
    expect(await screen.findByText('login form')).toBeInTheDocument();
  });

  it('shows the dashboard when there is a session', async () => {
    getSession.mockResolvedValue({ user: { email: 'admin@example.com' } });
    render(<Admin />);
    expect(await screen.findByText('dashboard for admin@example.com')).toBeInTheDocument();
  });

  it('falls back to the login form if the session check fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    getSession.mockRejectedValue(new Error('network down'));
    render(<Admin />);
    expect(await screen.findByText('login form')).toBeInTheDocument();
  });

  it('unsubscribes from auth changes when it unmounts', async () => {
    getSession.mockResolvedValue(null);
    const { unmount } = render(<Admin />);
    await screen.findByText('login form');
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});

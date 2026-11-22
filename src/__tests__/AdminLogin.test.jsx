import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../supabase/authService', () => ({ signIn: vi.fn() }));
import { signIn } from '../supabase/authService';
import AdminLogin from '../components/admin/AdminLogin';

const fillAndSubmit = async (user) => {
  await user.type(screen.getByLabelText('Email Address'), 'admin@example.com');
  await user.type(screen.getByLabelText('Password'), 'secret');
  await user.click(screen.getByRole('button', { name: 'Sign In' }));
};

describe('AdminLogin', () => {
  it('signs in with the entered credentials and reports success', async () => {
    const user = userEvent.setup();
    const onLoginSuccess = vi.fn();
    signIn.mockResolvedValue({ user: { id: 'u1' } });

    render(<AdminLogin onLoginSuccess={onLoginSuccess} />);
    await fillAndSubmit(user);

    expect(signIn).toHaveBeenCalledWith('admin@example.com', 'secret');
    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
  });

  it('shows the error message when sign in fails', async () => {
    const user = userEvent.setup();
    const onLoginSuccess = vi.fn();
    signIn.mockRejectedValue(new Error('Invalid login credentials'));

    render(<AdminLogin onLoginSuccess={onLoginSuccess} />);
    await fillAndSubmit(user);

    expect(await screen.findByText('Invalid login credentials')).toBeInTheDocument();
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

  it('disables the button while signing in', async () => {
    const user = userEvent.setup();
    let finish;
    signIn.mockReturnValue(new Promise((resolve) => { finish = resolve; }));

    render(<AdminLogin onLoginSuccess={vi.fn()} />);
    await fillAndSubmit(user);

    expect(screen.getByRole('button', { name: /Signing in/ })).toBeDisabled();
    finish({});
    expect(await screen.findByRole('button', { name: 'Sign In' })).toBeEnabled();
  });
});

import { renderHook, act } from '@testing-library/react';
import { useLogin } from './useFetchLogin';
import * as fetchLogin from '../utils/fetchLogin';

jest.mock('../utils/fetchLogin');

describe('useLogin hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initial state', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('successful login', async () => {
    (fetchLogin.loginUser as jest.Mock).mockResolvedValue({ user: { role: 'user' } });
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin('amenda@gmail.com', 'amenda@job');
    });

    expect(fetchLogin.loginUser).toHaveBeenCalledWith('amenda@gmail.com', 'amenda@job');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('role mismatch error', async () => {
    (fetchLogin.loginUser as jest.Mock).mockResolvedValue({ user: { role: 'user' } });
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin('amenda@gmail.com', 'amenda@job', 'institutional');
    });

    expect(result.current.error).toBe('This account does not have access to this role.');
  });

  it('login failure', async () => {
    (fetchLogin.loginUser as jest.Mock).mockRejectedValue(new Error('Login failed'));
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin('amenda@gmail.com', 'amenda@job');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Login failed');
  });
});

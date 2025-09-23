import { renderHook, act } from '@testing-library/react';
import { useSignup } from './useFetchSignup';
import * as fetchSignup from '../utils/fetchSignup';
import { useRouter } from 'next/navigation';

jest.mock('../utils/fetchSignup');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams('')),
}));

describe('useSignup hook', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      replace: jest.fn(),
      prefetch: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    });
  });

  it('initial state', () => {
    const { result } = renderHook(() => useSignup());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('successful signup and navigate', async () => {
    (fetchSignup.signupUser as jest.Mock).mockResolvedValue({ id: '123' });
    const { result } = renderHook(() => useSignup());

    await act(async () => {
      await result.current.handleSignup({
        name: 'Amenda',
        companyName: 'Ampersand',
        companyEmail: 'amenda@gmail.com',
        phone: '0754637213',
        password: 'amenda@job',
      });
    });

    expect(fetchSignup.signupUser).toHaveBeenCalledWith(
      'Amenda',
      'Ampersand',
      'amenda@gmail.com',
      '0754637213',
      'amenda@job',
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error on signup failure response', async () => {
    (fetchSignup.signupUser as jest.Mock).mockResolvedValue({ detail: 'Error' });
    const { result } = renderHook(() => useSignup());

    await act(async () => {
      await result.current.handleSignup({
        name: 'Aman',
        companyName: 'Flexi',
        companyEmail: 'aman@gmail.com',
        phone: '0976543245',
        password: 'aman123',
      });
    });

    expect(result.current.error).toBe('Error');
    expect(result.current.loading).toBe(false);
  });

  it('sets error on thrown error', async () => {
    (fetchSignup.signupUser as jest.Mock).mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() => useSignup());

    await act(async () => {
      await result.current.handleSignup({
        name: 'mane',
        companyName: 'maneeral',
        companyEmail: 'manel@gmail.com',
        phone: '000999999',
        password: 'fail',
      });
    });

    expect(result.current.error).toBe('Network Error');
    expect(result.current.loading).toBe(false);
  });
});

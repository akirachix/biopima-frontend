import { renderHook, act } from '@testing-library/react';
import { useLogin } from './useFetchLogin';
import { loginUser } from '../utils/fetchLogin';


jest.mock('../utils/fetchLogin', () => ({
  loginUser: jest.fn(),
}));

describe('useLogin', () => {
  beforeEach(() => {

    (loginUser as jest.Mock).mockClear();
  });

  test('initial state should be correct', () => {
    const { result } = renderHook(() => useLogin());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should set loading to true during login', async () => {

    (loginUser as jest.Mock).mockResolvedValue({});
    
    const { result } = renderHook(() => useLogin());
    
    act(() => {
      result.current.handleLogin('test@example.com', 'password');
    });
    

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test('should return result on successful login', async () => {
    const mockResult = {
      user_id: '123',
      token: 'token123',
      email: 'test@example.com',
      role: 'user'
    };
    
    (loginUser as jest.Mock).mockResolvedValue(mockResult);
    
    const { result } = renderHook(() => useLogin());
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.handleLogin('test@example.com', 'password');
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(loginResult).toEqual(mockResult);
  });

  test('should return result when role matches expected role', async () => {
    const mockResult = {
      user_id: '123',
      token: 'token123',
      email: 'test@example.com',
      role: 'admin'
    };
    
    (loginUser as jest.Mock).mockResolvedValue(mockResult);
    
    const { result } = renderHook(() => useLogin());
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.handleLogin('test@example.com', 'password', 'admin');
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(loginResult).toEqual(mockResult);
  });

  test('should set error and return null when role does not match expected role', async () => {
    const mockResult = {
      user_id: '123',
      token: 'token123',
      email: 'test@example.com',
      role: 'user'
    };
    
    (loginUser as jest.Mock).mockResolvedValue(mockResult);
    
    const { result } = renderHook(() => useLogin());
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.handleLogin('test@example.com', 'password', 'admin');
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("This account does not have access to this role.");
    expect(loginResult).toBeNull();
  });

  test('should set error and return null when loginUser throws error', async () => {
    const errorMessage = 'Invalid credentials';
    
    (loginUser as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useLogin());
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.handleLogin('test@example.com', 'password');
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(loginResult).toBeNull();
  });

  test('should call loginUser with correct parameters', async () => {
    (loginUser as jest.Mock).mockResolvedValue({});
    
    const { result } = renderHook(() => useLogin());
    
    const email = 'test@example.com';
    const password = 'password123';
    
    await act(async () => {
      await result.current.handleLogin(email, password);
    });
    
    expect(loginUser).toHaveBeenCalledWith(email, password);
  });
});
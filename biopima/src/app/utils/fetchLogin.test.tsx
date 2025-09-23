import { loginUser } from './fetchLogin';

describe('loginUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns data when response is ok', async () => {
    const mockData = { user: { email: 'amenda@gmail.com', role: 'user' } };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await loginUser('amenda@gmail.com', 'amenda@job');
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/login', expect.any(Object));
  });

  it('throws error when response is not ok', async () => {
    const errorMessage = 'Invalid email or password';

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });

    await expect(loginUser('aman@gmail.com', 'aman@job')).rejects.toThrow(errorMessage);
    expect(fetch).toHaveBeenCalledWith('/api/login', expect.any(Object));
  });

});

import { signupUser } from './fetchSignup';

global.fetch = jest.fn();

describe('signupUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successfully signs up a user', async () => {
    const mockResponse = {
      success: true,
      message: 'User created successfully',
      user_id: '123'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await signupUser(
      'John Doe',
      'Acme Inc',
      'john@acme.com',
      '1234567890',
      'password123'
    );

    expect(fetch).toHaveBeenCalledWith('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        username: 'Acme Inc',
        email: 'john@acme.com',
        phone_number: '1234567890',
        password: 'password123',
      }),
    });

    expect(result).toEqual(mockResponse);
  });

  test('handles API error response', async () => {
    const errorMessage = 'Email already exists';
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: errorMessage,
    });

    await expect(signupUser(
      'John Doe',
      'Acme Inc',
      'john@acme.com',
      '1234567890',
      'password123'
    )).rejects.toThrow(`Failed to fetch: Login failed: ${errorMessage}`);
  });

  test('handles network error', async () => {
    const errorMessage = 'Network connection failed';
    
    (fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(signupUser(
      'John Doe',
      'Acme Inc',
      'john@acme.com',
      '1234567890',
      'password123'
    )).rejects.toThrow(`Failed to fetch: ${errorMessage}`);
  });

  test('sends correct request body', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await signupUser(
      'Jane Smith',
      'Tech Corp',
      'jane@tech.com',
      '9876543210',
      'securePass'
    );
    const requestBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);

    expect(requestBody).toEqual({
      name: 'Jane Smith',
      username: 'Tech Corp',
      email: 'jane@tech.com',
      phone_number: '9876543210',
      password: 'securePass',
    });
  });
});
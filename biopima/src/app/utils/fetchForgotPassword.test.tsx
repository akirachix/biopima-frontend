import forgotPasswordApi from "./fetchForgotPassword";

describe('forgotPasswordApi', () => {
  const mockSuccessResponse = { success: true, message: 'OTP sent successfully' };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls fetch with correct parameters and returns data on success', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockSuccessResponse)),
      } as Response),
    ) as jest.Mock;

    const response = await forgotPasswordApi('test@example.com');

    expect(global.fetch).toHaveBeenCalledWith('api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    expect(response).toEqual(mockSuccessResponse);
  });

  it('throws error on invalid JSON response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('invalid-json'),
      } as Response),
    ) as jest.Mock;

    await expect(forgotPasswordApi('test@example.com')).rejects.toThrow(
      'Invalid JSON response from server: invalid-json',
    );
  });

  it('throws error with detail message when response is not ok', async () => {
    const errorResponse = { detail: 'Failed to send OTP' };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
      } as Response),
    ) as jest.Mock;

    await expect(forgotPasswordApi('test@example.com')).rejects.toThrow('Failed to send OTP');
  });

  it('throws generic error if no detail in failed response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('{}'),
      } as Response),
    ) as jest.Mock;

    await expect(forgotPasswordApi('test@example.com')).rejects.toThrow('Failed to send OTP');
  });
});

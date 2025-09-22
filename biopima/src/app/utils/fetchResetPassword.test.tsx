import resetPasswordApi from "./fetchResetPassword";

describe('resetPasswordApi', () => {
  const mockResponseData = { success: true, message: 'Password reset successful' };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls fetch with correct parameters and returns data on success', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponseData)),
      } as Response),
    ) as jest.Mock;

    const response = await resetPasswordApi({
      email: 'test@example.com',
      password: 'password123',
      confirm_password: 'password123',
      otp: '1234',
    });

    expect(global.fetch).toHaveBeenCalledWith('api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        confirm_password: 'password123',
        otp: '1234',
      }),
    });

    expect(response).toEqual(mockResponseData);
  });

  it('throws an error if response JSON is invalid', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('invalid-json'),
      } as Response),
    ) as jest.Mock;

    await expect(
      resetPasswordApi({
        email: 'test@example.com',
        password: 'password123',
        confirm_password: 'password123',
        otp: '1234',
      }),
    ).rejects.toThrow('Invalid JSON: invalid-json');
  });

  it('throws an error if response is not ok', async () => {
    const errorResponse = { detail: 'Reset failed' };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
      } as Response),
    ) as jest.Mock;

    await expect(
      resetPasswordApi({
        email: 'test@example.com',
        password: 'password123',
        confirm_password: 'password123',
        otp: '1234',
      }),
    ).rejects.toThrow('Reset failed');
  });

  it('throws generic error if response is not ok and no detail present', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('{}'),
      } as Response),
    ) as jest.Mock;

    await expect(
      resetPasswordApi({
        email: 'test@example.com',
        password: 'password123',
        confirm_password: 'password123',
        otp: '1234',
      }),
    ).rejects.toThrow('Failed to reset password');
  });
});

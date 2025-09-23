import { verifyCodeApi } from "./fetchVerifyCode";

describe('verifyCodeApi', () => {
  const mockSuccessResponse = { success: true, message: 'OTP verified successfully' };

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

    const response = await verifyCodeApi('test@example.com', '1234');

    expect(global.fetch).toHaveBeenCalledWith('api/verify-code/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', otp: '1234' }),
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

    await expect(verifyCodeApi('test@example.com', '1234')).rejects.toThrow(
      'Invalid JSON response from server: invalid-json',
    );
  });

});

import { signupUser } from './fetchSignup';

describe('signupUser', () => {
 beforeEach(() => {
   jest.resetAllMocks();
 });

 it('returns data when response is ok', async () => {
   const mockResponseData = { id: '123', name: 'Amenda' };

   global.fetch = jest.fn(() =>
     Promise.resolve({
       ok: true,
       statusText: 'OK',
       json: () => Promise.resolve(mockResponseData),
     } as Response)
   );

   const result = await signupUser('Amenda', 'Ampersand', 'amenda@gmail.com', '0754637213', 'amenda@job');

   expect(result).toEqual(mockResponseData);
   expect(fetch).toHaveBeenCalledWith('/api/signup', expect.any(Object));
 });

 it('throws error when response is not ok', async () => {
   global.fetch = jest.fn(() =>
     Promise.resolve({
       ok: false,
       statusText: 'Bad Request',
       json: () => Promise.resolve({}),
     } as Response)
   );

   await expect(signupUser('Aman', 'Flexi', 'aman@gmail.com', '0976543245', 'aman123')).rejects.toThrow('Signup failed: Bad Request');
   expect(fetch).toHaveBeenCalledWith('/api/signup', expect.any(Object));
 });

 it('throws error when fetch rejects', async () => {
   const errorMessage = 'Network failure';
   global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));

   await expect(signupUser('mane', 'maneeral', 'manel', '000999999', 'fail')).rejects.toThrow('Failed to fetch: ' + errorMessage);
   expect(fetch).toHaveBeenCalledWith('/api/signup', expect.any(Object));
 });
});




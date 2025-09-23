import { fetchSensor } from '../utils/fetchSensorReadings';

global.fetch = jest.fn();

describe('fetchSensor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and returns sensor data successfully', async () => {
    const mockData = { temperature: 25 };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchSensor();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/readings/');
  });

  it('throws error if response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });

    await expect(fetchSensor()).rejects.toThrow('Something went wrongInternal Server Error');
  });

  it('throws error if fetch rejects', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

    await expect(fetchSensor()).rejects.toThrow('Failed to fetch sensor readingsNetwork failure');
  });
});

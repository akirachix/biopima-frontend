import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useFetchSensorReadings from './useFetchSensorReadings';
import { SensorReading } from '../utils/types/sensor';


jest.mock('../utils/fetchSensorReadings', () => ({
  fetchSensor: jest.fn(),
}));

import { fetchSensor } from '../utils/fetchSensorReadings';

describe('useFetchSensorReadings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles sensor readings with some empty fields', async () => {
    const partialReadings: SensorReading[] = [
      {
        sensor_readings_id: 1,
        device_id: '',
        temperature_level: '',
        methane_level: '100',
        pressure_level: '1.1',
        gas_consumption: '',
        created_at: '2025-09-22T11:00:00Z',
        updated_at: '2025-09-22T11:00:00Z',
      },
    ];

    (fetchSensor as jest.Mock).mockResolvedValueOnce(partialReadings);

    const { result } = renderHook(() => useFetchSensorReadings());

    expect(result.current.sensorReadings).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sensorReadings).toEqual(partialReadings);
  });

  it('handles sensor readings with all data fields', async () => {
    const fullReadings: SensorReading[] = [
      {
        sensor_readings_id: 2,
        device_id: 'device-123',
        temperature_level: '23.5',
        methane_level: '120',
        pressure_level: '1.2',
        gas_consumption: '50',
        created_at: '2025-09-22T12:00:00Z',
        updated_at: '2025-09-22T12:00:00Z',
      },
    ];

    (fetchSensor as jest.Mock).mockResolvedValueOnce(fullReadings);

    const { result } = renderHook(() => useFetchSensorReadings());

    expect(result.current.sensorReadings).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sensorReadings).toEqual(fullReadings);
  });

  it('handles empty sensor readings array', async () => {
    (fetchSensor as jest.Mock).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useFetchSensorReadings());

    expect(result.current.loading).toBe(true);
    expect(result.current.sensorReadings).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sensorReadings).toEqual([]);
  });

  it('handles fetching errors ', async () => {
    
    (fetchSensor as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    const { result } = renderHook(() => useFetchSensorReadings());

    expect(result.current.loading).toBe(true);
    expect(result.current.sensorReadings).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.sensorReadings).toEqual([]);
  });

});


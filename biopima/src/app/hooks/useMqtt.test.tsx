



import { renderHook } from '@testing-library/react';
import type { Mock } from 'jest-mock';
import useLiveSensorReadings from './useFetchSensorReadings';
import { useMqtt } from './useMqtt';


jest.mock('./useMqtt');


describe('useLiveSensorReadings', () => {
 const mockLatestReading = {
   methane_level: '1.2',
   temperature_level: '36',
   pressure_level: '12',
   created_at: new Date().toISOString(),
 };


 beforeEach(() => {
   jest.clearAllMocks();
 });


 it('returns initial state correctly', () => {
   (useMqtt as Mock).mockReturnValue({
     latestReading: null,
     mqttError: null,
     isConnected: false,
   });


   const { result } = renderHook(() => useLiveSensorReadings());
   expect(result.current.sensorReadings).toEqual([]);
   expect(result.current.latestReading).toBeNull();
   expect(result.current.isConnected).toBe(false);
   expect(result.current.error).toBeNull();
 });


 it('updates sensor readings and clears error on new latestReading', () => {
   (useMqtt as Mock).mockReturnValue({
     latestReading: mockLatestReading,
     mqttError: null,
     isConnected: true,
   });


   const { result, rerender } = renderHook(() => useLiveSensorReadings());


   expect(result.current.sensorReadings).toHaveLength(1);
   expect(result.current.sensorReadings[0]).toEqual(mockLatestReading);
   expect(result.current.latestReading).toEqual(mockLatestReading);
   expect(result.current.isConnected).toBe(true);
   expect(result.current.error).toBeNull();


   const newReading = {
     ...mockLatestReading,
     methane_level: '1.8',
     created_at: new Date(Date.now() + 1000).toISOString(),
   };
   (useMqtt as Mock).mockReturnValue({
     latestReading: newReading,
     mqttError: null,
     isConnected: true,
   });


   rerender();


   expect(result.current.sensorReadings).toHaveLength(2);
   expect(result.current.sensorReadings[0]).toEqual(newReading);
 });


 it('sets error when mqttError changes and clears error when mqttError is null', () => {
   const errorMessage = 'Connection failed';


   const { result, rerender } = renderHook(() => useLiveSensorReadings());


   (useMqtt as Mock).mockReturnValue({
     latestReading: null,
     mqttError: errorMessage,
     isConnected: false,
   });
   rerender();
   expect(result.current.error).toBe(errorMessage);


   (useMqtt as Mock).mockReturnValue({
     latestReading: null,
     mqttError: null,
     isConnected: false,
   });
   rerender();
   expect(result.current.error).toBeNull();
 });


 it('limits sensorReadings history to MAX_HISTORY', () => {
   const MAX_HISTORY = 50;
   const readings = Array(MAX_HISTORY + 10).fill(null).map((_, i) => ({
     methane_level: `${i}`,
     temperature_level: '36',
     pressure_level: '12',
     created_at: new Date(Date.now() + i * 1000).toISOString(),
   }));


   let index = 0;
   (useMqtt as Mock).mockImplementation(() => ({
     latestReading: readings[index],
     mqttError: null,
     isConnected: true,
   }));


   const { result, rerender } = renderHook(() => useLiveSensorReadings());


   for (index = 1; index < readings.length; index++) {
     (useMqtt as Mock).mockReturnValue({
       latestReading: readings[index],
       mqttError: null,
       isConnected: true,
     });
     rerender();
   }


   expect(result.current.sensorReadings.length).toBe(MAX_HISTORY);
   expect(result.current.sensorReadings[0]).toEqual(readings[readings.length - 1]);
   expect(result.current.sensorReadings[MAX_HISTORY - 1]).toEqual(readings[readings.length - MAX_HISTORY]);
 });
});







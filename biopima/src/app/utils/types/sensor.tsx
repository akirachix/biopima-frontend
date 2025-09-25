export interface SensorReading {
    sensor_readings_id: number;
    device_id: string;
    temperature_level: string;
    methane_level: string;
    pressure_level: string;
    gas_consumption: string;
    created_at: string;
    updated_at: string;
}
export interface PaginationScreen{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
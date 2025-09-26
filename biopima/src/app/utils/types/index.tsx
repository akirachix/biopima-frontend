export interface McuType {
  mcu_id: number;
  description: string;
  status: string;
  installed_at: string;
  updated_at: string;
  user: number;
}

export interface SensorReadingType {
  sensor_readings_id: number;
  device_id: string;
  temperature_level: string;
  methane_level: string;
  pressure_level: string;
  gas_consumption: string;
  created_at: string;
  updated_at: string;
}

export interface UserType {
  id: number;
  username: string;
  name: string;
  image: string;
  email: string;
  phone_number: string;
  user_type: string;
  password: string;
}


export interface ClientWithStatus extends UserType {
  status: string;
}

export type NewUserType = Omit<UserType, "id" | "image"> ;

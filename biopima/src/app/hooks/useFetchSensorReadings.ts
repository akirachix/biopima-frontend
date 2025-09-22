import { fetchSensor } from "../utils/fetchSensorReadings";
import { useEffect, useState } from "react";
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

const useFetchSensorReadings = () =>{
    const [sensorReadings, setSensorReadings] = useState<Array<SensorReading>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)
    useEffect(() =>{
        (async() =>{
            try{
                const sensorReadings = await fetchSensor();
                setSensorReadings(sensorReadings);
            }catch(error){
                setError((error as Error).message);
            }finally{
                setLoading(false);
            }
        })()
    },[]);
    return {sensorReadings, loading, error}
};

export default useFetchSensorReadings 

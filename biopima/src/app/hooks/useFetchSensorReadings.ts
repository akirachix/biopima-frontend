import { fetchSensor } from "../utils/fetchSensorReadings";
import { useEffect, useState } from "react";
import { SensorReading } from "../utils/types/sensor";

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

export default useFetchSensorReadings; 

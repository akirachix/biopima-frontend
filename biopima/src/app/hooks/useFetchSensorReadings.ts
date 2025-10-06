
import { useEffect, useState } from "react";
import { SensorReading } from "../utils/types/sensor";
import { useMqtt } from "./useMqtt";


const MAX_HISTORY = 50;


const useLiveSensorReadings = () => {
 const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
 const [error, setError] = useState<string | null>(null);


 const { latestReading, mqttError, isConnected } = useMqtt();

 useEffect(() => {
   if (mqttError) {
     setError(mqttError);
   } else {
     setError(null);
   }
 }, [mqttError]);


 useEffect(() => {
   if (latestReading) {
     setSensorReadings((prev) => [latestReading, ...prev.slice(0, MAX_HISTORY - 1)]);
     setError(null);
   }
 }, [latestReading]);


  const latest = sensorReadings.length > 0 ? sensorReadings[0] : null;


 return {
   sensorReadings,   
   latestReading: latest,
   isConnected,
   error,
 };
};


export default useLiveSensorReadings;





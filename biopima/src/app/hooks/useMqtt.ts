import { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { SensorReading } from "../utils/types/sensor";


export const useMqtt = () => {
 const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
 const [mqttError, setMqttError] = useState<string | null>(null);
 const [isConnected, setIsConnected] = useState(false);


 useEffect(() => {
   const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL;
   const username = process.env.NEXT_PUBLIC_MQTT_USERNAME;
   const password = process.env.NEXT_PUBLIC_MQTT_PASSWORD;
   const apiUrl = process.env.NEXT_PUBLIC_MQTT_API_URL;
   const topic = process.env.NEXT_PUBLIC_MQTT_TOPIC || "esp32/sensors";


   if (!brokerUrl || !username || !password || !apiUrl) {
     setMqttError("Configuration error: missing .env variables");
     return;
   }


   let client: MqttClient | null = null;
   let isSubscribed = false;


   setMqttError(null);
   setIsConnected(false);


   client = mqtt.connect(brokerUrl, {
     username,
     password,
     reconnectPeriod: 3000,
     connectTimeout: 10000,
   });


   client.on("connect", () => {
     setIsConnected(true);
     if (!isSubscribed && client) {
       client.subscribe(topic, (error) => {
         if (error) {
           setMqttError("Failed to subscribe to topic: " + error.message);
         } else {
           isSubscribed = true;
         }
       });
     }
   });


   client.on("message", (receivedTopic, message) => {
     if (receivedTopic !== topic) return;


     try {
       const payload = JSON.parse(message.toString());


       const toDecimalString = (value: unknown): string => {
         if (typeof value === 'number' && !isNaN(value)) {
           return value.toFixed(2);
         }
         return "0.00";
       };


       const newReading: SensorReading = {
         sensor_readings_id: Date.now(),
         device_id: (payload.device_id as string) ?? "unknown",
         temperature_level: toDecimalString(payload.temperature_level),
         methane_level: toDecimalString(payload.methane_level),
         pressure_level: toDecimalString(payload.pressure_level),
         gas_consumption: toDecimalString(payload.gas_consumption),
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
       };


       setLatestReading(newReading);


       fetch(apiUrl, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(newReading),
       }).catch(() => {


       });
     } catch {
       setMqttError("Invalid message format received");
     }
   });


   client.on("error", (error) => {
     setMqttError("Live connection failed: " + (error.message || "Unknown error"));
   });


   client.on("close", () => {
     setIsConnected(false);
     if (client && !client.reconnecting) {
       setMqttError("Connection lost");
     }
   });


   client.on("reconnect", () => {
     setMqttError("Reconnecting...");
   });


   return () => {
     if (client) {
       isSubscribed = false;
       client.end(true, () => {
       });
     }
   };
 }, []);


 return { latestReading, mqttError, isConnected };
};





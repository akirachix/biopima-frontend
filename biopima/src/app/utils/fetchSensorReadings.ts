const baseUrl = "/api/sensor-readings/"

export async function fetchSensor() {
   try {
       const response= await fetch(baseUrl);
       
       if (!response.ok) {
           throw new Error("Something went wrong" + response.statusText);
   }
   const result= await response.json();
       return result;
}catch (error) {
       throw new Error('Failed to fetch sensor readings' + (error as Error).message)
   }}


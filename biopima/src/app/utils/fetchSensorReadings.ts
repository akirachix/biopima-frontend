const baseUrl = process.env.BASE_URL || 'https://biopima-cfbfed4a262a.herokuapp.com';
console.log({baseUrl});
export async function fetchSensor() {
   try {
       const response= await fetch(`${baseUrl}/api/sensor-readings`);
       console.log({response});
      
       if (!response.ok) {
           throw new Error("Something went wrong" + response.statusText);
   }
   const result= await response.json();
       return result;
}catch (error) {
       throw new Error('Failed to fetch sensor readings' + (error as Error).message)
   }}


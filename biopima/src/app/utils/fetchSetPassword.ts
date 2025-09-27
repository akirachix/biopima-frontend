const baseUrl = "/api/set-password";


export async function setPassword(email:string,password:string) {
 try {
   const response = await fetch(baseUrl, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({email,password}),
   });
   if (!response.ok) {
     throw new Error("Setting password failed: " + response.statusText);
   }
   const result = await response.json();
   return result;
 } catch (error) {
   throw new Error("Failed to set password: " + (error as Error).message);
 }
}

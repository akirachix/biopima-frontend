"use client";
import { useState } from "react";
import { setPassword } from "../utils/fetchSetPassword";

const useSetPassword = () => {
 const [loading, setLoading] = useState<boolean>(false);
 const [error, setError] = useState<string | null>(null);
 const SetPassword = async (email:string,password:string) => {
  
   setLoading(true);
   setError(null);
   try {
     const result = await setPassword(email,password);
     if (!result) {
       throw new Error("Setting password failed");
     }
     return result;
   } catch (error) {
     setError((error as Error).message);
     return null;
   } finally {
     setLoading(false);
   }
 };
 return { SetPassword, loading, error };
};
export default useSetPassword;










'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signupUser } from '../utils/fetchSignup';

export function useSignup() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (formData: {
    name: string;
    companyName: string;
    companyEmail: string;
    phone: string;
    password: string;
    
  }) => {
    setError(null);
    setLoading(true);

    try {
      const response = await signupUser(
        formData.name,
        formData.companyName,
        formData.companyEmail,
        formData.phone,
        formData.password,
    
      );

      if (response && response.id) {
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        setError(response.detail || "Signup failed");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { handleSignup, loading, error };
}



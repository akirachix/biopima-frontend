"use client";
import { useState } from 'react';
import { loginUser } from '../utils/fetchLogin';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(email: string, password: string, expectedRole?: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser(email, password);

      if (expectedRole && result.user_type !== expectedRole) {
        setError("This account does not have access to this role.");
        return null;
      }

      return result;

    } catch (error) {
      setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading, error };
}

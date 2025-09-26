
import { useState } from "react";
import { verifyCodeApi } from "../utils/fetchVerifyCode";

export const useVerifyCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const verify = async (email: string, code: string) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
     
      await verifyCodeApi(email, code);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading, error, success };
};

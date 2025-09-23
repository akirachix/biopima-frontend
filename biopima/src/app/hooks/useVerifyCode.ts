"use client";

import { useState } from "react";
import { verifyCodeApi } from "../utils/fetchVerifyCode";

export function useVerifyCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const verify = async (email: string, code: string) => {
    setError("");
    setLoading(true);
    try {
      const res = await verifyCodeApi(email, code);
      setSuccess(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading, error, success };
}


import { useState } from "react";
import resetPasswordApi from "../utils/fetchResetPassword";

export default function useResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleResetPassword({
    email,
    password,
    otp,
  }: {
    email: string;
    password: string;
    otp: string;
  }) {
    try {
      const data = await resetPasswordApi({
        email,
        password,
        confirm_password: password,
        otp,
      });
      setMessage(data.message || "Password reset successful");
      setError("");
    } catch {
      setError("Error resetting password");
      setMessage("");
    }
  }

  return {
    password, setPassword, confirmPassword, setConfirmPassword, error, message, handleResetPassword,
  };
}
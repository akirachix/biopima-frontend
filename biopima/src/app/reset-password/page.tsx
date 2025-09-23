"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useResetPassword from "../hooks/useResetPassword";
import { FiEye, FiEyeOff } from "react-icons/fi";

function ResetPasswordPage() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    message,
    handleResetPassword,
  } = useResetPassword();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  let email: string = "";
  if (typeof window !== "undefined" && localStorage.getItem("email")) {
    email = localStorage.getItem("email")!;
  }

  let otp: string = "";
  if (typeof window !== "undefined" && localStorage.getItem("otp")) {
    otp = localStorage.getItem("otp")!;
  }

  const isSuccess = message && message.toLowerCase().includes("successful");

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password !== value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setIsSubmitting(true);
    await handleResetPassword({ email, password, otp });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/greenbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-[#09770993] rounded-2xl px-8 py-12 w-[1000px] h-[700px] flex flex-col items-center">
        {isSuccess ? (
          <>
            <h2 className="text-white mb-6 font-semibold mt-[200px]  text-3xl text-center">
              Password Reset Successful!
            </h2>
            <p className="text-white mb-4 text-base text-center">
              Your password has been reset successfully.
            </p>
            <button
              className="w-full max-w-xs py-3 bg-lime-400 text-white font-medium text-lg rounded-lg transition-colors duration-200 hover:bg-lime-500 cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <h2 className="text-white mb-6 font-semibold text-4xl mt-[100px] text-center">
              Reset Password
            </h2>
            <p className="text-white mb-4 text-base text-center">
              Do you want to reset your password?
            </p>
            <form
              className="w-full flex flex-col items-center"
              onSubmit={onSubmit}
              aria-label="Reset password form"
            >
              <div className="relative w-[550px] mt-10">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="New Password"
                  required
                  className="w-full px-4 py-3 rounded-lg border-none text-base outline-none bg-white text-black mb-2"
                />
                <button
                  type="button"
                  className="absolute right-4 top-[23px] transform -translate-y-1/2 text-[#0b4906] z-10 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEye size={22} /> : <FiEyeOff size={22} />}
                </button>
                {passwordError && (
                  <p className="text-red-500 mt-2">{passwordError}</p>
                )}
              </div>

              <div className="relative w-[550px] mt-4">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className="w-full px-4 py-3 rounded-lg border-none text-base outline-none bg-white text-black mb-6"
                />
                <button
                  type="button"
                  className="absolute right-4 top-[23px] transform -translate-y-1/2 text-[#0b4906] z-10 cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <FiEye size={22} />
                  ) : (
                    <FiEyeOff size={22} />
                  )}
                </button>
                {confirmPasswordError && (
                  <p className="text-red-500 mt-2">{confirmPasswordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full max-w-xs py-3 mt-10 bg-green-400 hover:bg-green-700 text-white font-medium text-lg rounded-lg transition-colors duration-200 disabled:opacity-60 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Reset Password"}
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              {message && <p className="text-white mt-4">{message}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;

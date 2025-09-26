"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useVerifyCode } from "../hooks/useVerifyCode";

const CODE_LENGTH = 4;
const TIMER_DURATION = 180;

function VerifyCodePage() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(TIMER_DURATION);
  const router = useRouter();
  const isRedirecting = useRef(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(CODE_LENGTH).fill(null)
  );

  const { verify, loading, error, success } = useVerifyCode();

 
  useEffect(() => {
    if (timer <= 0 || success) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, success]);

  
  useEffect(() => {
    const emailFromStorage = localStorage.getItem("email");
    if (emailFromStorage) {
      setEmail(emailFromStorage);
    }
  }, []); 

 
  useEffect(() => {
    if (success && !isRedirecting.current) {
      isRedirecting.current = true;
      localStorage.setItem("email", email);
      localStorage.setItem("otp", code.join(""));
      router.push(`/reset-password`);
    }
  }, [success, email, code, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length !== CODE_LENGTH) {
      alert("Please enter the full code.");
      return;
    }
    if (timer <= 0) {
      alert("Time has expired. Please request a new code.");
      return;
    }
    if (loading) return;

    try {
      await verify(email, otp);
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/greenbg.png"
          alt="background img"
          fill
          className="object-cover"
          sizes="130vw"
        />
      </div>
      <div className="bg-[#0450048a] rounded-lg shadow-xl p-8 w-[1000px] h-[650px] z-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white text-center mb-6 mt-[40px]">
          Verify Code
        </h1>
        <p className="text-white text-center mb-4">
          Code has been sent to your email. Please check.
        </p>
        <div className="mb-4 text-white text-center w-full">
          <span className="font-medium">Email:</span> {email || "Loading..."}
        </div>

        <div className="mb-4 text-white text-center text-lg font-semibold">
          Time remaining: {formatTime(timer)}
        </div>
        {timer <= 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 w-[400px] text-center">
            <p>Time expired. Please request a new code.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 w-[300px] text-center">
            <p>Invalid Code!</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-[300px] text-center">
            <p>Verification successful! Redirecting...</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <label className="mb-2 text-white text-base text-center w-full">
            Enter your code
          </label>
          <div className="flex gap-4 mb-4 mt-3 justify-center">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`code-input-${idx}`}
                type="text"
                inputMode="text"
                maxLength={1}
                className="w-14 h-14 rounded-md border-2 border-white bg-white text-black text-2xl text-center outline-none focus:border-lime-400 transition-colors"
                value={digit}
                onChange={(e) => handleInputChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                required
                disabled={timer <= 0}
                autoComplete="one-time-code"
                spellCheck={false}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || !email || timer <= 0}
            className="w-[550px] py-3 mb-7 mt-7 bg-green-400 hover:bg-green-700 text-white font-medium text-lg rounded-lg transition-colors duration-200 disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>
          <button
            type="button"
            className="w-[550px] py-3 bg-white hover:bg-gray-100 text-black font-medium text-lg rounded-lg transition-colors duration-200 cursor-pointer"
            onClick={() => router.push("/forgotpassword")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyCodePage;
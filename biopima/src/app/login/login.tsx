"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLogin } from "../hooks/useFetchLogin";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin, loading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleLogin(email, password, role ?? undefined);

    if (result) {
      if (typeof window !== "undefined") {
        const userId = String(result.user_id || result.id);
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", result.token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role || "");
      }

      if (role?.toLowerCase() === "institutional operator") {
        router.push("/dashboard");
      } else {
        router.push("/institution");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <label className="block text-green-900 text-[20px] font-semibold mb-1">
          Company Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-500 rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700"
          required
        />
      </div>

      <div className="relative">
        <label className="block text-green-900 text-[20px] font-semibold mb-1">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-500 rounded-2xl p-3 pr-12 focus:outline-none focus:ring-1 focus:ring-green-700"
          required
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 pt-7 text-[#2A4759] z-10 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEye size={22} /> : <FiEyeOff size={22} />}
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm font-medium mt-1">{error}</p>
      )}

      <div className="text-right">
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="text-1xl font-semibold text-green-900 hover:underline cursor-pointer"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-green-900 text-white rounded-2xl p-3 text-2xl font-semibold hover:bg-green-800 cursor-pointer transition-colors ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {role?.toLowerCase() !== "institutional operator" && (
        <p className="text-center text-1xl text-green-800 mt-8">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-green-900 font-bold hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      )}
    </form>
  );
}

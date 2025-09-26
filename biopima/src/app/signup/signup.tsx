
"use client";

import { use } from 'react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSignup } from "../hooks/useFetchSignup";

export default function SignupForm({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const router = useRouter();
  const params = use(searchParams);

  const role = params.role ? params.role.toLowerCase() : undefined;
  void(role);

  const { handleSignup, loading } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    companyEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      if (onlyDigits.length <= 15) {
        setForm((prev) => ({ ...prev, [name]: onlyDigits }));
        setError("");
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (value.length < 8) {
        setError("Password must be at least 8 characters");
      } else if (form.confirmPassword && form.confirmPassword !== value) {
        setError("Passwords do not match!");
      } else {
        setError("");
      }
    }

    if (name === "confirmPassword") {
      if (value !== form.password) {
        setError("Passwords do not match!");
      } else if (form.password.length < 8) {
        setError("Password must be at least 8 characters");
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSignup(form);
      router.push("/dashboard");
    } catch {
   
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <Image
        src="/images/bio-texture.png"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />

      <div className="flex bg-white rounded-xl shadow-lg overflow-hidden w-[1600px] h-[800px]">
        <div className="relative w-220 flex items-center justify-center">
          <Image
            src="/images/side-shape.png"
            alt="Branding"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute text-center text-white px-8">
            <h1 className="text-6xl md:text-6xl font-extrabold text-[#054511] leading-tight mb-18">
              Sign Up
            </h1>
            <p className="text-5xl md:text-7xl font-extrabold tracking-wide">
              BioPima
            </p>
          </div>
        </div>

        <div className="w-1/2 p-10 mt-[-17] bg-white">
          <form onSubmit={handleSubmit} className="space-y-4 pt-5 pr-10">
            <div>
              <label className="block text-green-900 text-[20px] font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-500 rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700"
                required
              />
            </div>

            <div>
              <label className="block text-green-900 text-[20px] font-semibold mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
                className="w-full border border-gray-500 rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700"
                required
              />
            </div>

            <div>
              <label className="block text-green-900 text-[20px] font-semibold mb-1">
                Company Email
              </label>
              <input
                type="email"
                name="companyEmail"
                placeholder="Email Address"
                value={form.companyEmail}
                onChange={handleChange}
                className="w-full border border-gray-500 rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700"
                required
              />
            </div>

            <div>
              <label className="block text-green-900 text-[20px] font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-500 rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-green-900 text-[20px] font-semibold mb-1">
                Create Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-500 rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 pt-7 text-[#2A4759] cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEye size={22} /> : <FiEyeOff size={22} />}
              </button>
            </div>

            <div className="relative">
              <label className="block text-green-900 text-[20px] font-semibold mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-500 rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 pt-7 text-[#2A4759] cursor-pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <FiEye size={22} /> : <FiEyeOff size={22} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900 text-white rounded-2xl mt-5 p-3 text-2xl cursor-pointer"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-1xl text-green-800 mt-3">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-green-900 font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
          {formError && (
            <p className="text-red-600 mt-4 text-center">{formError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
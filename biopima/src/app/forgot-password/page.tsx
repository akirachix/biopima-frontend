"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useForgotPassword from "../hooks/useForgotPassword";
import Image from "next/image";

function ForgetPasswordPage() {
  const { sendResetEmail, loading, error, success } = useForgotPassword();
  const [email, setEmail] = useState("");
  const router = useRouter();


   useEffect(() => {
    if (success) {
      router.push("/verify-code");
    }
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    localStorage.setItem("email", email);

    await sendResetEmail(email);
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
      <div className="bg-[rgba(38,87,10,0.5)] rounded-lg shadow-xl p-8 w-[1000px] h-[700px] z-10">
        <h1 className="text-4xl font-bold text-white text-center mb-10 mt-[150px]">
          Forgot Password
        </h1>
        <p className="text-white text-center mb-6">
          Enter your email to reset password
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-[300px] mb-4 ml-[300px]">
            <p>{error}</p>
            <p className="text-sm mt-2">
              Please check your email address and try again.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-[40px]">
            <label
              htmlFor="email"
              className="block text-[20px] text-white mb-1 ml-[200px]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ml-[200px] px-4 py-2 rounded-lg focus:outline-none w-[550px] focus:ring-2 focus:ring-green-500 bg-white h-[55px]"
              placeholder="your@email.com"
              required
            />
          </div>
          <button
            type="submit"
            className="ml-[200px] w-[550px] font-bold py-3 px-4 rounded-lg bg-green-400 hover:bg-green-700 text-2xl text-white transition duration-300 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPasswordPage;
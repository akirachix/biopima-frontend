"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RolePage() {
  const router = useRouter();

  const handleSelect = (role: string) => {

    router.push(`/login?role=${encodeURIComponent(role)}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8">
        <Image
          src="/images/green-logo.svg"
          alt="BioPima Logo"
          width={110}
          height={110}
          className="mb-4 ml-8"
        />
        <h1 className="text-5xl font-bold text-green-900 leading-tight">BioPima</h1>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        Welcome to BioPima
      </h2>

      <p className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center mb-12 px-4">
        The intelligent platform for monitoring and managing your bio-digester plants.
        <br />
        Please select your role to continue.
      </p>

      <div className="flex flex-row sm:flex-row gap-6">
        <button
          onClick={() => handleSelect("Institutional operator")}
          className="border-2 border-[#9EAF1B] bg-transparent text-[#9EAF1B] text-xl md:text-2xl font-bold py-3 px-8 rounded-2xl hover:bg-[#9EAF1B] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg min-w-[140px] cursor-pointer"
        >
          Institution
        </button>

        <button
          onClick={() => handleSelect("Consultant")}
          className="border-2 border-[#9EAF1B] bg-transparent text-[#9EAF1B] text-xl md:text-2xl font-bold py-3 px-8 rounded-2xl hover:bg-[#9EAF1B] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg min-w-[140px] cursor-pointer"
        >
          Consultant
        </button>
      </div>
    </div>
  );
}

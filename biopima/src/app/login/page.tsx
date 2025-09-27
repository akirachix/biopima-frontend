'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import SignInForm from './login';


export default function SignInPage() {
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
            <h1 className="text-6xl md:text-6xl font-extrabold text-[#054511] leading-tight mb-15">Sign In</h1>
            <p className="text-5xl md:text-7xl font-extrabold tracking-wide">BioPima</p>
          </div>
        </div>


        <div className="w-1/2 p-20 pt-50 bg-white">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}






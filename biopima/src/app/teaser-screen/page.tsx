"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    image: "/images/teaser1.png",
  },
  {
    id: 2,
    image: "/images/teaser2.png",
  },
  {
    id: 3,
    image: "/images/teaser4.png",
  },
];

export default function BioPimaTeaser() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (currentIndex < slides.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  function onSlide(index: number) {
    setCurrentIndex(index);
  }

  function handleButtonClick() {
    router.push("/chooserole");
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Image
        src={slides[currentIndex].image}
        alt={`slide-${currentIndex + 1}`}
        fill
        className="object-cover"
        priority
      />
      
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px- space-y-8">
          {currentIndex === 0 && (
            <>
              <Image
                src="/images/logo.png"
                alt="Bio Pima Logo"
                width={470}
                height={220}
                className="object-contain mr-20"
              />
              <span className="text-[#9EAF1B] font-bold text-[75px] pl-5 pb-20 leading-none drop-shadow-md">
                BioPima
              </span>
            </>
          )}

          {currentIndex === 1 && (
            <>
              <span className="absolute top-12 left-12 text-white font-bold text-2xl drop-shadow-sm">
                Welcome
              </span>
              <span className="text-[#9EAF1B] font-bold text-[150px] leading-none drop-shadow-md">
                BioPima
              </span>
              <p className="text-white text-4xl">
                Smart IOT Monitoring for Biogas Digesters
              </p>
            </>
          )}

          {currentIndex === 2 && (
            <>
              <Image
                src="/images/logo.png"
                alt="BioPima Logo"
                width={340}
                height={180}
                className="object-contain mr-20 mt-[-130]"
              />
              <p className="text-white text-[22px] max-w-xl">
                Monitoring gas pressure, detect leaks, track usage patterns, and receive real-time alerts with BioPima's advanced IOT technology.
              </p>
              <button
                onClick={handleButtonClick}
                className="bg-gray-100 text-[#9EAF1B] text-2xl mt-10 font-semibold py-4 px-15 rounded-3xl hover:bg-green-200 transition-colors shadow-lg cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}

        </div>

        <div className="absolute bottom-12 left-0 right-0 flex justify-center space-x-10">
          {
            slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => onSlide(i)}
                className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${currentIndex === i ? "bg-[#9EAF1B] scale-125" : "bg-gray-400"
                  }`}
              />
            ))}
        </div>
    </div>
  );
}


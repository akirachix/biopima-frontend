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

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8 lg:px-16 space-y-4 md:space-y-6 lg:space-y-8">
        {currentIndex === 0 && (
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Bio Pima Logo"
              width={500}  
              height={250}
              className="object-contain sm:w-[500px] sm:h-[250px] md:w-[550px] md:h-[275px] lg:w-[600px] lg:h-[300px]"
            />
            <span className="text-[#9EAF1B] font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[80px] leading-none drop-shadow-md mt-4 md:mt-6 lg:mt-8">
              BioPima
            </span>
          </div>
        )}

        {currentIndex === 1 && (
          <div className="w-full max-w-6xl mx-auto">
            <div className="absolute top-6 md:top-8 lg:top-12 left-6 md:left-8 lg:left-12">
              <span className="text-white font-bold text-xl md:text-2xl lg:text-3xl drop-shadow-sm">
                Welcome
              </span>
            </div>
            <div className="flex flex-col items-center justify-center mt-16 md:mt-20 lg:mt-24">
              <span className="text-[#9EAF1B] font-bold text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[150px] leading-none drop-shadow-md">
                BioPima
              </span>
              <p className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-4 md:mt-6 lg:mt-8 max-w-3xl">
                Smart IOT Monitoring for Biogas Digesters
              </p>
            </div>
          </div>
        )}

        {currentIndex === 2 && (
          <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
            <Image
              src="/images/logo.png"
              alt="Bio Pima Logo"
              width={250}
              height={130}
              className="object-contain md:w-[300px] md:h-[160px] lg:w-[340px] lg:h-[180px] mb-4 md:mb-6 lg:mb-8"
            />
            <p className="text-white text-base md:text-lg lg:text-xl xl:text-2xl max-w-2xl md:max-w-3xl text-center">
              Monitoring gas pressure, detect leaks, track usage patterns, and receive real-time alerts with BioPima&apos;s advanced IOT technology.
            </p>
            <button
              onClick={handleButtonClick}
              className="bg-gray-100 text-[#9EAF1B] text-lg md:text-xl lg:text-2xl font-semibold py-3 md:py-4 lg:py-5 px-8 md:px-12 lg:px-16 rounded-full hover:bg-green-200 transition-colors shadow-lg cursor-pointer mt-6 md:mt-8 lg:mt-10"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 md:bottom-8 lg:bottom-12 left-0 right-0 flex justify-center space-x-4 md:space-x-6 lg:space-x-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => onSlide(i)}
            className={`h-3 w-3 md:h-4 md:w-4 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === i 
                ? "bg-[#9EAF1B] scale-125 md:scale-150" 
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

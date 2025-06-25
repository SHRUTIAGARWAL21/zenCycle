"use client";
import { LuChevronsDown } from "react-icons/lu";

export default function Home() {
  return (
    <main>
      <div className="bg-purple-200 overflow-hidden pt-12 pb-12">
        <div
          className="relative min-h-[600px] bg-cover bg-center flex flex-col items-center text-[#764787] text-center mx-12 sm:mx-8 md:mx-12 max-w-10xl px-4 pt-56 pb-16"
          style={{ backgroundImage: "url('/landingPage.png')" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif drop-shadow-lg leading-tight">
            ZenCycle
          </h1>
          <h5 className="text-md font-serif sm:text-md md:text-xl mt-4 max-w-lg drop-shadow-md px-4">
            From task to thought — Zencycle keeps it all in sync.
          </h5>
          <button className="mt-8 font-serif bg-[#f9f4fb] text-[#5e3a6b] font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-[#f3e8f7] transition">
            Start Tracking
          </button>

          {/* Scroll Down Icon */}
          <div className="absolute bottom-6 flex items-center gap-2 animate-bounce text-[#764787]">
            <LuChevronsDown className="text-2xl" />
            <span className="text-base font-medium">Scroll down</span>
          </div>
        </div>
      </div>
    </main>
  );
}

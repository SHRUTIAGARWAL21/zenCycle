"use client";
import { LuChevronsDown } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useRef } from "react";

function Feature({ icon, label, isMobile = false }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md px-3 md:px-4 py-2 text-center min-h-[120px] flex flex-col justify-center ${
        isMobile ? "items-center" : ""
      }`}
    >
      <img
        src={icon}
        alt={label}
        className={`${
          isMobile ? "w-40 h-16" : "w-[60%]"
        } mx-auto mb-2 object-contain rounded-xl`}
      />
      <p className="text-xs text-gray-700">{label}</p>
    </div>
  );
}

function FeatureShowcase() {
  return (
    <div className="min-h-[450px] pt-4 px-4">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="max-w-8xl mx-64 md:mx-4  px-4 sm:px-6 md:px-28 lg:px-44  xl:px-64">
          <div className="grid grid-cols-6 gap-6 items-center">
            {/* Left Column - 2 grid units */}
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <Feature icon="/images/clockcute.png" label="Time Flow" />
                <Feature icon="/images/graph.avif" label="Mood Graphs" />
                <Feature icon="/images/notify.webp" label="Reminders" />
                <Feature icon="/images/tick.png" label="Goal Check" />
              </div>
            </div>

            {/* Center Phone Preview with same width as 2-column section */}
            <div className="col-span-2  flex justify-center">
              <div className="w-[220px] flex justify-center">
                <img
                  src="/images/mobileScreen.png"
                  alt="App screen"
                  className="w-full max-w-[220px] h-full drop-shadow-2xl rounded-2xl"
                />
              </div>
            </div>

            {/* Right Column - 2 grid units */}
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <Feature icon="/images/todo.png" label="To-Do Lists" />
                <Feature icon="/images/start.webp" label="Start Tracker" />
                <Feature icon="/images/journel.png" label="Daily Journal" />
                <Feature icon="/images/chat.png" label="Chat" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="grid grid-cols-3 gap-3 justify-items-center max-w-md mx-auto">
          <Feature icon="/images/clockcute.png" label="Time Flow" isMobile />
          <Feature icon="/images/graph.avif" label="Mood Graphs" isMobile />
          <Feature icon="/images/notify.webp" label="Reminders" isMobile />
          <Feature icon="/images/tick.png" label="Goal Check" isMobile />
          <Feature icon="/images/calander.png" label="App Screen" isMobile />
          <Feature icon="/images/todo.png" label="To-Do Lists" isMobile />
          <Feature icon="/images/start.webp" label="Start Tracker" isMobile />
          <Feature icon="/images/journel.png" label="Daily Journal" isMobile />
          <Feature icon="/images/chat.png" label="Chat" isMobile />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  const handleScroll = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  function handleButtonClick() {
    router.push("/signup");
  }
  return (
    <main>
      <div className="bg-purple-200 overflow-hidden pt-12 pb-12">
        <div
          className="relative min-h-[600px] bg-cover bg-center flex flex-col items-center text-[#764787] text-center mx-12 sm:mx-8 md:mx-12 max-w-10xl px-4 pt-56 pb-16"
          style={{ backgroundImage: "url('/images/landingPage.png')" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif drop-shadow-lg leading-tight">
            ZenCycle
          </h1>
          <h5 className="text-md font-serif sm:text-md md:text-xl mt-4 max-w-lg drop-shadow-md px-4">
            From task to thought — Zencycle keeps it all in sync.
          </h5>
          <button
            className="mt-8 font-serif bg-[#f9f4fb] text-[#5e3a6b] font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-[#f3e8f7] transition"
            onClick={handleButtonClick}
          >
            Start Tracking
          </button>

          {/* Scroll Down Icon */}
          <div
            className="absolute bottom-6 flex items-center gap-2 animate-bounce text-[#764787]"
            onClick={handleScroll}
          >
            <LuChevronsDown className="text-2xl" />
            <span className="text-base font-medium">Scroll down</span>
          </div>
        </div>
      </div>

      <div className="relative bg-white min-h-[700px] overflow-hidden ">
        {/* Background Curve */}
        <div className="absolute inset-0">
          <svg
            className="absolute w-full h-full opacity-20"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1000 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,300 C250,100 750,500 1000,300"
              stroke="#ffb6c1"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Central Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 pt-[30vh]">
          <h2 className="text-[3vh] sm:text-3xl md:text-5xl font-bold text-[#bc6fc3] mb-4 leading-tight">
            When Mood Meets <br className="hidden sm:block" /> Motivation
          </h2>
          <p className="text-gray-500 text-[4vw] sm:text-lg  max-w-md sm:max-w-xl mx-auto">
            Zencycle helps you track your mood and manage your time—so your day
            works with your mind, not against it.
          </p>
        </div>

        {/* Images with responsive positions and sizes */}
        <img
          src="/images/yellowface.svg"
          alt="yellowface"
          className="absolute top-[10vh] left-[8vw] w-[20vw] sm:w-[15vw] md:w-[10vw]"
        />
        <img
          src="/images/clock.png"
          alt="clock"
          className="absolute top-[6vh] right-[10vw] w-[10vw] sm:w-[8vw] md:w-[7vw]"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/256/7590/7590241.png"
          alt="todo"
          className="absolute top-[55vh] left-[30vw] w-[12vw] sm:w-[8vw] md:w-[10vw]"
        />
        <img
          src="https://png.pngtree.com/png-clipart/20230806/original/pngtree-aesthetic-laptop-vector-png-image_9442501.png"
          alt="laptop"
          className="absolute bottom-[18vh]  right-[6vw]  w-[20vw] sm:w-[15vw] md:w-[10vw]"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/256/8022/8022590.png"
          alt="note"
          className="absolute top-[20vh] left-[60vw] w-[6vw] sm:w-[5vw] md:w-[4vw]"
        />
      </div>

      <div className="bg-gradient-to-b from-[#cfb5cc] to-white min-h-[500px] pt-24 px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          What’s waiting for you on{" "}
          <span className="text-[#bc6fc3]">Zencycle?</span>
        </h2>
        <p className="text-gray-100 max-w-xl mx-auto text-base sm:text-lg mb-24">
          A thoughtfully designed space where your emotions and productivity
          work in sync—so every day feels just a little more balanced.
        </p>

        <FeatureShowcase />
      </div>

      <div className="bg-[#1a1a1a] text-gray-300 py-10 px-6 sm:px-12 lg:px-20 ">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h2 className="text-white text-2xl font-bold mb-4">Zencycle</h2>
            <p className="text-gray-400">Mood + Task Tracker</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">App</h3>
            <p className="mb-1 hover:underline cursor-pointer">Features</p>
            <p className="mb-1 hover:underline cursor-pointer">Download</p>
            <p className="mb-1 hover:underline cursor-pointer">Premium</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">Support</h3>
            <p className="mb-1 hover:underline cursor-pointer">Help Center</p>
            <p className="mb-1 hover:underline cursor-pointer">Feedback</p>
            <p className="mb-1 hover:underline cursor-pointer">Bug Report</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">Company</h3>
            <p className="mb-1 hover:underline cursor-pointer">Blog</p>
            <p className="mb-1 hover:underline cursor-pointer">Careers</p>
            <p className="mb-1 hover:underline cursor-pointer">About</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-4 text-xs text-gray-500 text-center">
          &copy; 2025 Zencycle. All rights reserved. Terms · Privacy · Cookies
        </div>
      </div>
    </main>
  );
}

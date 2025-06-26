"use client";
import { LuChevronsDown } from "react-icons/lu";

function Feature({ icon, label, isMobile = false }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md px-3 md:px-4 py-2 text-center ${
        isMobile ? "flex flex-col items-center" : ""
      }`}
    >
      <img
        src={icon}
        alt={label}
        className={`$${
          isMobile ? "w-16 h-16" : "w-[60%]"
        } mx-auto mb-2 object-contain rounded-xl`}
      />
      <p className="text-sm text-gray-700">{label}</p>
    </div>
  );
}

function FeatureShowcase() {
  return (
    <div className="min-h-screen py-12 px-4">
      {/* Desktop/Tablet Layout (hidden on mobile) */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-3 max-w-7xl mx-auto items-center">
          {/* Left Column */}
          <div className="grid grid-cols-2 gap-4 scale-[0.9] -translate-y-2">
            <Feature icon="/images/clockcute.jpg" label="Time Flow" />
            <Feature icon="/images/graph.avif" label="Mood Graphs" />
            <Feature icon="/images/notify.webp" label="Reminders" />
            <Feature icon="/images/tick.png" label="Goal Check" />
          </div>

          {/* Center Mobile */}
          <div className="mx-4">
            <img
              src="/images/mobileScreen.png"
              alt="App screen"
              className="w-[180px] sm:w-[180px] md:w-[220px] drop-shadow-2xl rounded-2xl"
            />
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-2 gap-4 scale-[0.9] -translate-y-2">
            <Feature icon="/images/todo.png" label="To-Do Lists" />
            <Feature icon="/images/start.webp" label="Start Tracker" />
            <Feature icon="/images/journel.jpg" label="Daily Journal" />
            <Feature icon="/images/chat.webp" label="Chat" />
          </div>
        </div>
      </div>

      {/* Mobile View — 3 column stacked grid */}
      <div className="sm:hidden">
        {/* Mobile phone display */}
        <div className="flex justify-center mb-8">
          <div className="w-[200px] h-[400px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] flex flex-col items-center justify-center text-white relative overflow-hidden">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>

              {/* Schedule content */}
              <div className="text-center mt-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <div className="w-8 h-8 border-2 border-white rounded-lg flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">Schedule</h3>
                <p className="text-sm opacity-90">your order</p>
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-3 gap-3 justify-items-center max-w-md mx-auto">
          <Feature
            icon="/images/clockcute.jpg"
            label="Time Flow"
            isMobile={true}
          />
          <Feature
            icon="/images/graph.avif"
            label="Mood Graphs"
            isMobile={true}
          />
          <Feature
            icon="/images/notify.webp"
            label="Reminders"
            isMobile={true}
          />
          <Feature icon="/images/tick.png" label="Goal Check" isMobile={true} />
          <Feature
            icon="/images/mobileScreen.png"
            label="App Screen"
            isMobile={true}
          />
          <Feature
            icon="/images/todo.png"
            label="To-Do Lists"
            isMobile={true}
          />
          <Feature
            icon="/images/start.webp"
            label="Start Tracker"
            isMobile={true}
          />
          <Feature
            icon="/images/journel.jpg"
            label="Daily Journal"
            isMobile={true}
          />
          <Feature icon="/images/chat.webp" label="Chat" isMobile={true} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
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

      <div className="bg-gradient-to-b from-[#cfb5cc] to-white pt-24 pb-20 px-4 text-center">
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
    </main>
  );
}

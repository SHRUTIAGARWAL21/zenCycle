"use client";

export default function Navbar() {
  return (
    <nav className="bg-pastel-peach text-gray-800 px-6 py-4 shadow-md flex gap-6 items-center">
      <a
        href="#"
        className="text-md font-semibold hover:text-pastel-purple transition duration-200"
      >
        Home
      </a>
      <a
        href="#"
        className="text-md font-semibold hover:text-pastel-purple transition duration-200"
      >
        Moods
      </a>
      <a
        href="#"
        className="text-md font-semibold hover:text-pastel-purple transition duration-200"
      >
        Profile
      </a>
    </nav>
  );
}

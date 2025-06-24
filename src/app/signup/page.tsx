"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("Signup failed : ", error.message);
    } finally {
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Signup</h1>
      <hr className="mb-4 border-gray-600" />

      <label htmlFor="username" className="block mb-1">
        Username
      </label>
      <input
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="Enter your username"
        className="w-full px-3 py-2 mb-4 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="email" className="block mb-1">
        Email
      </label>
      <input
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Enter your email"
        className="w-full px-3 py-2 mb-4 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="password" className="block mb-1">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Enter your password"
        className="w-full px-3 py-2 mb-4 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={onSignup}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 py-2 rounded-md font-semibold mb-4"
      >
        {buttonDisabled ? "No signup" : "signup"}
      </button>

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:underline">
          Visit login page
        </Link>
      </p>
    </div>
  );
}

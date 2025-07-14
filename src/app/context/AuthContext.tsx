"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  username: string;
  streak: number;
  totalActiveDays: number;
};

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  refetchUser: () => void;
  logout: () => void;
}>({
  user: null,
  isLoading: true,
  refetchUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = () => {
    setIsLoading(true);

    fetch("/api/users/getUser", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();

          // ✅ Handle token expiration
          if (
            error.error === "TokenExpired" ||
            error.error === "Unauthorized"
          ) {
            console.log("Session expired. Logging out...");
            logout();
            setUser(null);
            return null;
          }

          // Other error
          console.error("Auth error:", error);
          setUser(null);
          return null;
        }

        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .catch((err) => {
        console.error("Unexpected fetch error:", err);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  };

  const logout = async () => {
    await fetch("/api/users/logout", {
      method: "GET",
      credentials: "include",
    });
    setUser(null); // logout from context
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, refetchUser: fetchUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

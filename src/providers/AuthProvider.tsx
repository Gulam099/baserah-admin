"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { UserType } from "@/features/user/types/user.type";
import { verifyOtp } from "@/features/auth/utils/otp.util";
import { useRouter } from "next/navigation";
interface AuthContextValue {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string, otp: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();
  const isAuthenticated = !!user;
  async function login(phoneNumber: string, otp: string) {
    const data = await verifyOtp(phoneNumber, otp);
    setUser(data.data);
    document.cookie = `token=${encodeURIComponent(
      JSON.stringify(data.data)
    )}; path=/; max-age=604800`; // Store in cookies (7 days)
    router.push("/dashboard/approval");
  }
  function logout() {
    setUser(null);
    document.cookie = "token=; path=/; max-age=0"; // Remove cookie
    router.push("/login");
  }
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const storedUser = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        if (!storedUser) {
          logout();
          return;
        }
        const userData = JSON.parse(decodeURIComponent(storedUser));
        if (userData) {
          setUser(userData); // Set user if verification is successful
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        logout();
      }
    };
    verifyUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

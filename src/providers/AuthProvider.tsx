"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useSession } from "./SessionProvider";
import { UserType } from "@/features/user/types/user.type";

interface AuthContextValue {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (userData: UserType) => void;
  logout: () => void;
  checkSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const { createToken, setSessionToken, verifyToken } = useSession();

  // If user is not null, we consider the user authenticated
  const isAuthenticated = !!user;

  /**
   * login:
   * 1) setUser
   * 2) createToken with user._id & user.role
   */
  function login(userData: UserType) {
    setUser(userData);
    createToken(userData._id, userData.role);
  }

  /**
   * logout:
   * 1) setUser to null
   * 2) setSessionToken(null)
   */
  function logout() {
    setUser(null);
    setSessionToken(null);
  }

  /**
   * checkSession:
   * - calls verifyToken
   * - if token valid => setUser from token?
   *   (In a real scenario, you'd fetch user details from server or store them in localStorage.)
   */
  async function checkSession() {
    const tokenData = await verifyToken();
    console.log(tokenData);

    if (tokenData) {
      // If valid, we might set the user from token data
      setUser({
        _id: tokenData.userId,
        role: tokenData.role,
        name: "Placeholder",
        mobile_number: "908409348094",
        email: "szds@dfdd.ff",
      });
    } else {
      // Invalid or expired token => logout
      logout();
    }
  }

  // On first mount, check if there's a valid session
  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, checkSession }}
    >
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

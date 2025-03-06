"use client";

import { getCookie, removeCookie, setCookie } from "@/actions/cookie";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/**
 * The shape of the parsed token data you need for verifying.
 */
interface TokenData {
  userId: string;
  role: string;
  iat: number; // issued at (epoch seconds)
  exp: number; // expires at (epoch seconds)
}

interface SessionContextValue {
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
  createToken: (userId: string, role: string) => string;
  verifyToken: () => Promise<TokenData | null>;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // On mount, see if there's a token in cookies
  useEffect(() => {
    const cookieToken = getCookie("token");
    if (cookieToken) {
      console.log(cookieToken);
      setSessionToken(cookieToken);
    }
  }, []);

  /**
   * Create a token for userId/role, set expiry to 7 days from now.
   * Store it in a cookie named "token" and in sessionToken state.
   */
  function createToken(userId: string, role: string): string {
    const now = Math.floor(Date.now() / 1000); // current epoch in seconds
    const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
    const payload: TokenData = {
      userId,
      role,
      iat: now,
      exp: now + expiresIn,
    };

    // For demo, we'll just base64-encode the JSON.
    // In production, you'd typically handle a real JWT or server-signed token.
    const token = btoa(JSON.stringify(payload));

    // Save to cookie
    setCookie("token", token, 7);
    setSessionToken(token);
    return token;
  }

  /**
   * Verify token is valid (not expired, can be parsed).
   * Returns the parsed payload if valid, or null if invalid.
   */
  async function verifyToken(): Promise<TokenData | null> {
    if (!sessionToken) return null;
    try {
      const raw = atob(sessionToken); // decode from base64
      const data = JSON.parse(raw) as TokenData;

      const now = Math.floor(Date.now() / 1000);
      if (data.exp < now) {
        // token expired
        return null;
      }
      return data;
    } catch (err) {
      return null;
    }
  }

  return (
    <SessionContext.Provider
      value={{
        sessionToken,
        setSessionToken: (token: string | null) => {
          if (token) {
            setCookie("token", token, 7);
          } else {
            removeCookie("token");
          }
          setSessionToken(token);
        },
        createToken,
        verifyToken,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

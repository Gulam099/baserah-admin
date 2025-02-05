"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAppDispatch, useAppSelector } from "@/store/store";

import React from "react";

export default function page() {
  const authState = useAppSelector((state) => state.auth.authState);
  const dispatch = useAppDispatch();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      {/* You are now {authState ? "Logged  In" : "Logged Out"}
      <button onClick={() => dispatch(setAuthState(true))}>Log in</button>
      <button onClick={() => dispatch(setAuthState(false))}>Log out</button> */}
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { authClient } from "../lib/auth-client";

export default function AutoLogin() {
  useEffect(() => {
    authClient.signIn.email({
      email: "test@gmail.com",
      password: "test1234",
    });
  }, []);
  return null;
}

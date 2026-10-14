"use server";

import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";
import { headers } from "next/headers";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session.user;
}

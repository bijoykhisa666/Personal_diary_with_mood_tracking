'use server'

import { cookies } from "next/headers";

// Server actions for NextAuth integration

export async function doSocialLogin(formData: FormData) {
  // Get the provider from the formData
  const provider = formData.get('action') as string;
  if (!provider) throw new Error("No provider specified");

  // Return the NextAuth sign-in URL
  // Client should redirect to this URL
  return `/api/auth/signin/${provider}`;
}

export async function doLogout() {
  // Optional: clear custom cookies if you use them
  const cookieStore = cookies();
  cookieStore.set("authToken", "", { maxAge: 0 });
  cookieStore.set("username", "", { maxAge: 0 });

  // Return the NextAuth sign-out URL for client redirect
  return `/api/auth/signout?callbackUrl=/login`;
}

export async function doCredentialLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) throw new Error("Email or password missing");

  // Call NextAuth credentials callback endpoint directly
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Login failed");
  }

  // Return user data and token (from your backend if configured in auth.ts)
  return data;
}

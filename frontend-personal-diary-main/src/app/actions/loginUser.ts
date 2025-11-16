'use server'

import { cookies } from 'next/headers'

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetch("https://personal-diary-ok2z.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Login failed." };
    }

    // ✅ Store token in secure cookie
    cookies().set("token", data.token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Store id in secure cookie
    cookies().set("id", data.user.id, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // ❌ DO NOT use redirect here if calling from client
    return { success: true };
  } catch (error) {
    return { success: false, message: "Server error. Please try again later." };
  }
}

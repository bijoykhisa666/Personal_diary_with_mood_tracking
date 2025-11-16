"use server";

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email");


  try {
    const res = await fetch("https://personal-diary-ok2z.onrender.com/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to send reset link" };
    }

    return { success: true, message: "Password reset link sent to your email" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

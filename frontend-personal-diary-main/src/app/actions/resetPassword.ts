"use server";

export async function resetPassword(formData: FormData, token: string) {
  const password = formData.get("password");

  try {
    const res = await fetch("https://personal-diary-ok2z.onrender.com/api/auth/reset-password/${token}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Password reset failed" };
    }

    return { success: true, message: "Password reset successful" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

'use server'

export async function signUpUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;


  try {
    const res = await fetch("https://personal-diary-ok2z.onrender.com/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });


    const data = await res.json();


    if (!res.ok) {
      return { success: false, message: data.message || "Signup failed." };
    }




    // ✅ return success, let client handle redirect
    return { success: true, message: data.message || "Signup successful." };
  } catch (error) {
    return { success: false, message: "Server error. Please try again later." };
  }
}

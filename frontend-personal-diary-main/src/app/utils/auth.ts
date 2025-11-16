import { cookies } from "next/headers";

export function getAuthCookies(cookieStore = cookies()) {
  const token = cookieStore.get("token")?.value || "";
  const id = cookieStore.get("id")?.value || "";
  return { token, id };
}

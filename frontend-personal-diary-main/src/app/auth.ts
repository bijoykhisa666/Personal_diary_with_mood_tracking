/** @format */

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authConfig: NextAuthConfig = {
  debug: true,
  trustHost: true,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const response = await fetch(
            "https://personal-diary-ok2z.onrender.com/api/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!response.ok) {
            const text = await response.text();
            console.error("Login failed:", text);
            return null;
          }

          const data = await response.json();

          return { ...data.user, backendToken: data.token };
        } catch (err) {
          console.error("Error in authorize:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // ------------------------------------
    // JWT CALLBACK
    // ------------------------------------
    async jwt({ token, user, account }) {
      const cookieStore = cookies();
    
      // CREDENTIALS LOGIN
      if (user) {
        token.user = user;
        token.backendToken = (user as any).backendToken;
    
        cookieStore.set("token", String(token.backendToken || ""), {
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });
    
        cookieStore.set("id", String((user as any).id || ""), {
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60,
        });
      }
    
      // GOOGLE LOGIN
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await fetch(
            "https://personal-diary-ok2z.onrender.com/api/auth/google/callback",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: account.id_token }),
            }
          );
    
          if (!res.ok) {
            const error = await res.text();
            console.error("Backend Google login failed:", error);
            return token;
          }
    
          const data = await res.json();

          console.log("Token", data.token);
    
          if (data.token && data.user) {
            token.backendToken = data.token;
            token.user = data.user;
    
            // STORE IN COOKIES
            cookieStore.set("token", data.token, {
              path: "/",
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              maxAge: 7 * 24 * 60 * 60,
            });
    
            cookieStore.set("id", data.user.id, {
              path: "/",
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              maxAge: 7 * 24 * 60 * 60,
            });
          }
        } catch (error) {
          console.error("Google OAuth callback error:", error);
        }
      }
    
      return token;
    },

    // ------------------------------------
    // SESSION CALLBACK
    // ------------------------------------
    async session({ session, token }) {
      session.user = token.user as any;
      (session as any).backendToken = token.backendToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  logger: {
    debug(code: string, metadata: unknown) {
      if (code.includes("OAUTH") || code.includes("CALLBACK")) {
        console.log("NEXTAUTH DEBUG:", code);
        const meta = metadata as any;
        if (meta?.redirect_uri) console.log("redirect_uri:", meta.redirect_uri);
        if (meta?.provider) console.log("Provider:", meta.provider);
      }
    },
  },
};

const { handlers } = NextAuth(authConfig);
export const { GET, POST } = handlers;

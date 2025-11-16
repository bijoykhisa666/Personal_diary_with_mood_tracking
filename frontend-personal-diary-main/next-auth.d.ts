import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend JWT
declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    user?: {
      id: string;
      email: string;
      name?: string;
    };
  }
}

// Extend Session
declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user: {
      id: string;
      email: string;
      name?: string;
    } & DefaultSession["user"];
  }
}

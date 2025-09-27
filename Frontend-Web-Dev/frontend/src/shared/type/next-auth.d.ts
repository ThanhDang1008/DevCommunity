import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultAuthProvider } from "@/components/auth/auth.provider";

// Extend Session
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
    customToken?: string; // <-- thêm field custom
    data: {
      email: string;
      id_user: string;
      session_id: string;
      id_role: {
        _id: string;
        role: Role;
      };
    } | null; // <-- để lưu vào session
  }

  interface User extends DefaultUser {
    // tùy mở rộng nếu cần
  }

  interface Profile {
    picture?: string;
    [key: string]: unknown;
  }
}

// Extend JWT
declare module "next-auth/jwt" {
  interface JWT {
    customToken?: string; // <-- để lưu vào JWT
  }
}

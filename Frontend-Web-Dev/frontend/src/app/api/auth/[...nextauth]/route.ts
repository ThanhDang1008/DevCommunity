import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions, Account, Profile, User, DefaultSession } from "next-auth";
import { loginWithMedia } from "@/components/auth/actions";
import { setTokenAuth } from "@/components/auth/TokenAuth";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

// import { sendRequest } from "@/utils/api";
// import { JWT } from "next-auth/jwt";
// import CredentialsProvider from "next-auth/providers/credentials";

interface IOptionSignin {
  account: Account | null;
  profile?: Profile;
  email?:
    | {
        verificationRequest?: boolean;
      }
    | undefined;
  user: User;
  credentials?: any;
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }: IOptionSignin) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const response = await loginWithMedia({
            email: profile.email,
            type: "google",
            fullname: profile.name || profile.email,
            avatar: profile?.picture || "",
          });
          //console.log("check response", response);
          if (response.status === 200) {
            //---------------------------------------------------
            //---------------------------------------------------
            //setTokenAuth(response.data.token);
            account.access_token = response.data.token;
            account.data = response.data.data;
            return true;
          }

          return false;
        } catch (error: any) {
          //console.log("check error", error);
          return false;
        }
      }
      return false;
    },

    async jwt({ token, account }) {
      // console.log("check token", token);
      // console.log("check account", account);
      if (account?.access_token) {
        token.customToken = account.access_token; // lưu token custom vào JWT
        //gán data
        token.data = account.data; // lưu data vào JWT
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session = {
          ...session,
          customToken: token.customToken, // truyền vào session
          data: token.data as any,
        };
      }
      return session;
    },
  },
  pages: {
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

//SIGN-OUT:/api/auth/signout

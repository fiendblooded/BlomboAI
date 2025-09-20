import type { NextAuthOptions } from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "r_liteprofile r_emailaddress",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.name = (token.name as string) || session.user.name;
        // @ts-expect-error next-auth typing is permissive for image
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};



import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { connectDB } from "../../../lib/db";
import User from "../../../models/user";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    // ================= CREDENTIALS =================
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),

    // ================= GOOGLE =================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    // JWT callback
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          // Fetch MongoDB user by email to get _id
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) token.id = dbUser._id.toString();
        } else {
          token.id = user.id;
        }
      }
      return token;
    },

    // Session callback
    async session({ session, token }) {
      if (session.user) session.user.id = token.id;
      return session;
    },

    // Auto-create Google users in DB if first login
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            password: "", // Google user has no password
          });
        }
      }
      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

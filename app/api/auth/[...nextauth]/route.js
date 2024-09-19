
// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define NextAuth options with configuration
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Ensure the credentials object is not null or undefined
        if (!credentials) return null;

        // console.log("fetching the user");
        // console.log(credentials.username);
        //fetch the user from database
        const user = await prisma.user.findUnique({
          where: { name: credentials.username },
        });
        // console.log("Done fetching ", user);
        if (user && user.password === credentials.password) return user;

        return null; //if no user is found or passwords do not  match
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        //if the user object exist, add its info to the token
        token.id = user.id;
        token.name = user.name;
        token.department = user.department;
        token.plevel = user.plevel;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        //attach user information to the session
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.department = token.department;
        session.user.plevel = token.plevel;
      }
      return session;
    },
    pages: {
      signIn: "/auth/signin", // Path to your custom sign-in page
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your environment variables
  },
};
// Create a Next.js route handler for NextAuth
const handler = NextAuth(authOptions);

// Export HTTP method handlers for Next.js App Router
export { handler as GET , handler as POST};



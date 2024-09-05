
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
        console.log("Recieved Credentials");
        console.log(credentials);
        console.log(req);
        // Ensure the credentials object is not null or undefined
        if (!credentials) return null;

        console.log("fetching the user");
        console.log(credentials.username);
        //fetch the user from database
        const user = await prisma.user.findFirst({ where: { name: credentials.username } });
        console.log("Done fetching ", user);
        if (user && user.password === credentials.password)
          return user;
          console.log("fetched the user from db");
        return null; //if no user is found or passwords do not  match

      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {  //if the user object exist, add its info to the token
        token.id = user.id;
        token.name = user.name
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {    //attach user information to the session
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
    pages: {
      signIn: "/auth/signin", // Path to your custom sign-in page
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your environment variables
  }
}
// Create a Next.js route handler for NextAuth
const handler = NextAuth(authOptions);

// Export HTTP method handlers for Next.js App Router
export { handler as GET , handler as POST};






















    
  
  

/*Providers Setup
   /* You are using `CredentialsProvider` for authentication, which allows users to log in using a username and password.
   - The `authorize` function checks the credentials against hardcoded values. For a real application, you should replace this with a call to your database or any other user data store.

Callbacks
   - `jwt` callback is used to attach user information to the JWT token.
   - `session` callback is used to ensure that the session contains user information, keeping it consistent with the token.

Custom Sign-In Page
   - The `pages` option specifies a custom sign-in page, allowing for a more tailored user experience.

Secret for NextAuth
   - Make sure you have the `NEXTAUTH_SECRET` environment variable set, which is crucial for security.

Handler Export
   - The handler is correctly set up to export both `GET` and `POST` methods for the Next.js App Router.

### Suggestions

- **Security Enhancements: Hardcoding credentials (`admin`/`admin` and `user`/`user`) is suitable for testing but not for production. For real-world applications, you should verify credentials against a secure database and ensure you use proper password hashing (like bcrypt) to store passwords.

Environment Variables: Ensure `NEXTAUTH_SECRET` and any other sensitive information are correctly set in your environment variables, especially for production deployments.

- Error Handling: It might be beneficial to provide more detailed feedback or logging inside the `authorize` function, particularly when credentials fail to authenticate, to understand better where failures might occur.

- Use TypeScript: If you haven't already, consider using TypeScript to get better type safety, especially with dynamic objects like `token` and `session`.

- Rate Limiting: To prevent brute force attacks, consider implementing rate limiting on the authentication endpoint.

Here's a sample of what a more secure `authorize` function might look like using a hypothetical database query:

async authorize(credentials) {
  if (!credentials) return null;

  // Hypothetical database call to find a user
  const user = await database.users.findUnique({
    where: { username: credentials.username },
  });

  if (user && bcrypt.compareSync(credentials.password, user.passwordHash)) {
    // Return user data without sensitive info
    return { id: user.id, name: user.name, role: user.role };
  }

  return null;
}
*/

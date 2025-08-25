import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@dupli/db";

const isProd = process.env.NODE_ENV === "production";
// Only import Redis on server side
let rc: any = null;
if (typeof window === 'undefined') {
  const Redis = require("ioredis");
  rc = !isProd ? new Redis(process.env.REDIS_URL!) : null;
}

export const auth: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        if (isProd && process.env.RESEND_API_KEY) {
          // Production: Use Resend
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          
          try {
            await resend.emails.send({
              from: process.env.EMAIL_FROM!,
              to: identifier,
              subject: "Sign in to DupliClean",
              html: `
                <p>Click the link below to sign in to DupliClean:</p>
                <p><a href="${url}">${url}</a></p>
              `,
            });
          } catch (error) {
            console.error("Failed to send email:", error);
            throw new Error("Failed to send verification email");
          }
          return;
        }
        
        // Dev/test path: log & stash in redis so Playwright can fetch it
        console.log("MAGIC_LINK", identifier, url);
        if (rc) {
          await rc.set(`test:last-magic:${identifier.toLowerCase()}`, url, "EX", 300);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
};

// Export authOptions for compatibility
export const authOptions = auth;

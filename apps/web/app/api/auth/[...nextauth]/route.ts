import NextAuth from "next-auth";
import { auth } from "@/lib/auth";

export const { handlers, signIn, signOut } = NextAuth(auth);

export const { GET, POST } = handlers;

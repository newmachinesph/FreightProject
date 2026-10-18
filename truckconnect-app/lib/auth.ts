"use client";
import { createTruckConnectClient } from "@truckconnect/sdk";

const auth = createTruckConnectClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001",
});

export const { useSession, signIn, signUp, signOut } = auth;
export default auth;

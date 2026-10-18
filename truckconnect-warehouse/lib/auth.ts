import { createTruckConnectClient } from "@truckconnect/sdk";

export const authClient = createTruckConnectClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001",
});

export const { signIn, signUp, useSession } = authClient;

import { createTruckConnectClient } from "@truckconnect/sdk";

export const auth = createTruckConnectClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001",
});

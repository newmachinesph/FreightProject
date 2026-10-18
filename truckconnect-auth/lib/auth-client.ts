"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient, phoneNumberClient } from "better-auth/client/plugins";

/**
 * TruckConnect Auth Client
 *
 * Used by pages/components within the truckconnect-auth service itself.
 * External apps (truckconnect-ph, carrier app, etc.) will use the @truckconnect/sdk
 * which points this same baseURL.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001",
  plugins: [
    adminClient(),
    organizationClient(),
    phoneNumberClient(),
  ],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  useActiveOrganization,
  useListOrganizations,
} = authClient;

// src/index.ts
import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
function createTruckConnectClient(options = {}) {
  const baseURL = options.baseURL ?? "http://localhost:3001";
  if (typeof window === "undefined" && !options.baseURL && typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
    console.warn("[truckconnect/sdk] No baseURL provided \u2014 defaulting to localhost:3001. Set NEXT_PUBLIC_AUTH_URL in production.");
  }
  const client = createAuthClient({
    baseURL,
    fetchOptions: {
      credentials: "include"
    },
    plugins: [
      adminClient(),
      organizationClient()
    ]
  });
  if (typeof window !== "undefined") {
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.startsWith(baseURL)) {
        const token = localStorage.getItem("tc_session_token");
        if (token) {
          init = init ?? {};
          const headers = new Headers(init.headers);
          if (!headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          init.headers = headers;
        }
      }
      return origFetch.call(window, input, init);
    };
  }
  return client;
}
var ORG_TYPE_LABELS = {
  tc_platform: "TruckConnect Platform",
  enterprise_shipper: "Enterprise Shipper",
  msme_shipper: "MSME Shipper",
  carrier_fleet: "Carrier Fleet",
  freight_forwarder: "Freight Forwarder",
  warehouse_operator: "Warehouse Operator"
};
var ORG_ROLE_LABELS = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  super_admin: "Super Admin",
  compliance_officer: "Compliance Officer",
  dispute_manager: "Dispute Manager",
  support_agent: "Support Agent",
  ai_supervisor: "AI Supervisor",
  data_quality: "Data Quality",
  enterprise_admin: "Enterprise Admin",
  booker: "Booker",
  viewer: "Viewer",
  shipper_admin: "Shipper Admin",
  forwarder_admin: "Forwarder Admin",
  agent: "Agent",
  carrier_owner: "Carrier Owner",
  dispatcher: "Dispatcher",
  driver: "Driver",
  warehouse_admin: "Warehouse Admin",
  warehouse_manager: "Warehouse Manager",
  warehouse_staff: "Warehouse Staff",
  warehouse_viewer: "Warehouse Viewer"
};
var ORG_ADMIN_ROLES = /* @__PURE__ */ new Set([
  "owner",
  "admin",
  "super_admin",
  "enterprise_admin",
  "carrier_owner",
  "shipper_admin",
  "forwarder_admin",
  "warehouse_admin"
]);
export {
  ORG_ADMIN_ROLES,
  ORG_ROLE_LABELS,
  ORG_TYPE_LABELS,
  createTruckConnectClient
};

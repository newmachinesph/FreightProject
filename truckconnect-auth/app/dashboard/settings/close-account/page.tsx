import { redirect } from "next/navigation";

/**
 * Close Account page — redirects to the consolidated Delete Account page.
 * The /dashboard/delete-account page has the full deletion flow with
 * password confirmation, organization ownership warnings, and modal.
 */
export default function CloseAccountRedirect() {
  redirect("/dashboard/delete-account");
}

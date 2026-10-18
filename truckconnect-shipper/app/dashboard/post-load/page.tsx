import { redirect } from "next/navigation";

export default function PostLoadRedirect() {
  redirect("/dashboard/loads/new");
}

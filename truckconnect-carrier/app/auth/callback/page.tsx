"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    const token = params.get("session_token");
    if (token) {
      localStorage.setItem("tc_session_token", token);
    }
    router.push("/dashboard");
  }, [params, router]);
  return <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", fontFamily:"system-ui", color:"#6B7280" }}>Signing in...</div>;
}

export default function AuthCallback() {
  return <Suspense fallback={<div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh" }}>Loading...</div>}><CallbackInner /></Suspense>;
}

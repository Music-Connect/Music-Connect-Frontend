"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (!data?.user) {
        router.replace("/login");
        return;
      }

      const tipo = (data.user as Record<string, unknown>).tipo_usuario as string;
      if (!tipo) {
        router.replace("/profile-selector?from=google");
      } else {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
    </div>
  );
}

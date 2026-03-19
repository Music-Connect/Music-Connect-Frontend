"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const { setUser, setSessionLoaded } = useAuthStore();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      const u = session.user as typeof session.user & {
        tipo_usuario?: string;
        telefone?: string;
        cidade?: string;
        estado?: string;
        genero_musical?: string;
        descricao?: string;
      };
      setUser({
        id: u.id,
        email: u.email,
        name: u.name,
        image: u.image,
        tipo_usuario: u.tipo_usuario ?? "",
        telefone: u.telefone,
        cidade: u.cidade,
        estado: u.estado,
        genero_musical: u.genero_musical,
        descricao: u.descricao,
      });
    } else {
      setUser(null);
    }

    setSessionLoaded(true);
  }, [session, isPending, setUser, setSessionLoaded]);

  return <>{children}</>;
}

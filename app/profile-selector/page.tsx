"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { useAuthStore } from "@/lib/store";
import { Mic, Headphones, ArrowRight } from "lucide-react";

export default function ProfileSelectorPage() {
  const router = useRouter();
  const { user, sessionLoaded } = useAuthStore();

  useEffect(() => {
    if (sessionLoaded && user) {
      router.replace("/dashboard");
    }
  }, [user, sessionLoaded, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/3 h-150 w-150 rounded-full bg-linear-to-br from-rose-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-100 w-100 rounded-full bg-linear-to-tl from-amber-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 py-16">
        {/* Back */}
        <div className="mb-6">
          <BackButton href="/" label="Início" />
        </div>

        {/* Brand */}
        <div className="fade-in-up mb-4 text-center">
          <Link href="/" className="inline-block">
            <span className="text-sm font-bold bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
              Music Connect
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div
          className="fade-in-up mb-12 text-center"
          style={{ animationDelay: "60ms" }}
        >
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Como deseja se{" "}
            <span className="bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
              cadastrar?
            </span>
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Escolha o perfil que melhor representa você na plataforma
          </p>
        </div>

        {/* Cards */}
        <div
          className="fade-in-up grid grid-cols-1 gap-5 sm:grid-cols-2"
          style={{ animationDelay: "140ms" }}
        >
          {/* Artista */}
          <Link href="/register-artist" className="group">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-rose-500/30 hover:bg-zinc-900/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-rose-500/0 blur-3xl transition-all duration-500 group-hover:bg-rose-500/10" />
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/60 text-zinc-400 transition-colors group-hover:bg-zinc-800">
                  <Mic size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Sou Artista
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  Divulgue seu talento, receba propostas e conquiste novos
                  palcos.
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 transition-colors group-hover:text-white">
                  Começar cadastro
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Contratante */}
          <Link href="/register-contractor" className="group">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/30 hover:bg-zinc-900/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/0 blur-3xl transition-all duration-500 group-hover:bg-amber-500/10" />
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/60 text-zinc-400 transition-colors group-hover:bg-zinc-800">
                  <Headphones size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Sou Contratante
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  Encontre artistas perfeitos e organize eventos memoráveis.
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 transition-colors group-hover:text-white">
                  Começar cadastro
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <p
          className="fade-in-up mt-10 text-center text-sm text-zinc-500"
          style={{ animationDelay: "220ms" }}
        >
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

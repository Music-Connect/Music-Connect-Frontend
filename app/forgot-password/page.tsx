"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import BackButton from "@/components/BackButton";
import { KeyRound, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setMessage("Se o email existir, você receberá instruções para redefinir sua senha.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-100 w-100 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Back */}
        <div className="mb-6">
          <BackButton href="/login" />
        </div>

        {/* Brand */}
        <div className="fade-in-up mb-10 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black tracking-tight">
              <span className="bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                Music Connect
              </span>
            </h1>
          </Link>
        </div>

        {/* Card */}
        <div
          className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 backdrop-blur-sm"
          style={{ animationDelay: "80ms" }}
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/60 text-zinc-400">
              <KeyRound size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Recuperar Senha</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Enviaremos um link de recuperação para o seu email
            </p>
          </div>

          {message && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              <CheckCircle2 size={16} />
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-zinc-400"
              >
                Email da sua conta
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
                  Enviando...
                </>
              ) : (
                "Enviar Link de Recuperação"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          className="fade-in-up mt-8 text-center text-sm text-zinc-500"
          style={{ animationDelay: "160ms" }}
        >
          Lembrou a senha?{" "}
          <Link
            href="/login"
            className="font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}

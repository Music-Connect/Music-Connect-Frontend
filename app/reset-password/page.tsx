"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50";
const labelClass = "mb-1.5 block text-[13px] font-medium text-zinc-400";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (novaSenha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await authClient.resetPassword({ newPassword: novaSenha, token });
      if (error) throw new Error(error.message || "Erro ao redefinir senha");
      setMessage("Senha alterada com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao redefinir senha");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Invalid / missing token ── */
  if (!token) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-red-600/6 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md px-6 py-12 text-center">
          <div className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-10 backdrop-blur-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
              ⚠️
            </div>
            <h1 className="mb-2 text-xl font-bold text-white">Link inválido</h1>
            <p className="mb-8 text-sm text-zinc-500">
              O link de recuperação é inválido ou expirou.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              Solicitar novo link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-100 w-100 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/60 text-2xl">
              🔒
            </div>
            <h2 className="text-xl font-bold text-white">Nova Senha</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Escolha uma nova senha segura para sua conta
            </p>
          </div>

          {message && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              <span>✅</span>
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="novaSenha" className={labelClass}>
                Nova Senha
              </label>
              <input
                type="password"
                name="novaSenha"
                id="novaSenha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-zinc-600">
                Mínimo de 6 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="confirmarSenha" className={labelClass}>
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                name="confirmarSenha"
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className={inputClass}
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
                  Salvando...
                </>
              ) : (
                "Redefinir Senha"
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

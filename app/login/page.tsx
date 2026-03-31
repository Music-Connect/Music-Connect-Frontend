"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import BackButton from "@/components/BackButton";
import { useAuthStore } from "@/lib/store";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, sessionLoaded } = useAuthStore();
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redireciona para dashboard se já estiver logado
  useEffect(() => {
    if (sessionLoaded && user) {
      router.replace("/dashboard");
    }
  }, [user, sessionLoaded, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({ ...formLogin, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/auth/google-callback",
    });
  };

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formLogin.email,
        password: formLogin.password,
      });
      if (error) throw new Error(error.message || "Erro ao fazer login");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 h-150 w-150 rounded-full bg-linear-to-br from-fuchsia-600/[0.07] to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-linear-to-tl from-amber-500/6 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Back */}
        <div className="mb-6">
          <BackButton href="/" label="Início" />
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
          <p className="mt-3 text-sm text-zinc-500">
            Conectando artistas e contratantes através da música
          </p>
        </div>

        {/* Card */}
        <div
          className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 backdrop-blur-sm"
          style={{ animationDelay: "80ms" }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Entrar na conta</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Acesse seu painel e gerencie tudo
            </p>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800/60 hover:border-zinc-700"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
            Entrar com Google
          </button>

          {/* Separador */}
          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <div className="flex-1 border-t border-zinc-800" />
            ou
            <div className="flex-1 border-t border-zinc-800" />
          </div>

          <form onSubmit={loginSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-zinc-400"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="seu@email.com"
                value={formLogin.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[13px] font-medium text-zinc-400"
                >
                  Senha
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={formLogin.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight size={14} />
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          className="fade-in-up mt-8 text-center text-sm text-zinc-500"
          style={{ animationDelay: "160ms" }}
        >
          Não tem uma conta?{" "}
          <Link
            href="/profile-selector"
            className="font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

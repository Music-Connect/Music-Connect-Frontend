"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({ ...formLogin, [e.target.name]: e.target.value });
  };

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.login(formLogin.email, formLogin.password);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("type", response.user.tipo_usuario);
      localStorage.setItem("token", response.token);
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

          <form onSubmit={loginSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <span>⚠️</span>
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
                    →
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

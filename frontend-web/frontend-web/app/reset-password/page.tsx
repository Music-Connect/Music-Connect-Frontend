"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { api } from "@/lib/api";

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
      const result = await api.resetPassword(token, novaSenha);
      setMessage(result.message || "Senha alterada com sucesso!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao redefinir senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          <h1 className="text-3xl font-bold mb-6 text-red-400">
            Token inválido
          </h1>
          <p className="text-zinc-300 mb-6">
            O link de recuperação é inválido ou expirou.
          </p>
          <Link
            href="/forgot-password"
            className="px-6 py-3 rounded-full bg-linear-to-r from-yellow-300 to-pink-500 text-black font-bold hover:opacity-90 transition"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-bold mb-10 text-center">
          <span className="bg-linear-to-r from-yellow-300 to-pink-500 text-transparent bg-clip-text">
            Nova Senha
          </span>
        </h1>

        <p className="text-1xl text-zinc-300 pb-10 text-center max-w-md">
          Digite sua nova senha abaixo
        </p>

        {message && (
          <div className="w-full max-w-md mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500 text-green-300 text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="w-full max-w-md mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div>
            <label
              htmlFor="novaSenha"
              className="block text-sm font-medium text-gray-300 mb-2 ml-2"
            >
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
              className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label
              htmlFor="confirmarSenha"
              className="block text-sm font-medium text-gray-300 mb-2 ml-2"
            >
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
              className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-full bg-linear-to-r from-yellow-300 to-pink-500 text-black font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Salvando..." : "Salvar Nova Senha"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-black">
          <div className="text-white">Carregando...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

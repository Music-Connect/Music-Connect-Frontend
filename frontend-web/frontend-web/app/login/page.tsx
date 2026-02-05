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

      // Salvar no localStorage (cookie gerenciado automaticamente pelo navegador)
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("type", response.user.tipo_usuario);

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-bold mb-10 text-center">
          <span className="bg-linear-to-r from-yellow-300 to-pink-500 text-transparent bg-clip-text">
            Music Connect
          </span>
        </h1>

        <p className="text-1xl text-zinc-300 pb-10 text-center">
          Conectando artistas e contratantes através da música
        </p>

        <form onSubmit={loginSubmit} className="w-full max-w-md space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2 ml-2"
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
              className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2 ml-2"
            >
              Senha
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Digite sua senha"
              value={formLogin.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-full bg-linear-to-r from-yellow-300 to-pink-500 text-black font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center space-y-2">
            <Link
              href="/forgot-password"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Esqueci minha senha
            </Link>
            <p className="text-zinc-400">
              Não tem uma conta?{" "}
              <Link
                href="/profile-selector"
                className="text-pink-500 hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

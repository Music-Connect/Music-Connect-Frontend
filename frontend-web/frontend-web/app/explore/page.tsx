"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { api, User } from "@/lib/api";

const genres = ["Rock", "Pop", "Sertanejo", "Eletrônica", "MPB", "Jazz"];
const types = ["Todos", "Artistas", "Contratantes"];

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("Todos");

  const fetchUsers = async (term: string) => {
    setLoading(true);
    try {
      const users = await api.getUsers(term);
      setResults(users);
    } catch (error) {
      console.error("Erro ao buscar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchTerm(initialSearch);
    fetchUsers(initialSearch);
  }, [initialSearch]);

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/explore?search=${searchTerm}`);
    }
  };

  const filteredResults = results.filter((user) => {
    if (selectedType === "Todos") return true;
    if (selectedType === "Artistas") return user.tipo_usuario === "artista";
    if (selectedType === "Contratantes")
      return user.tipo_usuario === "contratante";
    return true;
  });

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Sidebar de Filtros */}
      <aside className="w-64 border-r border-zinc-900 p-6 hidden md:block sticky top-0 h-screen overflow-y-auto">
        <div
          className="flex items-center gap-3 mb-8 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-white hover:text-black transition">
            ←
          </div>
          <span className="font-bold text-sm">Voltar</span>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Tipo
            </h3>
            <div className="space-y-2">
              {types.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type)}
                    className="accent-pink-500"
                  />
                  <span className="text-sm text-zinc-400 hover:text-white">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Gêneros
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:border-pink-500 hover:text-white cursor-pointer transition"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Explorar Artistas</h1>
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Buscar por nome, gênero, cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKey}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
              🔍
            </span>
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="text-zinc-500">Carregando...</div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-zinc-800 border-dashed">
            <p className="text-zinc-400 mb-2">Nenhum resultado encontrado.</p>
            <p className="text-sm text-zinc-500">
              Tente termos mais genéricos ou limpe os filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResults.map((user) => (
              <div
                key={user.id_usuario}
                onClick={() => router.push(`/u/${user.id_usuario}`)}
                className="group bg-zinc-900 border border-zinc-800 p-4 rounded-2xl hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-zinc-800">
                  <div className="absolute inset-0 bg-linear-to-br from-zinc-800 to-black group-hover:scale-105 transition-transform duration-500"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    {user.imagem_perfil_url ? (
                      <Image
                        src={user.imagem_perfil_url}
                        alt={user.usuario}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">
                        {user.tipo_usuario === "artista" ? "🎵" : "🏢"}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-white text-lg mb-1 truncate">
                  {user.usuario}
                </h3>
                <p className="text-sm text-zinc-400 mb-2 capitalize">
                  {user.tipo_usuario}
                </p>

                {user.genero_musical && (
                  <span className="inline-block px-2 py-1 rounded-md bg-pink-500/10 text-pink-500 text-xs font-bold mb-2">
                    {user.genero_musical}
                  </span>
                )}

                {user.cidade && (
                  <p className="text-xs text-zinc-500 mt-auto">
                    📍 {user.cidade}
                    {user.estado && `, ${user.estado}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

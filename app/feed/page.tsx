"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import StoryBar from "@/components/StoryBar";
import CommentSection from "@/components/CommentSection";
import { api, Post, StoryGroup, ArtistaRecomendado } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { authClient } from "@/lib/auth-client";
import { Star, MapPin, Music, TrendingUp, Image, Film, Hash, Send, ChevronDown } from "lucide-react";

export default function FeedPage() {
  const router = useRouter();
  const { user, sessionLoaded } = useAuthStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [recomendados, setRecomendados] = useState<ArtistaRecomendado[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [storyUrl, setStoryUrl] = useState("");
  const [commentPost, setCommentPost] = useState<Post | null>(null);
  const [feedType, setFeedType] = useState<"recente" | "recomendado">("recente");
  const [filterTipo, setFilterTipo] = useState<string>("");

  // Inline composer
  const [composeText, setComposeText] = useState("");
  const [composeType, setComposeType] = useState<"post" | "disponibilidade" | "buscando">("post");
  const [composeTagsInput, setComposeTagsInput] = useState("");
  const [composeImageUrl, setComposeImageUrl] = useState("");
  const [composeImages, setComposeImages] = useState<string[]>([]);
  const [composeVideoUrl, setComposeVideoUrl] = useState("");
  const [composeFocused, setComposeFocused] = useState(false);
  const [composeShowMedia, setComposeShowMedia] = useState(false);
  const [composeLoading, setComposeLoading] = useState(false);
  const composeRef = useRef<HTMLTextAreaElement>(null);

  const isArtist = user?.tipo_usuario === "artista";

  useEffect(() => {
    if (!sessionLoaded) return;
    if (!user) {
      router.push("/login");
      return;
    }
    loadFeed(true);
    loadStories();
    loadRecomendados();
  }, [sessionLoaded, user, feedType, filterTipo]);

  const loadFeed = async (reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const params: any = { limit: 15 };
      if (!reset && cursor) params.cursor = cursor;
      if (filterTipo) params.tipo = filterTipo;

      const result =
        feedType === "recomendado"
          ? await api.getFeedRecomendado(params)
          : await api.getFeed(params);

      setPosts(reset ? result.data : [...posts, ...result.data]);
      setCursor(result.meta.nextCursor);
      setHasMore(result.meta.hasMore);
    } catch {}

    setLoading(false);
    setLoadingMore(false);
  };

  const loadStories = async () => {
    try {
      const data = await api.getStories();
      setStories(data);
    } catch {}
  };

  const loadRecomendados = async () => {
    try {
      const data = await api.getRecomendacoes({ limit: 5 });
      setRecomendados(data);
    } catch {}
  };

  const handleLogout = async () => {
    await authClient.signOut();
    useAuthStore.getState().setUser(null);
    router.push("/login");
  };

  const handlePublishInline = async () => {
    if (!composeText.trim()) return;
    setComposeLoading(true);
    try {
      const tags = composeTagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      await api.createPost({
        conteudo: composeText.trim(),
        tipo: composeType,
        imagens: composeImages.length > 0 ? composeImages : undefined,
        video_url: composeVideoUrl || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      setComposeText("");
      setComposeType("post");
      setComposeTagsInput("");
      setComposeImages([]);
      setComposeImageUrl("");
      setComposeVideoUrl("");
      setComposeFocused(false);
      setComposeShowMedia(false);
      loadFeed(true);
    } catch {
      alert("Erro ao criar post");
    } finally {
      setComposeLoading(false);
    }
  };

  const addComposeImage = () => {
    if (composeImageUrl && composeImages.length < 10) {
      setComposeImages([...composeImages, composeImageUrl]);
      setComposeImageUrl("");
    }
  };

  const handleCreateStory = async () => {
    if (!storyUrl) return;
    try {
      await api.createStory({ midia_url: storyUrl });
      setStoryUrl("");
      setShowCreateStory(false);
      loadStories();
    } catch {
      alert("Erro ao criar story");
    }
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  // Infinite scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 400 && hasMore && !loadingMore) {
        loadFeed();
      }
    },
    [hasMore, loadingMore, cursor]
  );

  if (!sessionLoaded || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <Sidebar isArtist={isArtist} activePage="feed" onLogout={handleLogout} />

      <div className="flex flex-1 flex-col min-w-0">
        <Header user={{ name: user.name }} userType={user.tipo_usuario} />

        <main className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
            <div className="flex gap-6">
              {/* Main feed */}
              <div className="flex-1 min-w-0 space-y-5">
                {/* Stories */}
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm p-4">
                  <StoryBar
                    stories={stories}
                    currentUserId={user.id}
                    onCreateStory={() => setShowCreateStory(true)}
                    onRefresh={loadStories}
                  />
                </div>

                {/* Inline Composer */}
                <div className={`rounded-2xl border bg-zinc-900/40 backdrop-blur-sm transition-all ${composeFocused ? "border-zinc-700/60 bg-zinc-900/60" : "border-zinc-800/50"}`}>
                  <div className="flex gap-3 px-5 pt-4 pb-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <textarea
                      ref={composeRef}
                      value={composeText}
                      onChange={(e) => setComposeText(e.target.value)}
                      onFocus={() => setComposeFocused(true)}
                      placeholder={
                        composeType === "disponibilidade"
                          ? "Conte sobre sua disponibilidade..."
                          : composeType === "buscando"
                          ? "Descreva o artista que você está buscando..."
                          : `O que você quer compartilhar, ${user.name?.split(" ")[0]}?`
                      }
                      rows={composeFocused ? 3 : 1}
                      maxLength={2000}
                      className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 resize-none focus:outline-none mt-2"
                    />
                  </div>

                  {(composeFocused || composeText.length > 0) && (
                    <div className="px-5 pb-4 space-y-3">
                      {/* Type chips */}
                      <div className="flex gap-2 ml-[52px]">
                        {([
                          { value: "post", label: "Post" },
                          { value: "disponibilidade", label: "Disponível" },
                          { value: "buscando", label: "Buscando Artista" },
                        ] as const).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setComposeType(opt.value)}
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                              composeType === opt.value
                                ? "border-rose-400/40 bg-rose-400/10 text-rose-400"
                                : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:text-zinc-300"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="ml-[52px] relative">
                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input
                          value={composeTagsInput}
                          onChange={(e) => setComposeTagsInput(e.target.value)}
                          placeholder="Tags (separadas por vírgula)"
                          className="w-full rounded-xl border border-zinc-800/60 bg-zinc-800/30 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none"
                        />
                      </div>

                      {/* Media toggle */}
                      <div className="ml-[52px]">
                        <button
                          onClick={() => setComposeShowMedia(!composeShowMedia)}
                          className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-800/60 hover:bg-zinc-800/40 transition-colors"
                        >
                          <Image size={14} />
                          Mídia
                          <ChevronDown size={12} className={`transition-transform ${composeShowMedia ? "rotate-180" : ""}`} />
                        </button>
                      </div>

                      {/* Media inputs */}
                      {composeShowMedia && (
                        <div className="ml-[52px] space-y-3 rounded-xl border border-zinc-800/40 bg-zinc-800/20 p-4">
                          <div>
                            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">
                              Imagens ({composeImages.length}/10)
                            </label>
                            <div className="flex gap-2">
                              <input
                                value={composeImageUrl}
                                onChange={(e) => setComposeImageUrl(e.target.value)}
                                placeholder="URL da imagem"
                                className="flex-1 rounded-lg border border-zinc-800/60 bg-zinc-800/30 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none"
                              />
                              <button
                                onClick={addComposeImage}
                                disabled={!composeImageUrl || composeImages.length >= 10}
                                className="px-3 py-2 rounded-lg bg-zinc-800 text-xs font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 transition-colors"
                              >
                                Adicionar
                              </button>
                            </div>
                            {composeImages.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {composeImages.map((img, i) => (
                                  <div key={i} className="relative group">
                                    <img src={img} alt="" className="h-16 w-16 rounded-lg object-cover" />
                                    <button
                                      onClick={() => setComposeImages(composeImages.filter((_, idx) => idx !== i))}
                                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      x
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">
                              Vídeo (YouTube URL)
                            </label>
                            <div className="flex items-center gap-2">
                              <Film size={14} className="text-zinc-600 shrink-0" />
                              <input
                                value={composeVideoUrl}
                                onChange={(e) => setComposeVideoUrl(e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="flex-1 rounded-lg border border-zinc-800/60 bg-zinc-800/30 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer actions */}
                      <div className="flex items-center justify-between ml-[52px]">
                        <p className="text-[10px] text-zinc-600">{composeText.length}/2000</p>
                        <button
                          onClick={handlePublishInline}
                          disabled={!composeText.trim() || composeLoading}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <Send size={14} />
                          {composeLoading ? "Publicando..." : "Publicar"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feed controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex gap-1 rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-1">
                    <button
                      onClick={() => setFeedType("recente")}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                        feedType === "recente"
                          ? "bg-white text-black"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Recentes
                    </button>
                    <button
                      onClick={() => setFeedType("recomendado")}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                        feedType === "recomendado"
                          ? "bg-white text-black"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Para você
                    </button>
                  </div>

                  <div className="flex gap-1.5">
                    {["", "disponibilidade", "buscando"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterTipo(t)}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                          filterTipo === t
                            ? "border-rose-400/40 bg-rose-400/10 text-rose-400"
                            : "border-zinc-800/60 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {t === "" ? "Todos" : t === "disponibilidade" ? "Disponíveis" : "Buscando"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts */}
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse rounded-2xl bg-zinc-900/30 h-48" />
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-12 text-center">
                    <p className="text-sm text-zinc-500">Nenhuma publicação encontrada.</p>
                    <button
                      onClick={() => {
                        setComposeFocused(true);
                        composeRef.current?.focus();
                      }}
                      className="mt-3 text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Seja o primeiro a publicar!
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post, i) => (
                      <div key={post.id} style={{ animationDelay: `${i * 60}ms` }}>
                        <PostCard
                          post={post}
                          currentUserId={user.id}
                          onDelete={handleDeletePost}
                          onComment={setCommentPost}
                        />
                      </div>
                    ))}

                    {loadingMore && (
                      <div className="flex justify-center py-4">
                        <div className="h-6 w-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
                      </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                      <p className="text-center text-xs text-zinc-600 py-4">Você viu tudo por enquanto</p>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar — Recomendações (desktop only) */}
              <div className="hidden lg:block w-72 shrink-0 space-y-4">
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-amber-400" />
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Artistas Sugeridos
                    </h3>
                  </div>

                  {recomendados.length === 0 ? (
                    <p className="text-xs text-zinc-600">Nenhuma sugestão no momento</p>
                  ) : (
                    <div className="space-y-3">
                      {recomendados.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => router.push(`/u/${a.id}`)}
                          className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-zinc-800/40 transition-colors"
                        >
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                            {a.image ? (
                              <img src={a.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              a.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{a.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                              {a.genero_musical && (
                                <span className="flex items-center gap-0.5">
                                  <Music size={9} />
                                  {a.genero_musical}
                                </span>
                              )}
                              {a.cidade && (
                                <span className="flex items-center gap-0.5">
                                  <MapPin size={9} />
                                  {a.cidade}
                                </span>
                              )}
                            </div>
                          </div>
                          {a.total_avaliacoes > 0 && (
                            <div className="flex items-center gap-0.5 text-[10px] text-amber-400">
                              <Star size={10} fill="currentColor" />
                              {a.media_avaliacoes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showCreateStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800/60 bg-zinc-900 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Criar Story</h3>
            <input
              value={storyUrl}
              onChange={(e) => setStoryUrl(e.target.value)}
              placeholder="URL da imagem ou vídeo"
              className="w-full rounded-xl border border-zinc-800/60 bg-zinc-800/30 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
            <p className="text-[10px] text-zinc-600">O story expira automaticamente em 24 horas.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateStory(false);
                  setStoryUrl("");
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateStory}
                disabled={!storyUrl}
                className="px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 disabled:opacity-30 transition-all"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}

      {commentPost && (
        <CommentSection post={commentPost} onClose={() => setCommentPost(null)} />
      )}
    </div>
  );
}

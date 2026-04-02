import Link from "next/link";
import LandingBackgroundClient from "@/components/LandingBackgroundClient";

const features = [
  {
    icon: "⚡",
    title: "Conexão Direta",
    desc: "Sem intermediários. Artistas e contratantes se encontram e fecham negócio diretamente.",
  },
  {
    icon: "🔍",
    title: "Busca Inteligente",
    desc: "Filtre por gênero, cidade, faixa de preço e disponibilidade. Encontre o match perfeito.",
  },
  {
    icon: "⭐",
    title: "Reputação Real",
    desc: "Avaliações verificadas de quem realmente trabalhou junto. Zero fake reviews.",
  },
  {
    icon: "📋",
    title: "Propostas Estruturadas",
    desc: "Fluxo completo de proposta, aceite e histórico. Tudo documentado na plataforma.",
  },
];

const steps = [
  {
    num: "01",
    title: "Crie seu perfil",
    desc: "Monte seu portfólio musical, defina seus preços e mostre seu trabalho para o mercado.",
  },
  {
    num: "02",
    title: "Conecte-se",
    desc: "Artistas recebem propostas de eventos. Contratantes descobrem talentos perfeitos para cada ocasião.",
  },
  {
    num: "03",
    title: "Faça acontecer",
    desc: "Aceite a proposta, finalize os detalhes e construa sua reputação a cada show realizado.",
  },
];

const stats = [
  { value: "500+", label: "Artistas" },
  { value: "1.2k", label: "Eventos" },
  { value: "4.8", label: "Avaliação média" },
  { value: "98%", label: "Satisfação" },
];

const artistBenefits = [
  "Seja descoberto por contratantes da sua cidade e região",
  "Receba propostas com valor, data e detalhes do evento",
  "Construa reputação com avaliações verificadas",
  "Gerencie seu portfólio com links do Spotify e Instagram",
];

const contractorBenefits = [
  "Busque artistas por gênero, preço e localização",
  "Envie propostas detalhadas com todos os dados do evento",
  "Histórico completo de todos os eventos realizados",
  "Avalie artistas e ajude a comunidade a crescer",
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* ── Grain texture overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Animated background ── */}
      <LandingBackgroundClient />

      {/* ── Navbar ── */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 border-b border-white/[0.04]">
        <Link href="/" className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black"
            style={{
              background:
                "linear-gradient(135deg, #fbbf24 0%, #f43f5e 50%, #a855f7 100%)",
            }}
          >
            M
          </div>
          <span className="text-[18px] font-black tracking-tight text-white">
            Music<span className="text-zinc-500">Connect</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Explorar", href: "/explore" },
            { label: "Criar Conta", href: "/profile-selector" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition-colors duration-150 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <div className="mx-3 h-4 w-px bg-zinc-800" />
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-400 transition-colors duration-150 hover:text-white"
          >
            Entrar
          </Link>
          <Link
            href="/profile-selector"
            className="ml-1 rounded-lg px-4 py-2.5 text-sm font-bold text-black transition-all duration-150 hover:opacity-90 hover:scale-[1.02]"
            style={{
              background:
                "linear-gradient(135deg, #fbbf24 0%, #f43f5e 60%, #a855f7 100%)",
            }}
          >
            Começar grátis
          </Link>
        </nav>

        <Link
          href="/login"
          className="md:hidden text-sm font-semibold text-zinc-400 hover:text-white"
        >
          Entrar →
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20 lg:pt-36 lg:pb-28">
        {/* Live badge */}
        <div className="fade-in-up mb-10 inline-flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
            A plataforma da cena musical brasileira
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="fade-in-up max-w-5xl font-black leading-[0.95] tracking-tighter"
          style={{
            animationDelay: "60ms",
            fontSize: "clamp(3rem, 9vw, 7rem)",
          }}
        >
          <span className="block text-white">Talentos que</span>
          <span
            className="block"
            style={{
              background:
                "linear-gradient(135deg, #fbbf24 0%, #f43f5e 45%, #c026d3 80%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            encontram palcos.
          </span>
        </h1>

        <p
          className="fade-in-up mt-7 max-w-lg text-base leading-relaxed text-zinc-500 sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          Conectamos artistas e bandas com contratantes de eventos em todo o
          Brasil. Direto, rápido e sem complicação.
        </p>

        {/* CTAs */}
        <div
          className="fade-in-up mt-10 flex flex-col sm:flex-row items-center gap-3"
          style={{ animationDelay: "180ms" }}
        >
          <Link
            href="/profile-selector"
            className="group inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold text-black transition-all duration-150 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #fbbf24 0%, #f43f5e 60%, #a855f7 100%)",
              boxShadow:
                "0 0 40px rgba(244,63,94,0.2), 0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            Criar conta grátis
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-7 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-150 hover:border-zinc-700 hover:text-white"
          >
            Ver artistas
          </Link>
        </div>

        {/* Stats strip */}
        <div
          className="fade-in-up mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          style={{ animationDelay: "240ms" }}
        >
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span
                className="text-2xl font-black tabular-nums"
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24, #f43f5e, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                {s.label}
              </span>
              {i < stats.length - 1 && (
                <span className="ml-10 hidden sm:block text-zinc-800 text-lg font-thin">
                  /
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── App Preview Mockup ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pb-28">
        <div className="mx-auto max-w-5xl">
          {/* Glow behind mockup */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-10 w-[600px] h-[200px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(244,63,94,0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div
            className="relative overflow-hidden rounded-2xl border border-zinc-800/60"
            style={{
              background:
                "linear-gradient(160deg, rgba(24,24,27,0.95) 0%, rgba(12,12,14,0.98) 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-zinc-800/60 px-5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-zinc-800" />
              <span className="h-3 w-3 rounded-full bg-zinc-800" />
              <span className="h-3 w-3 rounded-full bg-zinc-800" />
              <div className="ml-4 flex-1 max-w-xs rounded-md bg-zinc-900/80 border border-zinc-800/60 px-3 py-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-zinc-600 font-mono">
                  app.musicconnect.com.br
                </span>
              </div>
            </div>

            {/* Mockup content */}
            <div className="p-5 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Sidebar mock */}
                <div className="hidden md:flex md:col-span-2 flex-col gap-3 pt-1">
                  {["Dashboard", "Explorar", "Propostas", "Perfil"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
                        style={{
                          background:
                            i === 0
                              ? "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(244,63,94,0.08))"
                              : "transparent",
                        }}
                      >
                        <div
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background:
                              i === 0 ? "#f43f5e" : "rgba(255,255,255,0.1)",
                          }}
                        />
                        <span
                          className="text-[11px] font-medium"
                          style={{
                            color: i === 0 ? "#fff" : "rgba(255,255,255,0.25)",
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Main area */}
                <div className="md:col-span-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Artist card */}
                  <div
                    className="rounded-xl border border-zinc-800/50 p-4"
                    style={{
                      background: "rgba(18,18,20,0.8)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-base font-black"
                        style={{
                          background:
                            "linear-gradient(135deg, #fbbf24, #f43f5e)",
                        }}
                      >
                        A
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-white">
                          Ana Silva
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          MPB · Jazz · São Paulo
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-zinc-600">
                            Reputação
                          </span>
                          <span className="text-[10px] font-bold text-amber-400">
                            4.9 ★
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: "92%",
                              background:
                                "linear-gradient(90deg, #fbbf24, #f43f5e)",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        {["Samba", "MPB", "Jazz"].map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md px-2 py-0.5 text-[9px] font-semibold text-zinc-400 border border-zinc-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Proposal card */}
                  <div
                    className="rounded-xl border border-zinc-800/50 p-4"
                    style={{ background: "rgba(18,18,20,0.8)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold"
                        style={{
                          background: "rgba(251,191,36,0.1)",
                          color: "#fbbf24",
                          border: "1px solid rgba(251,191,36,0.2)",
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: "#fbbf24" }}
                        />
                        Pendente
                      </span>
                      <span className="text-sm font-black text-white">
                        R$ 3.200
                      </span>
                    </div>
                    <p className="text-[13px] font-bold text-white mb-0.5">
                      Festival de Verão
                    </p>
                    <p className="text-[10px] text-zinc-500 mb-1">
                      Florianópolis · 15 jan · 4h
                    </p>
                    <p className="text-[10px] text-zinc-600 mb-4">
                      Público esperado: 500 pessoas
                    </p>
                    <div className="flex gap-2">
                      <div
                        className="flex-1 rounded-lg py-1.5 text-center text-[10px] font-bold text-white"
                        style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}
                      >
                        Aceitar
                      </div>
                      <div className="flex-1 rounded-lg border border-zinc-800 py-1.5 text-center text-[10px] font-bold text-zinc-500">
                        Recusar
                      </div>
                    </div>
                  </div>

                  {/* Stats card */}
                  <div
                    className="rounded-xl border border-zinc-800/50 p-4"
                    style={{ background: "rgba(18,18,20,0.8)" }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1">
                      Dezembro
                    </p>
                    <p className="text-3xl font-black text-white">8</p>
                    <p className="text-[10px] text-zinc-500 mb-4">
                      propostas recebidas
                    </p>
                    {/* Mini bar chart */}
                    <div className="flex items-end gap-1 h-10 mb-2">
                      {[30, 55, 40, 70, 50, 85, 65, 90, 72, 88, 60, 95].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm"
                            style={{
                              height: `${h}%`,
                              background:
                                i === 11
                                  ? "linear-gradient(to top, #fbbf24, #f43f5e)"
                                  : "rgba(255,255,255,0.07)",
                            }}
                          />
                        )
                      )}
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-700">
                      <span>Jan</span>
                      <span>Dez</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Como Funciona ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">
              Como funciona
            </p>
            <h2
              className="text-4xl font-black tracking-tighter sm:text-5xl"
              style={{ lineHeight: 1.05 }}
            >
              Três passos para{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f43f5e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                decolar
              </span>
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(244,63,94,0.3), rgba(168,85,247,0.3), transparent)"
              }}
            />

            {steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-start gap-4 rounded-2xl border border-zinc-800/50 p-6"
                style={{ background: "rgba(14,14,16,0.8)" }}
              >
                {/* Number */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-black"
                  style={{
                    background:
                      i === 0
                        ? "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(244,63,94,0.15))"
                        : i === 1
                        ? "linear-gradient(135deg, rgba(244,63,94,0.15), rgba(168,85,247,0.15))"
                        : "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(192,38,211,0.15))",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(135deg, #fbbf24, #f43f5e)"
                          : i === 1
                          ? "linear-gradient(135deg, #f43f5e, #a855f7)"
                          : "linear-gradient(135deg, #a855f7, #c026d3)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Para Artistas / Para Contratantes ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Para Artistas */}
            <div
              className="relative overflow-hidden rounded-2xl p-8"
              style={{
                background:
                  "linear-gradient(145deg, rgba(251,191,36,0.06) 0%, rgba(244,63,94,0.04) 50%, rgba(14,14,16,0.9) 100%)",
                border: "1px solid rgba(251,191,36,0.12)",
              }}
            >
              <div
                className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <div className="relative z-10">
                <div className="mb-2 text-2xl">🎤</div>
                <h3 className="text-xl font-black text-white mb-1">
                  Para Artistas
                </h3>
                <p className="text-sm text-zinc-500 mb-6">
                  Músicos, bandas e produtores que querem ser encontrados.
                </p>
                <ul className="space-y-3">
                  {artistBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black"
                        style={{
                          background:
                            "linear-gradient(135deg, #fbbf24, #f43f5e)",
                          color: "#000",
                        }}
                      >
                        ✓
                      </span>
                      <span className="text-sm text-zinc-400">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register-artist"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-black transition-all duration-150 hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #f43f5e)",
                  }}
                >
                  Cadastrar como artista →
                </Link>
              </div>
            </div>

            {/* Para Contratantes */}
            <div
              className="relative overflow-hidden rounded-2xl p-8"
              style={{
                background:
                  "linear-gradient(145deg, rgba(168,85,247,0.06) 0%, rgba(192,38,211,0.04) 50%, rgba(14,14,16,0.9) 100%)",
                border: "1px solid rgba(168,85,247,0.12)",
              }}
            >
              <div
                className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <div className="relative z-10">
                <div className="mb-2 text-2xl">🎪</div>
                <h3 className="text-xl font-black text-white mb-1">
                  Para Contratantes
                </h3>
                <p className="text-sm text-zinc-500 mb-6">
                  Casas de show, agências e produtores de eventos.
                </p>
                <ul className="space-y-3">
                  {contractorBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black"
                        style={{
                          background:
                            "linear-gradient(135deg, #a855f7, #c026d3)",
                          color: "#fff",
                        }}
                      >
                        ✓
                      </span>
                      <span className="text-sm text-zinc-400">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register-contractor"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #c026d3)",
                  }}
                >
                  Cadastrar como contratante →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">
              Por que Music Connect
            </p>
            <h2
              className="max-w-xl text-4xl font-black tracking-tighter sm:text-5xl"
              style={{ lineHeight: 1.05 }}
            >
              Tudo que você precisa,{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24, #f43f5e, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                nada que não precisa
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="fade-in-up group relative overflow-hidden rounded-2xl border border-zinc-800/50 p-6 transition-all duration-300 hover:border-zinc-700/60 hover:-translate-y-0.5"
                style={{
                  animationDelay: `${i * 70}ms`,
                  background: "rgba(14,14,16,0.7)",
                }}
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)",
                    filter: "blur(10px)",
                  }}
                />
                <div className="relative flex items-start gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl border border-zinc-800/60 transition-colors group-hover:border-zinc-700"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-white mb-1.5">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-500">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pb-28">
        <div className="mx-auto max-w-5xl">
          <div
            className="relative overflow-hidden rounded-2xl p-12 md:p-20 text-center"
            style={{
              background: "rgba(14,14,16,0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.03)",
            }}
          >
            {/* Ambient blobs inside CTA */}
            <div
              className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div
              className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(192,38,211,0.08) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            {/* Top gradient line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(244,63,94,0.4), rgba(168,85,247,0.4), transparent)",
              }}
            />

            <div className="relative z-10">
              <h2
                className="text-4xl font-black tracking-tighter sm:text-5xl mb-4"
                style={{ lineHeight: 1.05 }}
              >
                Pronto para subir ao palco?
              </h2>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-500 mb-10">
                Junte-se a centenas de artistas e contratantes que já estão
                transformando a cena musical brasileira.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/profile-selector"
                  className="group inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-sm font-bold text-black transition-all duration-150 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, #fbbf24 0%, #f43f5e 60%, #a855f7 100%)",
                    boxShadow: "0 0 40px rgba(244,63,94,0.25)",
                  }}
                >
                  Criar conta grátis
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 px-8 py-4 text-sm font-semibold text-zinc-400 transition-all duration-150 hover:border-zinc-700 hover:text-white"
                >
                  Explorar artistas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-zinc-900 px-6 md:px-12 lg:px-20 py-10">
        <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-black"
              style={{
                background:
                  "linear-gradient(135deg, #fbbf24 0%, #f43f5e 50%, #a855f7 100%)",
              }}
            >
              M
            </div>
            <span className="text-sm font-black text-white">
              Music<span className="text-zinc-600">Connect</span>
            </span>
          </div>

          <p className="text-[11px] text-zinc-700 order-last sm:order-none">
            © {new Date().getFullYear()} Music Connect. Todos os direitos reservados.
          </p>

          <div className="flex gap-6">
            {["Termos", "Privacidade", "Contato"].map((item) => (
              <span
                key={item}
                className="text-[11px] text-zinc-600 transition-colors hover:text-zinc-400 cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

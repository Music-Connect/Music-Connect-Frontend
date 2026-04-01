"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, Proposta } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import BackButton from "@/components/BackButton";
import {
  FileText,
  Building2,
  Music,
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  Hourglass,
  Printer,
  AlertTriangle,
} from "lucide-react";

const statusConfig = {
  pendente: {
    bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dot: "bg-amber-400",
    label: "Aguardando Assinatura",
    icon: <Hourglass size={14} />,
  },
  aceita: {
    bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
    label: "Contrato Ativo",
    icon: <CheckCircle2 size={14} />,
  },
  recusada: {
    bg: "bg-red-500/10 text-red-400 border-red-500/30",
    dot: "bg-red-400",
    label: "Recusado",
    icon: <XCircle size={14} />,
  },
  cancelada: {
    bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
    dot: "bg-zinc-500",
    label: "Cancelado",
    icon: <XCircle size={14} />,
  },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm">
      <h2 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {title}
        <span className="h-px flex-1 bg-zinc-800/60" />
      </h2>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="mb-0.5 text-[11px] font-medium text-zinc-600">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const { user, sessionLoaded } = useAuthStore();
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const id = Number(params.id);

  useEffect(() => {
    if (!sessionLoaded) return;
    if (!user) {
      router.push("/login");
      return;
    }

    api
      .getPropostaById(id)
      .then(setProposta)
      .catch(() => setError("Proposta não encontrada."))
      .finally(() => setLoading(false));
  }, [id, user, sessionLoaded, router]);

  const handleAction = async (status: "aceita" | "recusada") => {
    if (!proposta) return;
    setActionLoading(true);
    try {
      const updated = await api.updatePropostaStatus(proposta.id_proposta, status);
      setProposta(updated);
    } catch {
      alert("Erro ao atualizar status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!sessionLoaded || !user) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
      </div>
    );
  }

  if (error || !proposta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
        <AlertTriangle size={32} className="text-red-400" />
        <p className="text-sm text-zinc-400">{error || "Proposta não encontrada."}</p>
        <button
          onClick={() => router.push("/proposals")}
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2 text-sm text-zinc-300 hover:text-white"
        >
          Voltar às propostas
        </button>
      </div>
    );
  }

  const isArtist = user.tipo_usuario === "artista";
  const status = statusConfig[proposta.status] || statusConfig.pendente;
  const contractNumber = `MC-${String(proposta.id_proposta).padStart(6, "0")}`;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const createdAtFormatted = formatDate(proposta.created_at);
  const eventDateFormatted = formatDate(proposta.data_evento);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-120 w-120 rounded-full bg-linear-to-tr from-amber-500/4 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <BackButton href="/proposals" />
            <Link href="/">
              <span className="text-lg font-black tracking-tight bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                Music Connect
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${status.bg}`}
            >
              {status.icon}
              {status.label}
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-400 transition-all hover:border-zinc-700 hover:text-white"
            >
              <Printer size={13} /> Imprimir
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-6 print:py-0">

        {/* ── Contract Header ── */}
        <div className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 backdrop-blur-sm text-center">
          <div className="mb-2 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700/60 bg-zinc-800/60">
              <FileText size={22} className="text-zinc-300" />
            </div>
          </div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-600">
            Documento Oficial
          </p>
          <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Contrato de Prestação de Serviços Artísticos
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
            <span>Nº {contractNumber}</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span>Emitido em {createdAtFormatted}</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-bold uppercase ${status.bg}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          {proposta.titulo && (
            <p className="mt-4 text-sm font-semibold text-zinc-300">
              &ldquo;{proposta.titulo}&rdquo;
            </p>
          )}
        </div>

        {/* ── Parties ── */}
        <div
          className="fade-in-up grid grid-cols-1 gap-4 sm:grid-cols-2"
          style={{ animationDelay: "60ms" }}
        >
          {/* Contratante */}
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              <Building2 size={13} /> Parte Contratante
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 ring-2 ring-zinc-700">
                <Building2 size={16} className="text-zinc-400" />
              </div>
              <div>
                <p className="font-bold text-white">{proposta.contratante?.name ?? "—"}</p>
                <p className="text-xs text-zinc-500">Contratante</p>
              </div>
            </div>
            <div className="space-y-3">
              {proposta.nome_responsavel && (
                <Field label="Responsável" value={proposta.nome_responsavel} />
              )}
              {proposta.telefone_contato && (
                <Field label="Telefone de Contato" value={proposta.telefone_contato} />
              )}
            </div>
            {/* Signature */}
            <div className="mt-5 border-t border-zinc-800/60 pt-4">
              <p className="mb-1 text-[11px] font-medium text-zinc-600">Assinatura Digital</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <p className="text-xs text-zinc-400">
                  Assinado digitalmente por{" "}
                  <span className="font-semibold text-zinc-200">
                    {proposta.contratante?.name}
                  </span>
                </p>
              </div>
              <p className="mt-1 text-[10px] text-zinc-600">{createdAtFormatted}</p>
            </div>
          </div>

          {/* Artista */}
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              <Music size={13} /> Parte Contratada
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 ring-2 ring-zinc-700">
                <Music size={16} className="text-zinc-400" />
              </div>
              <div>
                <p className="font-bold text-white">{proposta.artista?.name ?? "—"}</p>
                <p className="text-xs text-zinc-500">
                  Artista
                  {proposta.artista?.genero_musical && (
                    <> · {proposta.artista.genero_musical}</>
                  )}
                </p>
              </div>
            </div>
            {/* Signature */}
            <div className="mt-auto border-t border-zinc-800/60 pt-4">
              <p className="mb-1 text-[11px] font-medium text-zinc-600">Assinatura Digital</p>
              {proposta.status === "aceita" ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <p className="text-xs text-zinc-400">
                      Assinado digitalmente por{" "}
                      <span className="font-semibold text-zinc-200">
                        {proposta.artista?.name}
                      </span>
                    </p>
                  </div>
                  {proposta.updated_at && (
                    <p className="mt-1 text-[10px] text-zinc-600">
                      {formatDate(proposta.updated_at)}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-dashed border-zinc-600" />
                  <p className="text-xs text-zinc-600">
                    {proposta.status === "recusada" || proposta.status === "cancelada"
                      ? "Não assinado — contrato encerrado"
                      : "Aguardando assinatura do artista"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Event Details ── */}
        <div className="fade-in-up" style={{ animationDelay: "100ms" }}>
          <Section title="Objeto do Contrato — Dados do Evento">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60">
                  <Calendar size={15} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-zinc-600">Data do Evento</p>
                  <p className="text-sm font-semibold text-white">{eventDateFormatted}</p>
                  {proposta.hora_evento && (
                    <p className="text-xs text-zinc-500">{proposta.hora_evento}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60">
                  <MapPin size={15} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-zinc-600">Local</p>
                  <p className="text-sm font-semibold text-white">{proposta.local_evento}</p>
                  {proposta.endereco_completo && (
                    <p className="text-xs text-zinc-500">{proposta.endereco_completo}</p>
                  )}
                </div>
              </div>

              {proposta.tipo_evento && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60">
                    <FileText size={15} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-zinc-600">Tipo de Evento</p>
                    <p className="text-sm font-semibold text-white">{proposta.tipo_evento}</p>
                  </div>
                </div>
              )}

              {proposta.duracao_horas && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60">
                    <Clock size={15} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-zinc-600">Duração</p>
                    <p className="text-sm font-semibold text-white">
                      {proposta.duracao_horas}h de apresentação
                    </p>
                  </div>
                </div>
              )}

              {proposta.publico_esperado && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60">
                    <Users size={15} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-zinc-600">Público Esperado</p>
                    <p className="text-sm font-semibold text-white">
                      {proposta.publico_esperado.toLocaleString("pt-BR")} pessoas
                    </p>
                  </div>
                </div>
              )}

              {proposta.equipamento_incluso !== null &&
                proposta.equipamento_incluso !== undefined && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60">
                      {proposta.equipamento_incluso ? (
                        <CheckCircle2 size={15} className="text-emerald-400" />
                      ) : (
                        <XCircle size={15} className="text-zinc-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-zinc-600">Equipamentos</p>
                      <p className="text-sm font-semibold text-white">
                        {proposta.equipamento_incluso
                          ? "Incluídos pelo contratante"
                          : "Por conta do artista"}
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {proposta.descricao && (
              <div className="mt-5 rounded-xl border border-zinc-800/40 bg-zinc-900/30 p-4">
                <p className="mb-1 text-[11px] font-medium text-zinc-600">Descrição do Evento</p>
                <p className="text-sm leading-relaxed text-zinc-300">{proposta.descricao}</p>
              </div>
            )}
          </Section>
        </div>

        {/* ── Financial Terms ── */}
        <div className="fade-in-up" style={{ animationDelay: "130ms" }}>
          <Section title="Condições Financeiras">
            <div className="flex items-center justify-between rounded-xl border border-zinc-800/40 bg-zinc-900/30 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <DollarSign size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-zinc-600">Valor da Contratação</p>
                  <p className="text-2xl font-black text-white tracking-tight">
                    {formatCurrency(proposta.valor_oferecido)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-zinc-600">Condição</p>
                <p className="text-sm font-semibold text-zinc-300">A combinar</p>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Clauses ── */}
        <div className="fade-in-up" style={{ animationDelay: "160ms" }}>
          <Section title="Cláusulas e Condições">
            <ol className="space-y-4 text-sm text-zinc-400 leading-relaxed list-none">
              {[
                {
                  n: "1",
                  title: "Objeto",
                  text: `A parte Contratada obriga-se a prestar serviços artísticos no evento descrito neste contrato, conforme especificações acordadas entre as partes.`,
                },
                {
                  n: "2",
                  title: "Remuneração",
                  text: `A parte Contratante pagará à Contratada o valor de ${formatCurrency(proposta.valor_oferecido)}, mediante acordo das condições de pagamento entre as partes.`,
                },
                {
                  n: "3",
                  title: "Obrigações da Parte Contratada",
                  text: `A Contratada compromete-se a realizar a apresentação artística na data, horário e local estipulados, com pontualidade e qualidade profissional.`,
                },
                {
                  n: "4",
                  title: "Obrigações da Parte Contratante",
                  text: `A Contratante compromete-se a fornecer as condições necessárias para a realização do evento, incluindo${proposta.equipamento_incluso ? " os equipamentos acordados," : ""} acesso ao local e demais recursos combinados.`,
                },
                {
                  n: "5",
                  title: "Cancelamento",
                  text: `Em caso de cancelamento por qualquer das partes, deverá ser comunicado com antecedência mínima de 72 horas, sendo passível de negociação sobre eventuais penalidades.`,
                },
                {
                  n: "6",
                  title: "Foro",
                  text: `As partes elegem a plataforma Music Connect como intermediária para eventuais disputas, e em última instância o foro da comarca do local do evento.`,
                },
              ].map((clause) => (
                <li key={clause.n} className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-zinc-800/60 text-[11px] font-bold text-zinc-500">
                    {clause.n}
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-300">{clause.title}. </span>
                    {clause.text}
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        {/* ── Observations ── */}
        {(proposta.observacoes || proposta.mensagem_resposta) && (
          <div className="fade-in-up" style={{ animationDelay: "180ms" }}>
            <Section title="Observações Adicionais">
              <div className="space-y-4">
                {proposta.observacoes && (
                  <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/30 p-4">
                    <p className="mb-1 text-[11px] font-medium text-zinc-600">
                      Observações do Contratante
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {proposta.observacoes}
                    </p>
                  </div>
                )}
                {proposta.mensagem_resposta && (
                  <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/30 p-4">
                    <p className="mb-1 text-[11px] font-medium text-zinc-600">
                      Mensagem do Artista
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {proposta.mensagem_resposta}
                    </p>
                  </div>
                )}
              </div>
            </Section>
          </div>
        )}

        {/* ── Action Buttons (artista, proposta pendente) ── */}
        {isArtist && proposta.status === "pendente" && (
          <div
            className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm"
            style={{ animationDelay: "200ms" }}
          >
            <p className="mb-1 text-sm font-bold text-white">Assinar Contrato</p>
            <p className="mb-5 text-xs text-zinc-500">
              Ao aceitar, você assina digitalmente este contrato e assume os compromissos descritos
              acima.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("aceita")}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {actionLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Aceitar e Assinar
              </button>
              <button
                onClick={() => handleAction("recusada")}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-6 py-3 text-sm font-bold text-zinc-300 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                <XCircle size={16} />
                Recusar
              </button>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div
          className="fade-in-up pb-6 text-center text-[11px] text-zinc-700"
          style={{ animationDelay: "220ms" }}
        >
          <p>
            Este documento é gerado automaticamente pela plataforma{" "}
            <span className="font-bold text-zinc-600">Music Connect</span> e possui validade
            jurídica como instrumento de contratação digital. Contrato Nº {contractNumber}.
          </p>
        </div>
      </div>
    </div>
  );
}

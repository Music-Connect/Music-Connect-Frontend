export type ProposalStatus = "pendente" | "aceita" | "rejeitada";
export type FilterStatus = "todos" | "pendente" | "aceita" | "rejeitada";

export function getStatusColor(status: ProposalStatus): string {
  switch (status) {
    case "aceita":
      return "#10B981";
    case "rejeitada":
      return "#EF4444";
    case "pendente":
    default:
      return "#F59E0B";
  }
}

export function getStatusLabel(status: ProposalStatus): string {
  switch (status) {
    case "aceita":
      return "Aceita";
    case "rejeitada":
      return "Rejeitada";
    case "pendente":
    default:
      return "Pendente";
  }
}

export function getStatusIcon(status: ProposalStatus): string {
  switch (status) {
    case "aceita":
      return "✅";
    case "rejeitada":
      return "❌";
    case "pendente":
    default:
      return "⏳";
  }
}

export function getFilterLabel(filter: FilterStatus): string {
  switch (filter) {
    case "pendente":
      return "⏳ Pendentes";
    case "aceita":
      return "✅ Aceitas";
    case "rejeitada":
      return "❌ Rejeitadas";
    case "todos":
    default:
      return "Todos";
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

export function formatDateLong(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

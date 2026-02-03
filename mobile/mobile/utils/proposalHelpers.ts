export type ProposalStatus = "pendente" | "aceito" | "recusado";
export type FilterStatus = "todos" | "pendente" | "aceito" | "recusado";

export function getStatusColor(status: ProposalStatus): string {
  switch (status) {
    case "aceito":
      return "#10B981";
    case "recusado":
      return "#EF4444";
    case "pendente":
    default:
      return "#F59E0B";
  }
}

export function getStatusLabel(status: ProposalStatus): string {
  switch (status) {
    case "aceito":
      return "Aceito";
    case "recusado":
      return "Recusado";
    case "pendente":
    default:
      return "Pendente";
  }
}

export function getStatusIcon(status: ProposalStatus): string {
  switch (status) {
    case "aceito":
      return "✅";
    case "recusado":
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
    case "aceito":
      return "✅ Aceitos";
    case "recusado":
      return "❌ Recusados";
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

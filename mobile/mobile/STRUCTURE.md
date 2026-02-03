# Estrutura do Projeto Mobile - Music Connect

## 📁 Organização de Pastas

```
mobile/
├── app/                           # Rotas e screens principais
│   ├── (tabs)/                   # Abas do app (Dashboard, Explore, Profile)
│   ├── artist/                   # Perfil público de artista
│   ├── proposal/                 # Detalhes da proposta recebida
│   ├── proposal-sent/            # Detalhes da proposta enviada
│   ├── index.tsx                 # Landing page
│   ├── login.tsx                 # Login
│   ├── profile-selector.tsx      # Seleção Artista/Contratante
│   ├── register-artist.tsx       # Cadastro Artista
│   ├── register-contractor.tsx   # Cadastro Contratante
│   ├── forgot-password.tsx       # Recuperação de senha
│   ├── proposals-sent.tsx        # Lista de propostas enviadas
│   ├── settings.tsx              # Configurações
│   └── _layout.tsx               # Layout raiz
│
├── components/                    # Componentes reutilizáveis
│   └── shared/
│       ├── Header.tsx            # Header padrão
│       ├── Button.tsx            # Botão com variantes
│       ├── Card.tsx              # Card padrão
│       └── Badge.tsx             # Badge com variantes
│
├── hooks/                         # Hooks customizados
│   ├── useFormState.ts           # Gerenciar estado de formulário
│   └── useConfirm.ts             # Dialog de confirmação
│
├── utils/                         # Utilitários e helpers
│   ├── proposalHelpers.ts        # Funções para propostas
│   └── theme.ts                  # Cores, spacing, fonts
│
├── constants/
│   └── mockData.ts               # Dados mock
│
└── package.json
```

## 🎨 Componentes Disponíveis

### Header

```tsx
import Header from "@/components/shared/Header";

<Header
  title="Minhas Propostas"
  showBack={true}
  rightComponent={<View>...</View>}
/>;
```

### Button

```tsx
import Button from "@/components/shared/Button";

<Button
  label="Enviar"
  onPress={() => {}}
  variant="primary" // primary | secondary | danger | outline
  icon="📤"
/>;
```

### Card

```tsx
import Card from "@/components/shared/Card";

<Card variant="default">
  <Text>Conteúdo do card</Text>
</Card>;
```

### Badge

```tsx
import Badge from "@/components/shared/Badge";

<Badge
  label="Aceito"
  variant="success" // info | success | warning | error
  icon="✅"
/>;
```

## 🔧 Hooks Disponíveis

### useFormState

```tsx
import { useFormState } from "@/hooks/useFormState";

const { form, handleChange, reset } = useFormState({
  nome: "",
  email: "",
});

handleChange("nome", "João");
```

### useConfirm

```tsx
import { useConfirm } from "@/hooks/useConfirm";

const { confirm } = useConfirm();

confirm(
  {
    title: "Deletar?",
    message: "Tem certeza?",
    isDangerous: true,
  },
  () => console.log("Confirmado"),
  () => console.log("Cancelado"),
);
```

## 🎯 Utilitários

### Helpers de Proposta

```tsx
import {
  getStatusColor,
  getStatusLabel,
  formatDate,
} from "@/utils/proposalHelpers";

const color = getStatusColor("aceito"); // #10B981
const label = getStatusLabel("aceito"); // "Aceito"
const data = formatDate("2026-03-15"); // "domingo, 15 de março de 2026"
```

### Theme

```tsx
import { COLORS, SPACING, FONT_SIZE } from "@/utils/theme";

<View style={{ paddingHorizontal: SPACING.lg }}>
  <Text style={{ color: COLORS.primary, fontSize: FONT_SIZE.xl }}>Texto</Text>
</View>;
```

## 📝 Boas Práticas

1. **Use componentes compartilhados** em vez de duplicar código
2. **Use hooks customizados** para lógica reutilizável
3. **Use utilities** para constantes e helpers
4. **Mantenha screens limpas** movendo lógica para hooks/utils
5. **Importe do path alias** (@/components, @/hooks, etc)

## 🚀 Próximos Passos

- [ ] Refatorar screens existentes para usar novos componentes
- [ ] Criar mais componentes (Input, Select, Modal, etc)
- [ ] Adicionar mais hooks (useAsync, usePagination, etc)
- [ ] Adicionar testes unitários
- [ ] Melhorar tipos com TypeScript

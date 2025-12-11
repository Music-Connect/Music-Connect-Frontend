export function RegisterDataValidator({
  email,
  password,
  confirmarSenha,
  usuario,
}: any) {
  if (!email) throw new Error("O email é obrigatório.");
  if (!usuario) throw new Error("O nome de usuário é obrigatório.");
  if (password !== confirmarSenha) throw new Error("As senhas não conferem.");
}

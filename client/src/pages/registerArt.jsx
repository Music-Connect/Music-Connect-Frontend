import { useState } from "react";
import Center from "../components/layout/Center";
import Input from "../components/layout/Input";
import Title from "../components/layout/Title";

function ResgisterArt() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmarSenha: "",
    usuario: "",
    telefone: "",
    local: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log("Dados do formulário para enviar:", formData);
    alert("Cadastro enviado com sucesso!");
  };

  return (
    <Center>
      <Title title={"Cadastrar Artista"}></Title>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex flex-col gap-5"
      >
        <Input
          label="Coloque seu email:"
          id="email"
          name="email"
          type="email"
          description="example@mail.com"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Coloque sua senha:"
          id="password"
          name="password"
          type="password"
          description="********"
          value={formData.password}
          onChange={handleChange}
        />

        <Input
          label="Coloque sua senha novamente:"
          id="confirmarSenha"
          name="confirmarSenha"
          type="password"
          description="********"
          value={formData.confirmarSenha}
          onChange={handleChange}
        />

        <Input
          label="Usuario:"
          id="usuario"
          name="usuario"
          type="text"
          description="Seu nome de usuário"
          value={formData.usuario}
          onChange={handleChange}
        />
        <Input
          label="Telefone de contato:"
          id="telefone"
          name="telefone"
          type="tel"
          description="## #####-####"
          value={formData.telefone}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full mt-6 bg-linear-to-r from-yellow-300 to-pink-400 text-black font-bold py-3 
          rounded-full hover:opacity-50 transition text-2xl"
        >
          Registrar
        </button>
      </form>
    </Center>
  );
}

export default ResgisterArt;

import { useEffect, useContext } from "react";

import logoImg from "../../assets/drivexLogo.png";

import { Link, useNavigate } from "react-router-dom";
import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLoginBoxLine } from "react-icons/ri";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/authContext";

import toast from "react-hot-toast";

const schema = z.object({
  email: z
    .string()
    .email("Por favor, insira um e-mail válido.")
    .nonempty("O campo de e-mail é obrigatório."),
  password: z.string().nonempty("O campo de senha é obrigatório."),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const { user } = useContext(AuthContext);
  console.log(user);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login bem-sucedido");
        console.log(user);
        const displayName = user?.displayName || "Usuário";
        toast.success(`Bem-vindo(a), ${displayName}!`, {
          style: {
            fontSize: "14px",
          },
        });
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Email ou senha incorretos!\nVerifique suas credenciais.");
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img
            src={logoImg}
            alt="Logo DriveX"
            className="w-48 h-auto mx-auto"
          />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3 text-center">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-mainRed hover:bg-mainRedLighter w-full rounded-md text-white h-10 font-medium flex items-center justify-center gap-2 transition-all duration-200 ease-linear"
          >
            Acessar <RiLoginBoxLine size={24} color="#FFF" />
          </button>
        </form>

        <Link
          to="/register"
          className="hover:underline transition-all duration-200 ease-linear text-center"
        >
          Ainda não possui uma conta? Faça o cadastro!
        </Link>
      </div>
    </Container>
  );
}

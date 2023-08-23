import { Link } from "react-router-dom";
import { FaLinkedinIn, FaGithub, FaEnvelope } from "react-icons/fa";
import logoImg from "../../assets/drivexLogo.png";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white up-shadow w-full mt-8 ">
      <footer className="max-w-7xl mx-auto py-4">
        <div className="flex flex-col items-center md:flex-row justify-between px-4">
          <div className="mb-4 md:mb-0">
            <Link to="/">
              <img src={logoImg} alt="Logo DriveX" className="w-32 h-auto" />
            </Link>
          </div>
          <div className="text-center text-zinc-700">
            <p className="mt-2 font-medium">
              &copy; {new Date().getFullYear()} DriveX. Todos os direitos
              reservados - Criado por Guilherme Bustamante.
            </p>
            <div className="mt-2 space-x-4">
              <Link
                to="/"
                className="text-gray-500 hover:text-mainRed transition-colors duration-200"
              >
                Catálogo
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-mainRed transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/new"
                className="text-gray-500 hover:text-mainRed transition-colors duration-200"
              >
                Cadastro de Veículos
              </Link>
              <button
                onClick={scrollToTop}
                className="text-gray-500 hover:text-mainRed transition-colors duration-200 focus:outline-none"
              >
                Voltar para o topo
              </button>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.linkedin.com/in/gui-bus/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn
                size={24}
                className="text-zinc-700 hover:text-mainRed transition-colors duration-200"
              />
            </a>
            <a
              href="https://github.com/gui-bus"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub
                size={24}
                className="text-zinc-700 hover:text-mainRed transition-colors duration-200"
              />
            </a>
            <a href="mailto:guibus.dev@gmail.com">
              <FaEnvelope
                size={24}
                className="text-zinc-700 hover:text-mainRed transition-colors duration-200"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";
import { FaLinkedinIn, FaGithub, FaEnvelope } from "react-icons/fa";
import logoImg from "../../assets/drivexLogo.png";

export function Footer() {
  return (
    <div className="bg-white up-shadow w-full mt-4">
      <footer className="max-w-7xl mx-auto py-4">
        <div className="flex flex-col items-center md:flex-row justify-between px-4">
          <div className="mb-4 md:mb-0">
            <Link to="/">
              <img src={logoImg} alt="Logo DriveX" className="w-36 h-auto" />
            </Link>
          </div>
          <div className="text-center mb-5 md:mb-0">
            <p className="text-darkGray ">
              Compre e venda veículos com segurança e facilidade na DriveX.
            </p>
            <div className="mt-2">
              <Link
                to="/"
                className="text-blue-500 hover:underline transition-colors duration-200"
              >
                Termos de Uso
              </Link>{" "}
              |{" "}
              <Link
                to="/"
                className="text-blue-500 hover:underline transition-colors duration-200"
              >
                Política de Privacidade
              </Link>
            </div>
            <p className="text-center text-darkGray mt-2">
              &copy; {new Date().getFullYear()} DriveX. Todos os direitos
              reservados.
            </p>
          </div>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="https://www.linkedin.com/in/gui-bus/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 rounded-full p-2 border-darkGray transition-colors duration-200 ease-linear hover:bg-lightGray"
            >
              <FaLinkedinIn size={20} color="#222423" />
            </a>
            <a
              href="https://github.com/gui-bus"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 rounded-full p-2 border-darkGray transition-colors duration-200 ease-linear hover:bg-lightGray"
            >
              <FaGithub size={20} color="#222423" />
            </a>
            <a
              href="mailto:guibus.dev@gmail.com"
              className="border-2 rounded-full p-2 border-darkGray transition-colors duration-200 ease-linear hover:bg-lightGray"
            >
              <FaEnvelope size={20} color="#222423" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

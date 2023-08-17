import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import logoImg from "../../assets/drivexLogo.png";

export function Header() {
  const { signed, loadingAuth } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow-md mb-8">
      <header className="flex w-full max-w-7xl items-center justify-around md:justify-between px-4 mx-auto">
        <Link to="/">
          <img src={logoImg} alt="Logo DriveX" className="w-32 h-auto" />
        </Link>

        {/* Se não estiver no loading e estiver logado renderiza o FiUser */}
        {!loadingAuth && signed && (
          <Link to="/dashboard" className="flex justify-center items-center gap-1 font-medium  bg-mainRed hover:bg-mainRedLighter px-3 rounded-md text-white h-10 transition-all duration-200 ease-in-out">
          Dashboard
          <AiOutlineDashboard size={24}  />
        </Link>
        )}

        {/* Se não estiver no loading e nem logado renderiza o FiLogIn */}
        {!loadingAuth && !signed && (
          <Link to="/login" className="flex justify-center items-center gap-1 font-medium  bg-mainRed hover:bg-mainRedLighter px-3 rounded-md text-white h-10 transition-all duration-200 ease-in-out">
            Entrar
            <FiLogIn size={24}  />
          </Link>
        )}
      </header>
    </div>
  );
}

import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi";

import logoImg from "../../assets/drivexLogo.png";

export function Header() {
  const signed = true;
  const loadingAuth = false;

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow-md mb-4">
      <header className="flex w-full max-w-7xl items-center justify-around md:justify-between px-4 mx-auto">
        <Link to="/">
          <img src={logoImg} alt="Logo DriveX" className="w-32 h-auto" />
        </Link>

        {/* Se não estiver no loading e estiver logado renderiza o FiUser */}
        {!loadingAuth && signed && (
          <Link to="/dashboard">
            <div className="border-2 rounded-full p-2 border-darkGray transition-colors duration-200 ease-linear hover:bg-lightGray">
              <FiUser size={24} color="#222423" />
            </div>
          </Link>
        )}

        {/* Se não estiver no loading e nem logado renderiza o FiLogIn */}
        {!loadingAuth && !signed && (
          <Link to="/login">
            <div className="border-2 rounded-full p-2 border-darkGray transition-colors duration-200 ease-linear hover:bg-lightGray">
              <FiLogIn size={24} color="#222423" />
            </div>
          </Link>
        )}
      </header>
    </div>
  );
}

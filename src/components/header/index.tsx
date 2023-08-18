import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { Link } from "react-router-dom";

import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";
import { GrConfigure } from "react-icons/gr";
import { GoChecklist } from "react-icons/go";

import logoImg from "../../assets/drivexLogo.png";

import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

export function Header() {
  async function handleLogout() {
    await signOut(auth);
  }
  const { signed, loadingAuth } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center md:h-16 py-2 bg-white drop-shadow-md mb-5">
      <header className="flex w-full max-w-7xl items-center justify-around md:justify-between px-4 mx-auto relative">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <Link to="/">
            <img
              src={logoImg}
              alt="Logo DriveX"
              className="w-32 h-auto mt-2 md:mt-0"
            />
          </Link>

          <div className="flex mt-2 md:mt-0 md:absolute md:right-0 md:px-4">
            {/* Se não estiver no loading e estiver logado renderiza o FiUser */}
            {!loadingAuth && signed && (
              <Link
                to="/"
                className="border-1 rounded-full px-3 py-2 border-gray-900 transition-all duration-300 ease-in-out hover:bg-gray-100 mr-1 font-medium flex gap-2 items-center justify-center text-sm md:text-base hover:scale-105"
              >
                Catalogo <GoChecklist size={24} />
              </Link>
            )}
            {!loadingAuth && signed && (
              <Link
                to="/dashboard"
                className="border-1 rounded-full px-3 py-2 border-gray-900 transition-all duration-300 ease-in-out hover:bg-gray-100 mr-1 font-medium flex gap-1 items-center justify-center text-sm md:text-base  hover:scale-105"
              >
                Menu <GrConfigure size={24} />
              </Link>
            )}
            {!loadingAuth && signed && (
              <button
                className="border-1 rounded-full px-3 py-2 border-gray-900 transition-all duration-300 ease-in-out hover:bg-gray-100 font-medium flex gap-1 items-center justify-center text-sm md:text-base hover:scale-105"
                onClick={handleLogout}
              >
                Logout <RiLogoutBoxLine size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Se não estiver no loading e nem logado renderiza o FiLogIn */}
        {!loadingAuth && !signed && (
          <Link
            to="/login"
            className="border-1 rounded-full px-3 py-2 border-gray-900 transition-all duration-300 ease-in-out hover:bg-gray-100 font-medium flex gap-1 items-center justify-center text-sm md:text-base hover:scale-105"
          >
            Login <RiLoginBoxLine size={24} />
          </Link>
        )}
      </header>
    </div>
  );
}

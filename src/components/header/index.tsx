import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import logoImg from "../../assets/drivexLogo.png";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import toast from "react-hot-toast";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signed, loadingAuth } = useContext(AuthContext);

  async function handleLogout() {
    await signOut(auth);
    toast.success("Logout realizado. Até a próxima!", {
      style: {
        fontSize: "14px",
      },
    });
    setMenuOpen(false); // Fechar o menu após o logout
  }

  function closeMenu() {
    setMenuOpen(false); // Função para fechar o menu
  }

  return (
    <header className="bg-white shadow-md mb-5 font-medium">
      <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-8">
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="Logo DriveX" className="w-32 h-auto" />
        </Link>
        {signed ? (
          <div className="hidden md:flex space-x-4">
            <Link
              to="/"
              className="flex gap-1 px-3 py-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800"
            >
              Catalogo
            </Link>
            <Link
              to="/dashboard"
              className="flex gap-1 px-3 py-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex gap-1 px-3 py-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800"
            >
              Logout <RiLogoutBoxLine size={24} />
            </button>
          </div>
        ) : (
          !loadingAuth && (
            <Link
              to="/login"
              className="flex gap-1 px-3 py-2 hover:bg-gray-100 rounded-full ml-auto"
            >
              Login <RiLoginBoxLine size={24} />
            </Link>
          )
        )}

        {/* Menu Hamburger para dispositivos móveis */}
        {signed && (
          <div className="md:hidden">
            <button
              className="text-gray-600 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <GiHamburgerMenu className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <nav className="bg-white p-4 md:hidden flex flex-col">
          {signed && (
            <Link
              to="/"
              onClick={closeMenu}
              className="px-3 py-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800 flex gap-2 items-center justify-center"
            >
              Catalogo
            </Link>
          )}
          {signed && (
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="px-3 py-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800 flex gap-2 items-center justify-center"
            >
              Dashboard 
            </Link>
          )}
          {signed && (
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="px-3 py-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800 flex gap-2 items-center justify-center"
            >
              Logout <RiLogoutBoxLine size={24} />
            </button>
          )}
        </nav>
      )}
    </header>
  );
}

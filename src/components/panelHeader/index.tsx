import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { FiLogOut } from "react-icons/fi";
import { GiCarKey } from "react-icons/gi";

export function DashboardHeader() {
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="w-full flex h-10 rounded-lg font-medium gap-4 px-4 mb-4 text-sm md:text-base items-center justify-between bg-mainRed text-white">
      <Link
        className="flex items-center justify-center gap-2 hover:underline transform transition-transform duration-300 ease-in-out"
        to="/dashboard/new"
      >
        Cadastrar veículo <GiCarKey size={24} />
      </Link>

      <button
        className="flex items-center justify-center gap-2 hover:underline transform transition-transform duration-300 ease-in-out"
        onClick={handleLogout}
      >
        Sair <FiLogOut size={24} />
      </button>
    </div>
  );
}

import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";

export function DashboardHeader() {
 

  return (
    <div className="w-full flex font-medium mb-4 text-sm md:text-base items-center justify-between text-white">
      <Link
        className="flex items-center justify-center gap-2 hover:underline transform transition-transform duration-300 ease-in-out bg-mainRed px-4 py-2 rounded-lg h-10"
        to="/dashboard/new"
      >
        Cadastrar veículo <IoIosAddCircleOutline size={24} />
      </Link>
    </div>
  );
}

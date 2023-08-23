import { Link } from "react-router-dom";

export function DashboardHeader() {
 

  return (
    <div className="w-full flex flex-col font-medium text-sm md:text-base items-center justify-center text-white my-5">
      <Link
        className="flex items-center justify-center gap-2 hover:bg-mainRedLighter transform transition-transform duration-300 ease-in-out bg-mainRed px-4 py-2 rounded-md h-10"
        to="/dashboard/new"
      >
        Cadastrar novo veículo
      </Link>
    </div>
  );
}

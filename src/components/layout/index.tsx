import { Header } from "../header";
import { Footer } from "../footer";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

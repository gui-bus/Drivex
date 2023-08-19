import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps): any {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
    return (
      <div className="loading-container">
        <BarLoader color={"#DC3237"} loading={loadingAuth} />
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/login" />;
  }

  return children;
}

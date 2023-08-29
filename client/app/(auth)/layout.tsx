import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="h-full bg-red-50">{children}</div>;
};

export default AuthLayout;

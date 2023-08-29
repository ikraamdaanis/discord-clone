import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex h-full justify-center">{children}</div>;
};

export default AuthLayout;

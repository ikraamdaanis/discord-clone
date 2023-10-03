import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-full items-center justify-center bg-backgroundDark bg-[url('/background.webp')]">
      {children}
    </div>
  );
};

export default AuthLayout;

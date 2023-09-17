import { NavigationSidebar } from "components/navigation/navigation-sidebar";
import { ReactNode } from "react";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full">
      <NavigationSidebar />
      <main className="h-full md:pl-[72px]">{children}</main>
    </div>
  );
};

export default MainLayout;

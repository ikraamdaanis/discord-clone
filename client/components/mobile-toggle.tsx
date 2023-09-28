import { NavigationSidebar } from "components/navigation/NavigationSidebar";
import { ServerSidebar } from "components/server/server-sidebar";
import { Button } from "components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "components/ui/sheet";
import { Menu } from "lucide-react";

export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

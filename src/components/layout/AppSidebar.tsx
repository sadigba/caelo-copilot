
import { Settings, User, LogOut, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent outline-none">
            <Avatar className="h-6 w-6">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">John</span>
            <ChevronDown className="h-3 w-3 ml-auto text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Manage Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <div className="text-sm text-muted-foreground pt-4">
          Caelo AI Co-Pilot v1.0
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-sm text-muted-foreground">
          Caelo AI Co-Pilot v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

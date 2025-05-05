
import { FileText, Settings, MessageSquare, FilePlus, User, LogOut, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useCaeloChat } from "@/hooks/use-caelo-chat";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Menu items
const mainItems = [
  {
    title: "Applications",
    url: "/",
    icon: FileText, // Using FileText icon for "Applications" as shown in the image
  },
];

const managementItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { toggleCaeloChat } = useCaeloChat();
  
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="px-6 py-5 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1.5 hover:bg-accent outline-none">
            <Avatar className="h-8 w-8 bg-muted">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <span className="text-lg font-medium">John</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
        <SidebarMenuItem className="mb-1">
          <SidebarMenuButton asChild>
            <Link to="/new-loan" className="flex items-center text-sm">
              <FilePlus className="mr-2 h-4 w-4" />
              <span>New Application</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleCaeloChat} className="cursor-pointer">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  <span>Ask Caelo</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Caelo AI Co-Pilot v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}


import { Home, FileText, Settings, MessageSquare, Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";

// Menu items
const mainItems = [
  {
    title: "Applications",
    url: "/",
    icon: Home,
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
        <div className="flex items-center space-x-2">
          <div className="bg-caelo-600 w-8 h-8 rounded-md flex items-center justify-center text-white font-bold">C</div>
          <span className="text-xl font-bold">Caelo</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenuItem className="mb-1">
          <SidebarMenuButton asChild>
            <Link to="/new-loan" className="flex items-center text-sm">
              <Plus className="mr-2 h-4 w-4" />
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

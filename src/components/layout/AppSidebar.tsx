
import { Plus, FileText, LibraryBig, MessageCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

// Menu items updated to match the image
const mainItems = [
  {
    title: "New",
    url: "/new-loan",
    icon: Plus,
  },
  {
    title: "Documents",
    url: "/",
    icon: FileText,
  },
  {
    title: "Library",
    url: "/",
    icon: LibraryBig,
  },
  {
    title: "AI Chat",
    url: "/",
    icon: MessageCircle,
  },
];

export function AppSidebar() {
  const location = useLocation();
  
  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  }

  return (
    <Sidebar className="border-r w-64">
      <SidebarHeader className="px-6 py-5 border-b flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-medium">S</span>
          <span className="text-xl font-medium">Caelo</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url} 
                      className={`flex items-center px-4 py-2 rounded-md ${
                        isActive(item.url) 
                          ? "bg-modern-light-gray text-modern-purple font-medium" 
                          : "text-modern-dark-gray hover:bg-modern-light-gray"
                      }`}
                    >
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
      <SidebarFooter className="p-4 mt-auto border-t">
        <div className="flex items-center space-x-2 px-4 py-2 bg-modern-light-gray rounded-md text-modern-dark-gray">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-modern-purple text-white font-bold text-xs">
            W
          </div>
          <span className="text-sm font-medium">Web Extension</span>
          <span className="text-xs bg-modern-mid-gray px-2 py-0.5 rounded ml-auto">BETA</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

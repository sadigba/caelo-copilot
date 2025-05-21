import { FileText, Settings, FilePlus, User, LogOut, ChevronDown, Workflow } from "lucide-react";
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
import { Link, useLocation } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
    title: "Workflow Builder",
    url: "/workflow-builder",
    icon: Workflow,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Function to check if a menu item is active
  const isActive = (path: string): boolean => {
    if (path === '/') {
      // Only highlight home when we're exactly at root
      return currentPath === '/';
    }
    // For other paths, check if the current path starts with the item's path
    return currentPath.startsWith(path);
  };
  
  // Function to determine if we're on the new loan page
  const isNewLoanActive = currentPath === '/new-loan';
  
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="py-3 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <span>John</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Manage Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenuItem className="mb-1">
          <SidebarMenuButton asChild>
            <Link 
              to="/new-loan" 
              className={cn(
                "flex items-center text-sm", 
                isNewLoanActive ? "bg-accent text-accent-foreground font-medium rounded-md" : ""
              )}
            >
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
                    <Link 
                      to={item.url} 
                      className={cn(
                        "flex items-center",
                        isActive(item.url) ? "bg-accent text-accent-foreground font-medium rounded-md" : ""
                      )}
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
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url} 
                      className={cn(
                        "flex items-center",
                        isActive(item.url) ? "bg-accent text-accent-foreground font-medium rounded-md" : ""
                      )}
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
      <SidebarFooter className="p-4">
        <div className="text-sm text-muted-foreground">
          Caelo AI Co-Pilot v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

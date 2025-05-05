
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Settings, Download, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <header className="border-b h-14 flex items-center justify-between px-4 bg-white">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <ChevronLeft className="h-5 w-5 text-gray-500" />
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            <h1 className="text-base font-medium">Library</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="default" 
              className="bg-modern-purple hover:bg-modern-light-purple text-white gap-2"
            >
              <Zap className="h-4 w-4" /> See Pricing
            </Button>
            <Button variant="outline" className="text-modern-dark-gray gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline" className="text-modern-dark-gray gap-2">
              Publish
            </Button>
            <Settings className="h-5 w-5 ml-2 text-gray-500" />
          </div>
        </header>
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1 bg-modern-light-gray">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

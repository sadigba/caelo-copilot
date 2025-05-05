
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AIChatSidebar } from "../caelo/AIChatSidebar";
import { AIChatPopup } from "../caelo/AIChatPopup";
import { useCaeloChat } from "@/hooks/use-caelo-chat";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isChatOpen, closeCaeloChat, layoutMode } = useCaeloChat();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1">
            {children}
          </main>
          
          {/* Render the appropriate chat interface based on layout mode */}
          {layoutMode === "sidebar" ? (
            <AIChatSidebar isOpen={isChatOpen} onClose={closeCaeloChat} />
          ) : (
            <AIChatPopup />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}

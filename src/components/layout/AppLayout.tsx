
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AIChatSidebar } from "../caelo/AIChatSidebar";
import { useCaeloChat } from "@/hooks/use-caelo-chat";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isChatOpen, closeCaeloChat } = useCaeloChat();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1">
            {children}
          </main>
          <AIChatSidebar isOpen={isChatOpen} onClose={closeCaeloChat} />
        </div>
      </div>
    </SidebarProvider>
  );
}

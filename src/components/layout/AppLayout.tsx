
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
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
        <div className="flex flex-1">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <AIChatSidebar isOpen={isChatOpen} onClose={closeCaeloChat} />
        </div>
      </div>
    </SidebarProvider>
  );
}

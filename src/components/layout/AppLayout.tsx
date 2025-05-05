
import { TopBar } from "./TopBar";
import { AIChatSidebar } from "../caelo/AIChatSidebar";
import { useCaeloChat } from "@/hooks/use-caelo-chat";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isChatOpen, closeCaeloChat } = useCaeloChat();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopBar />
        <div className="flex flex-1">
          <main className="flex-1">
            {children}
          </main>
          <AIChatSidebar isOpen={isChatOpen} onClose={closeCaeloChat} />
        </div>
      </div>
    </SidebarProvider>
  );
}

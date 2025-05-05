
import { TopBar } from "./TopBar";
import { AIChatSidebar } from "../caelo/AIChatSidebar";
import { useCaeloChat } from "@/hooks/use-caelo-chat";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isChatOpen, closeCaeloChat } = useCaeloChat();

  return (
    <div className="min-h-screen flex flex-col w-full">
      <TopBar />
      <div className="flex flex-1 w-full">
        {/* Removed the AppSidebar component */}
        <main className="flex-1 relative">
          {children}
        </main>
        <AIChatSidebar isOpen={isChatOpen} onClose={closeCaeloChat} />
      </div>
    </div>
  );
}

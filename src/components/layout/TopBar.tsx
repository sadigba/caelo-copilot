
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useCaeloChat } from "@/hooks/use-caelo-chat";

export function TopBar() {
  const { toggleCaeloChat } = useCaeloChat();

  return (
    <div className="h-14 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center">
        {/* Left side content would go here */}
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          onClick={toggleCaeloChat} 
          className="flex items-center gap-2"
          size="sm"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Ask Caelo</span>
        </Button>
      </div>
    </div>
  );
}

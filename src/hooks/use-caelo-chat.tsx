
import React, { createContext, useContext, useState, useEffect } from "react";

type ChatLayoutMode = "popup" | "sidebar";

interface CaeloChatContextType {
  isChatOpen: boolean;
  layoutMode: ChatLayoutMode;
  openCaeloChat: () => void;
  closeCaeloChat: () => void;
  toggleCaeloChat: () => void;
  toggleLayoutMode: () => void;
}

const CaeloChatContext = createContext<CaeloChatContextType>({
  isChatOpen: false,
  layoutMode: "popup",
  openCaeloChat: () => {},
  closeCaeloChat: () => {},
  toggleCaeloChat: () => {},
  toggleLayoutMode: () => {},
});

export function CaeloChatProvider({ children }: { children: React.ReactNode }) {
  // Use localStorage to persist chat open state across page navigation
  const storedIsOpen = localStorage.getItem('caelo-chat-open') === 'true';
  const storedLayoutMode = localStorage.getItem('caelo-chat-layout') as ChatLayoutMode || "popup";
  
  const [isChatOpen, setIsChatOpen] = useState(storedIsOpen);
  const [layoutMode, setLayoutMode] = useState<ChatLayoutMode>(storedLayoutMode);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('caelo-chat-open', isChatOpen.toString());
  }, [isChatOpen]);

  useEffect(() => {
    localStorage.setItem('caelo-chat-layout', layoutMode);
  }, [layoutMode]);

  const openCaeloChat = () => setIsChatOpen(true);
  const closeCaeloChat = () => setIsChatOpen(false);
  const toggleCaeloChat = () => setIsChatOpen(prev => !prev);
  const toggleLayoutMode = () => setLayoutMode(prev => prev === "popup" ? "sidebar" : "popup");

  return (
    <CaeloChatContext.Provider 
      value={{ 
        isChatOpen, 
        layoutMode,
        openCaeloChat, 
        closeCaeloChat, 
        toggleCaeloChat,
        toggleLayoutMode
      }}
    >
      {children}
    </CaeloChatContext.Provider>
  );
}

export function useCaeloChat() {
  const context = useContext(CaeloChatContext);
  if (context === undefined) {
    throw new Error("useCaeloChat must be used within a CaeloChatProvider");
  }
  return context;
}

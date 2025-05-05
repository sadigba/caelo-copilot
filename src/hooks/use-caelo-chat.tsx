
import React, { createContext, useContext, useState } from "react";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<ChatLayoutMode>("popup");

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

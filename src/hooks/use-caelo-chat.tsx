
import React, { createContext, useContext, useState } from "react";

interface CaeloChatContextType {
  isChatOpen: boolean;
  openCaeloChat: () => void;
  closeCaeloChat: () => void;
  toggleCaeloChat: () => void;
  layoutMode: "sidebar" | "popup"; // Add this property
  toggleLayoutMode: () => void;    // Add this method
}

const CaeloChatContext = createContext<CaeloChatContextType>({
  isChatOpen: false,
  openCaeloChat: () => {},
  closeCaeloChat: () => {},
  toggleCaeloChat: () => {},
  layoutMode: "sidebar",           // Default layout mode
  toggleLayoutMode: () => {},      // Default implementation
});

export function CaeloChatProvider({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"sidebar" | "popup">("sidebar");

  const openCaeloChat = () => setIsChatOpen(true);
  const closeCaeloChat = () => setIsChatOpen(false);
  const toggleCaeloChat = () => setIsChatOpen(prev => !prev);
  const toggleLayoutMode = () => setLayoutMode(prev => prev === "sidebar" ? "popup" : "sidebar");

  return (
    <CaeloChatContext.Provider 
      value={{ 
        isChatOpen,
        openCaeloChat, 
        closeCaeloChat, 
        toggleCaeloChat,
        layoutMode,
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

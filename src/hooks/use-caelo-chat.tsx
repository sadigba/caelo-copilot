
import React, { createContext, useContext, useState } from "react";

interface CaeloChatContextType {
  isChatOpen: boolean;
  openCaeloChat: () => void;
  closeCaeloChat: () => void;
  toggleCaeloChat: () => void;
}

const CaeloChatContext = createContext<CaeloChatContextType>({
  isChatOpen: false,
  openCaeloChat: () => {},
  closeCaeloChat: () => {},
  toggleCaeloChat: () => {},
});

export function CaeloChatProvider({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openCaeloChat = () => setIsChatOpen(true);
  const closeCaeloChat = () => setIsChatOpen(false);
  const toggleCaeloChat = () => setIsChatOpen(prev => !prev);

  return (
    <CaeloChatContext.Provider 
      value={{ 
        isChatOpen, 
        openCaeloChat, 
        closeCaeloChat, 
        toggleCaeloChat 
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


import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Plus, 
  X, 
  SendHorizontal, 
  PaperclipIcon, 
  MessageSquare
} from "lucide-react";
import { useCaeloChat } from "@/hooks/use-caelo-chat";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatSidebar({ isOpen, onClose }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { toggleLayoutMode } = useCaeloChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiResponse: Message = {
        type: 'ai',
        content: `Here's some information about your question regarding "${inputValue}"`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <Sidebar side="right" variant="sidebar" className="border-l z-20">
      <SidebarHeader className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Ask Caelo</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="History">
              <Clock className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" title="New Chat">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} title="Close">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {message.content}
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center p-4">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">Ask Caelo</h3>
            <p className="text-muted-foreground mt-2">
              Ask any questions about the loan in front of you, property documents, or whatever information you might need.
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2 border rounded-md pl-4 pr-2 py-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Caelo a question..."
            className="border-0 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button onClick={handleSend} size="icon" className="h-8 w-8">
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

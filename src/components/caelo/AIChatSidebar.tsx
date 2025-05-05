
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Plus, 
  X, 
  SendHorizontal, 
  PaperclipIcon, 
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";
import { useCaeloChat } from "@/hooks/use-caelo-chat";
import { Separator } from "@/components/ui/separator";

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
  
  // Example prompts
  const researchPrompts = [
    { title: "Find research ideas for the", placeholder: "topic" },
    { title: "Explain in simple words this", placeholder: "concept" }
  ];

  const writingPrompts = [
    { title: "Help me outline a paper on", placeholder: "topic" },
    { title: "Review my draft for clarity - what parts might confuse readers?" },
    { title: "Check for overuse of passive voice" },
    { title: "Check for technical language" },
    { title: "Draft an abstract and keywords for this document" }
  ];

  return (
    <Sidebar side="right" variant="floating" className="border-l z-20 w-[380px]">
      <SidebarHeader className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-5 w-5" />
            <span className="font-medium text-lg">AI Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" title="History">
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="New Chat">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" title="Close">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="space-y-8 py-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Research questions</h3>
              {researchPrompts.map((prompt, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="w-full justify-start h-auto p-4 text-base font-normal"
                  onClick={() => setInputValue(`${prompt.title} ${prompt.placeholder}`)}
                >
                  {prompt.title} <span className="text-muted-foreground ml-1">{prompt.placeholder}</span>
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Writing help</h3>
              {writingPrompts.map((prompt, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="w-full justify-start h-auto p-4 text-base font-normal"
                  onClick={() => {
                    const promptText = prompt.placeholder ? `${prompt.title} ${prompt.placeholder}` : prompt.title;
                    setInputValue(promptText);
                  }}
                >
                  {prompt.title} {prompt.placeholder && <span className="text-muted-foreground ml-1">{prompt.placeholder}</span>}
                </Button>
              ))}
            </div>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t space-y-4">
        <div className="flex gap-2">
          <Button className="flex-1" variant="outline" size="sm">
            <span className="truncate">Current document</span>
            <X className="ml-1 h-3 w-3" />
          </Button>
          <Button className="flex-1" variant="outline" size="sm">
            <span className="truncate">Web</span>
            <X className="ml-1 h-3 w-3" />
          </Button>
        </div>
        <Button className="w-32" variant="outline" size="sm">
          <span className="truncate">Library</span>
          <X className="ml-1 h-3 w-3" />
        </Button>
        <div className="flex items-center gap-2 border rounded-md px-4 py-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask assistant, use @ to mention specific PDFs..."
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


import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  SendHorizontal, 
  PaperclipIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
    <div className={cn(
      "border-r h-full bg-background transition-all duration-300 z-20",
      isOpen ? "w-[320px] min-w-[320px]" : "w-[60px] min-w-[60px]"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          <div className={cn(
            "flex items-center gap-2",
            isOpen ? "opacity-100" : "opacity-0"
          )}>
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">Ask Caelo</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8"
            title={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Content area - only visible when expanded */}
        <div className={cn(
          "flex-1 flex flex-col",
          isOpen ? "opacity-100" : "opacity-0 invisible"
        )}>
          {/* Tools bar */}
          <div className="p-2 border-b flex justify-between">
            <Button variant="ghost" size="icon" className="h-8 w-8" title="History">
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="New Chat">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4">
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
                <div className="text-center mb-10">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/60" />
                  <h2 className="text-xl font-semibold mb-2">Ask Caelo</h2>
                  <p className="text-muted-foreground">
                    Ask any questions about the loan in front of you, property documents, or whatever information you might need.
                  </p>
                </div>

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
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 border rounded-md px-4 py-2">
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
                <Button onClick={handleSend} size="icon" className="h-8 w-8" variant="default">
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Icon only view for collapsed state */}
        {!isOpen && (
          <div className="flex flex-col items-center pt-4">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}

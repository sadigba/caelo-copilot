
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Clock, 
  Plus, 
  SendHorizontal, 
  PaperclipIcon, 
  MessageSquare,
  ChevronRight,
  X
} from "lucide-react";
import { useCaeloChat } from "@/hooks/use-caelo-chat";
import { Separator } from "@/components/ui/separator";

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIChatPopup() {
  const { isChatOpen, closeCaeloChat } = useCaeloChat();
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

  if (!isChatOpen) return null;

  return (
    <Popover open={isChatOpen} onOpenChange={closeCaeloChat}>
      <PopoverContent 
        className="w-[380px] h-[550px] p-0 mr-4" 
        align="end" 
        sideOffset={16}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-medium text-lg">Ask Caelo</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Clock className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeCaeloChat}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Empty state or messages */}
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
              <div className="text-center py-6">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                <h2 className="text-lg font-semibold mb-1">Ask Caelo</h2>
                <p className="text-sm text-muted-foreground">
                  Ask any questions about the loan or documents.
                </p>
              </div>
            )}
          </div>

          {/* Context buttons and input */}
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Caelo a question..."
                className="border-0 flex-1 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <Button onClick={handleSend} size="icon" className="h-8 w-8 shrink-0" variant="default">
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

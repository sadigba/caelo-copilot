
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Clock, 
  Plus, 
  SendHorizontal, 
  PaperclipIcon, 
  MessageSquare,
  Maximize2,
  X,
  GripHorizontal
} from "lucide-react";
import { useCaeloChat } from "@/hooks/use-caelo-chat";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIChatPopup() {
  const { isChatOpen, closeCaeloChat, layoutMode, toggleLayoutMode } = useCaeloChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Drag functionality
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  
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

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (popupRef.current) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isChatOpen) return null;

  // Render the popup version
  if (layoutMode === "popup") {
    return (
      <Dialog open={isChatOpen} onOpenChange={closeCaeloChat} modal={false}>
        <DialogContent 
          ref={popupRef}
          style={
            isDragging ? 
            { 
              transform: `translate(${position.x}px, ${position.y}px)`, 
              transition: 'none' 
            } : 
            position.x !== 0 || position.y !== 0 ? 
            { 
              transform: `translate(${position.x}px, ${position.y}px)` 
            } : undefined
          }
          className="sm:max-w-[550px] h-[600px] flex flex-col p-0 gap-0 border-caelo-200 shadow-lg overflow-hidden"
        >
          <DialogHeader className="flex flex-row items-center justify-between border-b p-4 cursor-move" onMouseDown={handleMouseDown}>
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-5 h-5 text-muted-foreground" />
              <MessageSquare className="w-5 h-5" />
              <DialogTitle className="font-medium">Ask Caelo</DialogTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" title="History">
                <Clock className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="New Chat">
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Switch to Sidebar" onClick={toggleLayoutMode}>
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeCaeloChat} title="Close">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
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
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Render the sidebar version (reusing existing component)
  return null;
}

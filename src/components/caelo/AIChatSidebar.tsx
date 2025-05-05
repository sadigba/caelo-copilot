
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Plus, 
  X, 
  SendHorizontal, 
  PaperclipIcon, 
  MessageSquare 
} from "lucide-react";

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

  // Example suggested questions
  const researchQuestions = [
    "Find research ideas for the loan type",
    "Explain in simple words this loan's terms",
  ];

  const writingHelp = [
    "Help me outline a paper on this property",
    "Review my draft for clarity - what parts might confuse readers?",
    "Check for overuse of passive voice",
    "Check for technical language",
    "Draft an abstract and keywords for this document"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-[400px] bg-background border-l border-border shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">AI Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Clock className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

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
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-8 pt-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Research questions</h3>
                {researchQuestions.map((question, index) => (
                  <Button 
                    key={index} 
                    variant="ghost" 
                    className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                    onClick={() => {
                      setInputValue(question);
                      setMessages([
                        ...messages, 
                        { type: 'user', content: question, timestamp: new Date() }
                      ]);
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Writing help</h3>
                {writingHelp.map((help, index) => (
                  <Button 
                    key={index} 
                    variant="ghost" 
                    className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                    onClick={() => {
                      setInputValue(help);
                      setMessages([
                        ...messages, 
                        { type: 'user', content: help, timestamp: new Date() }
                      ]);
                    }}
                  >
                    {help}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Source selection */}
      <div className="p-4 border-t">
        <div className="flex gap-2 mb-2">
          <Button variant="outline" size="sm" className="text-xs gap-1">
            <MessageSquare className="w-3 h-3" />
            Current document
            <X className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1">
            <MessageSquare className="w-3 h-3" />
            Web
            <X className="w-3 h-3" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1">
          <MessageSquare className="w-3 h-3" />
          Library
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 border rounded-md pl-4 pr-2 py-2">
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
      </div>
    </div>
  );
}

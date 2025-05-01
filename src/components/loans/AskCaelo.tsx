
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AskCaelo() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const userMessage: Message = {
      role: "user",
      content: question
    };
    
    setMessages([...messages, userMessage]);
    setLoading(true);
    setQuestion("");
    
    // Simulate AI response delay
    setTimeout(() => {
      // Sample responses based on question content
      let response = "";
      
      if (question.toLowerCase().includes("cash flow")) {
        response = "Based on the documents provided, the borrower's cash flow appears stable. The business has maintained consistent monthly revenues between $35,000-$42,000 over the past 12 months, with expenses ranging from $18,000-$22,000. This results in a positive cash flow averaging $18,500 per month.\n\nThe debt coverage ratio (DCR) is calculated to be 1.48, which exceeds the minimum requirement of 1.25 for this loan type.";
      } else if (question.toLowerCase().includes("document")) {
        response = "For this Owner-Occupied CRE loan, I recommend requesting the following additional documents:\n\n1. Three years of business tax returns\n2. Personal financial statements from all owners with 20%+ ownership\n3. Current rent roll and copies of existing leases\n4. Property insurance documentation\n5. Environmental report (Phase I at minimum)\n6. Current property tax statements";
      } else if (question.toLowerCase().includes("risk")) {
        response = "Key risks identified for this loan application:\n\n1. Lease expiration for the main tenant (45% of rental income) in 18 months\n2. Property tax reassessment pending, potentially increasing annual expenses by 8-12%\n3. Recent decline in occupancy rates for similar properties in the area\n4. Borrower's limited experience with this specific property type\n5. Higher than average debt-to-income ratio for the primary sponsor";
      } else {
        response = "I've analyzed the available documents for this loan application. Here are my observations:\n\n• The property appears to be in good condition based on the inspection report, with only minor maintenance issues noted.\n\n• The borrower has a strong credit history with no late payments in the past 24 months.\n\n• The proposed loan-to-value ratio of 68% is within acceptable parameters for this loan type.\n\nI recommend proceeding with the underwriting process while requesting additional financial documentation to verify the projected rental income.";
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleInputFocus = () => {
    setExpanded(true);
  };

  return (
    <Card className="p-4 overflow-hidden">
      <div className={`flex flex-col ${expanded || messages.length > 0 ? 'h-96' : 'h-auto'} transition-all duration-300`}>
        {(messages.length > 0 || expanded) && (
          <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 max-w-[85%]`}>
                  <div className="flex-shrink-0 mt-1">
                    {message.role === 'user' ? (
                      <Avatar>
                        <AvatarFallback>U</AvatarFallback>
                        <AvatarImage src="/placeholder.svg" />
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarFallback className="bg-caelo-600 text-white">C</AvatarFallback>
                        <AvatarImage src="/placeholder.svg" />
                      </Avatar>
                    )}
                  </div>
                  <div 
                    className={`rounded-lg py-2 px-3 text-sm ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex flex-row gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 mt-1">
                    <Avatar>
                      <AvatarFallback className="bg-caelo-600 text-white">C</AvatarFallback>
                      <AvatarImage src="/placeholder.svg" />
                    </Avatar>
                  </div>
                  <div className="rounded-lg py-2 px-3 text-sm bg-muted">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Textarea
            placeholder="Ask Caelo anything about this loan application..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={handleInputFocus}
            className="min-h-[60px] flex-1 resize-none"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!question.trim() || loading}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </Card>
  );
}

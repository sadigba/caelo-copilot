
import { Button } from "@/components/ui/button";
import { useCaeloChat } from "@/hooks/use-caelo-chat";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { RefreshCw, Download, MessageSquare, ChevronDown } from "lucide-react";

export function TopBar() {
  const { toggleCaeloChat } = useCaeloChat();
  const location = useLocation();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  
  // Check if we're on a loan detail page
  const isLoanDetailPage = location.pathname.startsWith('/loans/');
  
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleDownload = (type: string) => {
    console.log(`Downloading ${type}`);
  };

  const navigateToDealSummary = () => {
    // Extract the loanId from the current path if we're on a loan detail page
    if (isLoanDetailPage) {
      const loanId = location.pathname.split('/').pop();
      // Navigate to the dedicated Deal Summary page
      navigate(`/loans/${loanId}/deal-summary`);
    }
  };

  return (
    <div className="h-14 bg-background flex items-center justify-end px-4 border-b">
      <div className="flex items-center space-x-2">
        {isLoanDetailPage && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleRefresh}
              className={`h-8 w-8 ${refreshing ? 'animate-spin' : ''}`}
              disabled={refreshing}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleDownload("model")}
                  className="cursor-pointer"
                >
                  Financial Model
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDownload("memo")}
                  className="cursor-pointer"
                >
                  Credit Memo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={navigateToDealSummary}
              title="Deal Summary"
            >
              <span className="text-xs font-medium">DS</span>
            </Button>
          </>
        )}
        
        <Button 
          variant="ghost" 
          onClick={toggleCaeloChat} 
          size="icon"
          className="h-8 w-8"
          title="Ask Caelo"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

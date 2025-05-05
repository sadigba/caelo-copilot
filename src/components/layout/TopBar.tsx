
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
import { User, LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <div className="h-14 bg-background border-b flex items-center justify-between px-4">
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <span>John</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Manage Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-2">
        {isLoanDetailPage && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              className="h-8"
            >
              {refreshing ? "Analyzing..." : "Refresh"}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  Download
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
              size="sm" 
              variant="outline" 
              className="h-8"
              onClick={navigateToDealSummary}
            >
              Deal Summary
            </Button>
          </>
        )}
        
        <Button 
          variant="ghost" 
          onClick={toggleCaeloChat} 
          size="sm"
          className="h-8"
        >
          Ask Caelo
        </Button>
      </div>
    </div>
  );
}

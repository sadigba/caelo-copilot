
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
import { RefreshCcw, Download, FileText, Search, PanelLeft, User, LogOut, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
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

  // Determine the page title based on the current route
  const getPageTitle = () => {
    if (location.pathname === '/') return "Loan Applications";
    if (location.pathname === '/new-loan') return "New Loan Application";
    if (location.pathname.includes('/deal-summary')) return "Deal Summary";
    if (isLoanDetailPage) return "Loan Details";
    if (location.pathname === '/settings') return "Settings";
    return "";
  };

  return (
    <div className="h-14 bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-7 w-7" />
        <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center space-x-2">
        {isLoanDetailPage && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRefresh}
              className="h-8"
              title="Refresh"
            >
              <RefreshCcw className={refreshing ? "animate-spin" : ""} />
              <span className="sr-only">{refreshing ? "Analyzing..." : "Refresh"}</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8"
                  title="Download"
                >
                  <Download />
                  <span className="sr-only">Download</span>
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
              variant="ghost" 
              className="h-8"
              onClick={navigateToDealSummary}
              title="Deal Summary"
            >
              <FileText />
              <span className="sr-only">Deal Summary</span>
            </Button>
          </>
        )}
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md p-1 hover:bg-accent outline-none">
              <Avatar className="h-5 w-5 bg-muted">
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">John</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
        
          <Button 
            variant="ghost" 
            onClick={toggleCaeloChat} 
            size="sm"
            className="h-8"
            title="Ask Caelo"
          >
            <Search />
            <span className="sr-only">Ask Caelo</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

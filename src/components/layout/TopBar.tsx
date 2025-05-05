
import { Button } from "@/components/ui/button";
import { useCaeloChat } from "@/hooks/use-caelo-chat";
import { useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";

export function TopBar() {
  const { toggleCaeloChat } = useCaeloChat();
  const location = useLocation();
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
  
  const toggleDealSummary = () => {
    // We'll use this to communicate with the LoanDetail page
    const event = new CustomEvent('toggle-deal-summary');
    window.dispatchEvent(event);
  };

  // Get the current page title
  const getPageTitle = () => {
    if (isLoanDetailPage) {
      return "Loan Details";
    } else if (location.pathname === "/") {
      return "Applications";
    } else if (location.pathname === "/settings") {
      return "Settings";
    } else if (location.pathname === "/new-loan") {
      return "New Application";
    } else {
      return "Caelo AI";
    }
  };

  return (
    <div className="h-14 bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <span className="text-lg font-medium">{getPageTitle()}</span>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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
              onClick={toggleDealSummary}
            >
              Deal Summary
            </Button>
          </>
        )}
        
        <Button 
          variant="ghost" 
          onClick={toggleCaeloChat} 
          className="flex items-center"
          size="sm"
        >
          <span>Ask Caelo</span>
        </Button>
      </div>
    </div>
  );
}

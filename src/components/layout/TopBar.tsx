
import { Button } from "@/components/ui/button";
import { useCaeloChat } from "@/hooks/use-caelo-chat";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { 
  RefreshCcw, 
  Download, 
  FileText, 
  Search, 
  Settings, 
  FilePlus, 
  FileText as FileTextIcon,
  User,
  LogOut,
  ChevronDown 
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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
    <div className="h-14 bg-background flex items-center justify-between px-4">
      {/* Left side content with logo and main navigation */}
      <div className="flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            {/* Applications menu item */}
            <NavigationMenuItem>
              <Link to="/" className="flex items-center gap-2 text-sm font-medium">
                <FileTextIcon className="h-5 w-5" />
                <span>Applications</span>
              </Link>
            </NavigationMenuItem>

            {/* New Application button */}
            <NavigationMenuItem className="ml-4">
              <Button variant="ghost" asChild size="sm" className="flex items-center gap-2">
                <Link to="/new-loan">
                  <FilePlus className="h-4 w-4" />
                  <span>New Application</span>
                </Link>
              </Button>
            </NavigationMenuItem>

            {/* Settings */}
            <NavigationMenuItem className="ml-2">
              <Button variant="ghost" asChild size="sm" className="flex items-center gap-2">
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Back button - only on loan detail pages */}
        {isLoanDetailPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="h-8 ml-4"
          >
            <span className="flex items-center gap-2">
              <span className="rotate-180 text-lg">→</span> Back
            </span>
          </Button>
        )}
      </div>

      {/* Right side tools */}
      <div className="flex items-center gap-2">
        {/* User account dropdown */}
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
  );
}

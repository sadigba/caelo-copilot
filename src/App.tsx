
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { LoanProvider } from "./context/LoanContext";
import { CaeloChatProvider } from "./hooks/use-caelo-chat";

// Pages
import Dashboard from "./pages/Dashboard";
import NewLoan from "./pages/NewLoan";
import LoanDetail from "./pages/LoanDetail";
import DealSummary from "./pages/DealSummary";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LoanProvider>
        <CaeloChatProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/new-loan" element={<AppLayout><NewLoan /></AppLayout>} />
              <Route path="/loans/:loanId" element={<AppLayout><LoanDetail /></AppLayout>} />
              <Route path="/loans/:loanId/deal-summary" element={<AppLayout><DealSummary /></AppLayout>} />
              <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CaeloChatProvider>
      </LoanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

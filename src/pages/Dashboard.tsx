
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoanListItem } from "@/components/loans/LoanListItem";
import { useLoanContext } from "@/context/LoanContext";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Table,
  TableHeader,
  TableHead,
  TableBody,
} from "@/components/ui/table";

export default function Dashboard() {
  const { loans } = useLoanContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("lastUpdated");

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = loan.businessName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Add safe date comparison function
  const safeCompareDate = (dateA: Date | string | undefined, dateB: Date | string | undefined) => {
    // If both dates are valid, compare them
    if (dateA && dateB) {
      const timeA = dateA instanceof Date ? dateA.getTime() : new Date(dateA).getTime();
      const timeB = dateB instanceof Date ? dateB.getTime() : new Date(dateB).getTime();
      return timeB - timeA; // Descending order (newest first)
    }
    
    // If one date is valid and the other isn't, prioritize the valid one
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;
    
    // If neither is valid, they're "equal" for sorting purposes
    return 0;
  };

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    switch (sortBy) {
      case "amount":
        return b.loanAmount - a.loanAmount;
      case "businessName":
        return a.businessName.localeCompare(b.businessName);
      case "submissionDate":
        return safeCompareDate(a.submissionDate, b.submissionDate);
      case "lastUpdated":
      default:
        return safeCompareDate(a.lastUpdated, b.lastUpdated);
    }
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Loan Applications</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <Input
            placeholder="Search by business name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastUpdated">Last Updated</SelectItem>
                <SelectItem value="submissionDate">Submission Date</SelectItem>
                <SelectItem value="amount">Loan Amount</SelectItem>
                <SelectItem value="businessName">Business Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-lg shadow overflow-hidden">
        {sortedLoans.length > 0 ? (
          <Table className="loan-table">
            <TableHeader>
              <TableHead>Loan ID</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Loan Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Documents</TableHead>
            </TableHeader>
            <TableBody>
              {sortedLoans.map((loan) => (
                <LoanListItem key={loan.id} loan={loan} />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No loan applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}

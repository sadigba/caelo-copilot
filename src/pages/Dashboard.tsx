
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoanListItem } from "@/components/loans/LoanListItem";
import { Loan, useLoanContext } from "@/context/LoanContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

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

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    switch (sortBy) {
      case "amount":
        return b.loanAmount - a.loanAmount;
      case "businessName":
        return a.businessName.localeCompare(b.businessName);
      case "submissionDate":
        return b.submissionDate.getTime() - a.submissionDate.getTime();
      case "lastUpdated":
      default:
        return b.lastUpdated.getTime() - a.lastUpdated.getTime();
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Loan Applications</h1>
        <Button asChild>
          <Link to="/new-loan">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Ready for Review">Ready for Review</SelectItem>
                <SelectItem value="Awaiting Docs">Awaiting Docs</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Declined">Declined</SelectItem>
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {sortedLoans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full loan-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Submission Date</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {sortedLoans.map((loan) => (
                  <LoanListItem key={loan.id} loan={loan} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No loan applications found</p>
            <Button asChild variant="outline">
              <Link to="/new-loan">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create your first application
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

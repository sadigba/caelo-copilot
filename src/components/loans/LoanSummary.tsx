
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loan, useLoanContext } from "@/context/LoanContext";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Edit, Check, X } from "lucide-react";
import { toast } from "sonner";

interface LoanSummaryProps {
  loan: Loan;
}

export function LoanSummary({ loan }: LoanSummaryProps) {
  const { updateLoan } = useLoanContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLoan, setEditedLoan] = useState<Loan>({ ...loan });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedLoan({ ...loan });
    setIsEditing(false);
  };

  const handleSave = () => {
    updateLoan(loan.id, editedLoan);
    setIsEditing(false);
    toast.success("Application summary updated successfully");
  };

  const handleChange = (field: keyof Loan, value: string | number) => {
    setEditedLoan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Application Summary</h2>
          {isEditing ? (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" variant="default" onClick={handleSave}>
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium border-b pb-2">Loan Information</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                {isEditing ? (
                  <Select 
                    value={editedLoan.loanType}
                    onValueChange={(value) => handleChange("loanType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Owner-Occupied CRE">Owner-Occupied CRE</SelectItem>
                      <SelectItem value="Investment Property">Investment Property</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Land Loans">Land Loans</SelectItem>
                      <SelectItem value="Bridge">Bridge</SelectItem>
                      <SelectItem value="Refinance/Cash Out">Refinance/Cash Out</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <dd>{loan.loanType}</dd>
                )}
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                {isEditing ? (
                  <Input 
                    type="number" 
                    value={editedLoan.loanAmount} 
                    onChange={(e) => handleChange("loanAmount", Number(e.target.value))}
                    className="mt-1"
                  />
                ) : (
                  <dd>{formatCurrency(loan.loanAmount)}</dd>
                )}
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Purpose</dt>
                {isEditing ? (
                  <Textarea 
                    value={editedLoan.purpose} 
                    onChange={(e) => handleChange("purpose", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <dd>{loan.purpose}</dd>
                )}
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-medium border-b pb-2">Business Information</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Business Name</dt>
                {isEditing ? (
                  <Input 
                    value={editedLoan.businessName} 
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <dd>{loan.businessName}</dd>
                )}
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Industry</dt>
                {isEditing ? (
                  <Input 
                    value={editedLoan.industry || ""} 
                    onChange={(e) => handleChange("industry", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <dd>{loan.industry || "Not specified"}</dd>
                )}
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Years in Operation</dt>
                {isEditing ? (
                  <Input 
                    type="number"
                    value={editedLoan.yearsInOperation || ""} 
                    onChange={(e) => handleChange("yearsInOperation", e.target.value ? Number(e.target.value) : undefined)}
                    className="mt-1"
                  />
                ) : (
                  <dd>{loan.yearsInOperation || "Not specified"}</dd>
                )}
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-medium border-b pb-2">Primary Contact</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                {isEditing ? (
                  <Input 
                    value={editedLoan.sponsorName} 
                    onChange={(e) => handleChange("sponsorName", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <dd>{loan.sponsorName}</dd>
                )}
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Title</dt>
                {isEditing ? (
                  <Input 
                    value={editedLoan.sponsorTitle || ""} 
                    onChange={(e) => handleChange("sponsorTitle", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <dd>{loan.sponsorTitle || "Not specified"}</dd>
                )}
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                {isEditing ? (
                  <Input 
                    type="email"
                    value={editedLoan.sponsorEmail} 
                    onChange={(e) => handleChange("sponsorEmail", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <dd>{loan.sponsorEmail}</dd>
                )}
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                {isEditing ? (
                  <Input 
                    value={editedLoan.sponsorPhone} 
                    onChange={(e) => handleChange("sponsorPhone", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <dd>{loan.sponsorPhone}</dd>
                )}
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-medium border-b pb-2">Property Details</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                {isEditing ? (
                  <Input 
                    value={editedLoan.propertyAddress} 
                    onChange={(e) => handleChange("propertyAddress", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <dd>{loan.propertyAddress}</dd>
                )}
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Property Type</dt>
                {isEditing ? (
                  <Select 
                    value={editedLoan.propertyType}
                    onValueChange={(value) => handleChange("propertyType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Multifamily">Multifamily</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <dd>{loan.propertyType}</dd>
                )}
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

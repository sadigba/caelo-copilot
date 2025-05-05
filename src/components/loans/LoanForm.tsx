
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, BankIcon } from "lucide-react";
import { useLoanContext } from "@/context/LoanContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LoanFormProps {
  onSubmit?: (loanData: any) => void;
}

export function LoanForm({ onSubmit }: LoanFormProps) {
  const { addLoan } = useLoanContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [businessName, setBusinessName] = useState("");
  const [loanType, setLoanType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [industry, setIndustry] = useState("");
  const [yearsInOperation, setYearsInOperation] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorTitle, setSponsorTitle] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [sponsorPhone, setSponsorPhone] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const loanData = {
      businessName,
      loanType,
      propertyType,
      loanAmount: Number(loanAmount),
      purpose,
      industry,
      yearsInOperation: Number(yearsInOperation),
      sponsorName,
      sponsorTitle,
      sponsorEmail,
      sponsorPhone,
      propertyAddress,
    };
    
    if (onSubmit) {
      onSubmit(loanData);
    } else {
      addLoan(loanData);
      
      toast({
        title: "Success",
        description: "Loan application submitted successfully!",
      });
      
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            <CardDescription>Provide details about the property and loan request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium">
                Property/Business Name
              </label>
              <Input
                id="businessName"
                placeholder="e.g., Skyline Apartments, Downtown Plaza"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="loanType" className="text-sm font-medium">
                Loan Type
              </label>
              <Select 
                value={loanType} 
                onValueChange={setLoanType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner-Occupied CRE">Owner-Occupied CRE</SelectItem>
                  <SelectItem value="Investment Property">Investment Property</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Bridge">Bridge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="propertyType" className="text-sm font-medium">
                Property Type
              </label>
              <Select 
                value={propertyType} 
                onValueChange={setPropertyType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Multifamily">Multifamily</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                  <SelectItem value="Self-Storage">Self-Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="loanAmount" className="text-sm font-medium">
                Loan Amount ($)
              </label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="e.g., 1000000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="purpose" className="text-sm font-medium">
                Loan Purpose
              </label>
              <Select 
                value={purpose} 
                onValueChange={setPurpose}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loan purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acquisition">Acquisition</SelectItem>
                  <SelectItem value="Refinance">Refinance</SelectItem>
                  <SelectItem value="New Construction">New Construction</SelectItem>
                  <SelectItem value="Renovation">Renovation</SelectItem>
                  <SelectItem value="Expansion">Expansion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="propertyAddress" className="text-sm font-medium">
                Property Address
              </label>
              <Textarea
                id="propertyAddress"
                placeholder="Full property address"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sponsor Information</CardTitle>
            <CardDescription>Tell us about the business/sponsor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium">
                Industry
              </label>
              <Select 
                value={industry} 
                onValueChange={setIndustry}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Hospitality">Hospitality</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Professional Services">Professional Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="yearsInOperation" className="text-sm font-medium">
                Years in Operation
              </label>
              <Input
                id="yearsInOperation"
                type="number"
                placeholder="e.g., 5"
                value={yearsInOperation}
                onChange={(e) => setYearsInOperation(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sponsorName" className="text-sm font-medium">
                Sponsor/Primary Contact Name
              </label>
              <Input
                id="sponsorName"
                placeholder="Full name"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sponsorTitle" className="text-sm font-medium">
                Title/Role
              </label>
              <Input
                id="sponsorTitle"
                placeholder="e.g., CEO, Owner, Managing Partner"
                value={sponsorTitle}
                onChange={(e) => setSponsorTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sponsorEmail" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="sponsorEmail"
                type="email"
                placeholder="email@example.com"
                value={sponsorEmail}
                onChange={(e) => setSponsorEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sponsorPhone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="sponsorPhone"
                placeholder="e.g., (555) 123-4567"
                value={sponsorPhone}
                onChange={(e) => setSponsorPhone(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" className="px-8">
          Submit Application
        </Button>
      </div>
    </form>
  );
}

export default LoanForm;

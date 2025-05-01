
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoanContext, LoanType, PropertyType, LoanStatus } from "@/context/LoanContext";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  // Loan Basics
  loanType: z.enum([
    "Owner-Occupied CRE", 
    "Investment Property", 
    "Construction", 
    "Land Loans", 
    "Bridge", 
    "Refinance/Cash Out"
  ] as const),
  loanAmount: z.number().min(1, "Amount must be greater than 0"),
  purpose: z.string().min(10, "Please provide a detailed purpose"),
  
  // Business Info
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().optional(),
  yearsInOperation: z.number().optional(),
  sponsorName: z.string().min(2, "Primary sponsor name is required"),
  sponsorTitle: z.string().optional(),
  sponsorEmail: z.string().email("Invalid email address"),
  sponsorPhone: z.string().min(10, "Phone number is required"),
  
  // Property Details
  propertyAddress: z.string().min(5, "Property address is required"),
  propertyType: z.enum([
    "Multifamily", 
    "Retail", 
    "Office", 
    "Warehouse", 
    "Industrial", 
    "Mixed-Use", 
    "Other"
  ] as const),
});

export function LoanForm() {
  const { addLoan } = useLoanContext();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanType: "Owner-Occupied CRE",
      loanAmount: undefined,
      purpose: "",
      businessName: "",
      industry: "",
      yearsInOperation: undefined,
      sponsorName: "",
      sponsorTitle: "",
      sponsorEmail: "",
      sponsorPhone: "",
      propertyAddress: "",
      propertyType: "Office",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Ensure all required fields are present with their correct types
    const newLoan = {
      ...values,
      status: "In Progress" as LoanStatus,
      // Make sure all required fields are explicitly defined, not optional
      loanType: values.loanType,
      loanAmount: values.loanAmount,
      purpose: values.purpose,
      businessName: values.businessName,
      industry: values.industry || "",
      yearsInOperation: values.yearsInOperation || 0,
      sponsorName: values.sponsorName,
      sponsorTitle: values.sponsorTitle || "",
      sponsorEmail: values.sponsorEmail,
      sponsorPhone: values.sponsorPhone,
      propertyAddress: values.propertyAddress,
      propertyType: values.propertyType
    };
    
    addLoan(newLoan);
    navigate("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-md shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">Loan Basics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="loanType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Owner-Occupied CRE">Owner-Occupied CRE</SelectItem>
                      <SelectItem value="Investment Property">Investment Property</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Land Loans">Land Loans</SelectItem>
                      <SelectItem value="Bridge">Bridge</SelectItem>
                      <SelectItem value="Refinance/Cash Out">Refinance/Cash Out</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter loan amount" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Purpose</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what the loan will be used for..." 
                    className="min-h-24"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Please provide a detailed explanation of how the loan will be used.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-white rounded-md shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Technology, Healthcare, Retail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsInOperation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years in Operation (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter years in operation" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Primary Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sponsorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Sponsor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sponsorTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CEO, President, Owner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sponsorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sponsorPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyAddress"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Property Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full property address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit">Submit Application</Button>
        </div>
      </form>
    </Form>
  );
}


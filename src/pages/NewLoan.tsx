
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Form schema
const formSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanType: z.string().min(1, "Loan type is required"),
  loanPurpose: z.string().min(1, "Loan purpose is required"),
  propertyType: z.string().min(1, "Property type is required"),
  propertyAddress: z.string().min(5, "Property address is required"),
  propertyCity: z.string().min(2, "City is required"),
  propertyState: z.string().min(2, "State is required"),
  propertyZip: z.string().min(5, "ZIP code is required"),
  requestedClosingDate: z.date().optional(),
  referralSource: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewLoan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("borrowerInfo");
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      loanAmount: "",
      loanType: "",
      loanPurpose: "",
      propertyType: "",
      propertyAddress: "",
      propertyCity: "",
      propertyState: "",
      propertyZip: "",
      additionalNotes: "",
      referralSource: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    // Show toast notification
    toast({
      title: "Application Submitted",
      description: `Loan application for ${data.businessName} has been submitted successfully.`,
    });
    
    // Navigate to the loan detail page (in a real app, would go to the newly created loan)
    setTimeout(() => {
      navigate("/loans/example-loan-id");
    }, 1500);
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* Header with sidebar trigger, title and navigation */}
      <div>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-medium leading-tight">New Loan Application</h1>
                <p className="text-sm text-muted-foreground">
                  Enter loan and borrower details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="borrowerInfo">Borrower Information</TabsTrigger>
                <TabsTrigger value="loanDetails">Loan Details</TabsTrigger>
                <TabsTrigger value="propertyInfo">Property Information</TabsTrigger>
              </TabsList>
              
              {/* Borrower Information Tab */}
              <TabsContent value="borrowerInfo" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Borrower Information</CardTitle>
                    <CardDescription>Enter details about the borrowing entity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business/Entity Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 555-5555" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab("loanDetails")}
                    >
                      Next: Loan Details
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Loan Details Tab */}
              <TabsContent value="loanDetails" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Details</CardTitle>
                    <CardDescription>Specify the loan amount and purpose</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Amount ($)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter loan amount" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="loanType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select loan type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="acquisition">Acquisition</SelectItem>
                              <SelectItem value="refinance">Refinance</SelectItem>
                              <SelectItem value="construction">Construction</SelectItem>
                              <SelectItem value="bridge">Bridge</SelectItem>
                              <SelectItem value="permanent">Permanent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="loanPurpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Purpose</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select loan purpose" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="purchase">Purchase</SelectItem>
                              <SelectItem value="refinance">Refinance</SelectItem>
                              <SelectItem value="cashout">Cash-Out Refinance</SelectItem>
                              <SelectItem value="renovation">Renovation</SelectItem>
                              <SelectItem value="expansion">Business Expansion</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab("borrowerInfo")}
                    >
                      Previous
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab("propertyInfo")}
                    >
                      Next: Property Information
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Property Information Tab */}
              <TabsContent value="propertyInfo" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Information</CardTitle>
                    <CardDescription>Enter property details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="multifamily">Multifamily</SelectItem>
                              <SelectItem value="office">Office</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="industrial">Industrial</SelectItem>
                              <SelectItem value="mixeduse">Mixed Use</SelectItem>
                              <SelectItem value="hospitality">Hospitality</SelectItem>
                              <SelectItem value="selfstorage">Self Storage</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="propertyCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="propertyState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="State" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="AL">Alabama</SelectItem>
                                <SelectItem value="AK">Alaska</SelectItem>
                                <SelectItem value="AZ">Arizona</SelectItem>
                                <SelectItem value="AR">Arkansas</SelectItem>
                                <SelectItem value="CA">California</SelectItem>
                                <SelectItem value="CO">Colorado</SelectItem>
                                <SelectItem value="CT">Connecticut</SelectItem>
                                {/* More states would be listed here */}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="propertyZip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="ZIP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="requestedClosingDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Requested Closing Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="referralSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referral Source</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="How did you hear about us?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="referral">Client Referral</SelectItem>
                              <SelectItem value="broker">Broker</SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="search">Search Engine</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Any additional information"
                              {...field}
                              className="h-24"
                            />
                          </FormControl>
                          <FormDescription>
                            Any other details that might be relevant to your application
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab("loanDetails")}
                    >
                      Previous
                    </Button>
                    <Button type="submit">Submit Application</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}

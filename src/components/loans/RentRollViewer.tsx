
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Document } from "@/context/LoanContext";
import { FileText } from "lucide-react";
import { toast } from "sonner";

// Mock rent roll data - in a real app, this would come from parsing the uploaded file
const mockRentRollData = [
  {
    unit: "101",
    tenant: "John Smith",
    sqft: 750,
    beds: 1,
    baths: 1,
    rent: 1500,
    leaseStart: "01/01/2024",
    leaseEnd: "12/31/2024",
    status: "Current",
  },
  {
    unit: "102",
    tenant: "Jane Doe",
    sqft: 850,
    beds: 1,
    baths: 1,
    rent: 1700,
    leaseStart: "03/15/2024",
    leaseEnd: "03/14/2025",
    status: "Current",
  },
  {
    unit: "201",
    tenant: "Robert Johnson",
    sqft: 1100,
    beds: 2,
    baths: 2,
    rent: 2200,
    leaseStart: "11/01/2023",
    leaseEnd: "10/31/2024",
    status: "Current",
  },
  {
    unit: "202",
    tenant: "",
    sqft: 1050,
    beds: 2,
    baths: 2,
    rent: 2100,
    leaseStart: "",
    leaseEnd: "",
    status: "Vacant",
  },
  {
    unit: "301",
    tenant: "Michael Williams",
    sqft: 1350,
    beds: 3,
    baths: 2,
    rent: 2800,
    leaseStart: "05/01/2024",
    leaseEnd: "04/30/2025",
    status: "Current",
  },
];

interface RentRollViewerProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
}

export function RentRollViewer({ document, open, onClose }: RentRollViewerProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "details">("preview");

  // Calculate summary statistics
  const occupiedUnits = mockRentRollData.filter(unit => unit.status === "Current").length;
  const totalUnits = mockRentRollData.length;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
  
  const totalMonthlyRent = mockRentRollData.reduce((sum, unit) => sum + unit.rent, 0);
  const averageRent = occupiedUnits > 0 
    ? mockRentRollData.filter(unit => unit.status === "Current").reduce((sum, unit) => sum + unit.rent, 0) / occupiedUnits 
    : 0;

  if (!document) return null;

  const handleDownloadRentRoll = () => {
    toast.success("Rent roll downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6" />
            Rent Roll: {document.name}
          </DialogTitle>
          <DialogDescription>
            Rent roll document uploaded on {new Date(document.dateUploaded).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "preview" ? "default" : "outline"}
              onClick={() => setActiveTab("preview")}
              size="sm"
            >
              Data Preview
            </Button>
            <Button
              variant={activeTab === "details" ? "default" : "outline"}
              onClick={() => setActiveTab("details")}
              size="sm"
            >
              Summary
            </Button>
          </div>

          {activeTab === "preview" && (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Unit</TableHead>
                    <TableHead className="w-[160px]">Tenant</TableHead>
                    <TableHead className="w-[80px] text-right">Sq.Ft.</TableHead>
                    <TableHead className="w-[60px] text-center">Beds</TableHead>
                    <TableHead className="w-[60px] text-center">Baths</TableHead>
                    <TableHead className="w-[100px] text-right">Rent</TableHead>
                    <TableHead className="w-[110px]">Lease Start</TableHead>
                    <TableHead className="w-[110px]">Lease End</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRentRollData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.unit}</TableCell>
                      <TableCell>{row.tenant || "—"}</TableCell>
                      <TableCell className="text-right">{row.sqft}</TableCell>
                      <TableCell className="text-center">{row.beds}</TableCell>
                      <TableCell className="text-center">{row.baths}</TableCell>
                      <TableCell className="text-right">${row.rent}</TableCell>
                      <TableCell>{row.leaseStart || "—"}</TableCell>
                      <TableCell>{row.leaseEnd || "—"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          row.status === "Current" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {row.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-2">Property Summary</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Total Units</dt>
                      <dd className="font-medium">{totalUnits}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Occupied Units</dt>
                      <dd className="font-medium">{occupiedUnits}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Vacant Units</dt>
                      <dd className="font-medium">{totalUnits - occupiedUnits}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Occupancy Rate</dt>
                      <dd className="font-medium">{occupancyRate.toFixed(1)}%</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-2">Financial Summary</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Total Monthly Rent</dt>
                      <dd className="font-medium">${totalMonthlyRent.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Average Rent</dt>
                      <dd className="font-medium">${averageRent.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Potential Annual Income</dt>
                      <dd className="font-medium">${(totalMonthlyRent * 12).toLocaleString()}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownloadRentRoll}>
            Download Rent Roll
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

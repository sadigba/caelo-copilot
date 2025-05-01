
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoanContext } from "@/context/LoanContext";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentUploadProps {
  loanId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const documentTypes = [
  "Financial Statement",
  "Tax Return",
  "Bank Statement",
  "Business Plan",
  "Property Appraisal",
  "Rent Roll",
  "Lease Agreement",
  "Title Report",
  "Insurance Document",
  "Other",
];

export function DocumentUpload({ loanId, open, setOpen }: DocumentUploadProps) {
  const { addDocument } = useLoanContext();
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file || !docType) {
      toast.error("Please select a file and document type");
      return;
    }

    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      // In a real app, you'd upload the file to storage and get back a URL
      // For now, we'll create a fake URL
      const fakeUrl = URL.createObjectURL(file);
      
      addDocument(loanId, {
        name: file.name,
        type: docType,
        approved: false,
        rejected: false,
        url: fakeUrl,
      });
      
      setUploading(false);
      setFile(null);
      setDocType("");
      setOpen(false);
      
      toast.success("Document uploaded successfully and is now in review");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document for this loan application. Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Type</label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Select File</label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || !docType || uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

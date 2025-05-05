
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoanContext } from "@/context/LoanContext";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Upload, Files } from "lucide-react";

interface DocumentUploadProps {
  loanId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DocumentUpload({ loanId, open, setOpen }: DocumentUploadProps) {
  const { addDocument } = useLoanContext();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = useCallback((indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  }, [files]);

  const handleUpload = useCallback(() => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      // In a real app, you'd upload the files to storage and get back URLs
      files.forEach(file => {
        const fakeUrl = URL.createObjectURL(file);
        
        // Use the file extension or name as the document type instead of the removed field
        const fileExtension = file.name.split('.').pop()?.toUpperCase() || "Document";
        
        addDocument(loanId, {
          name: file.name,
          type: fileExtension,
          approved: false,
          rejected: false,
          url: fakeUrl,
          dateUploaded: new Date(), // Add current date as upload date
        });
      });
      
      setUploading(false);
      setFiles([]);
      setOpen(false);
      
      toast.success(`${files.length} document${files.length > 1 ? 's' : ''} uploaded successfully`);
    }, 1000);
  }, [files, loanId, addDocument, setOpen]);

  const handleReset = useCallback(() => {
    setFiles([]);
  }, []);

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-sm border border-border/50">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload documents for this loan application. Drag and drop files or select multiple files at once.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Drag and drop area */}
          <div 
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors 
              ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
          </div>

          {/* Selected files list */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Selected Files ({files.length})
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleReset}
                  className="h-7 px-2 text-xs"
                >
                  Clear All
                </Button>
              </div>
              <ul className="border rounded-md divide-y overflow-hidden max-h-[200px] overflow-y-auto">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-2 hover:bg-muted">
                    <div className="flex items-center space-x-2 truncate">
                      <Files className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      &times;
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={files.length === 0 || uploading}
          >
            {uploading ? "Uploading..." : files.length > 0 ? `Upload ${files.length} File${files.length > 1 ? 's' : ''}` : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

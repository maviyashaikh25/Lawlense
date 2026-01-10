import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload as UploadIcon,
  FileText,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const { data: statsData } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => api.get("/auth/stats"),
  });
  
  const isLimitReached = statsData?.totalDocuments >= 3;

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === "application/pdf" ||
        droppedFile.name.endsWith(".docx"))
    ) {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF or DOCX files only.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { api } = await import("@/lib/api");
      const formData = new FormData();
      formData.append("pdf", file); // Backend expects "pdf" as key
      formData.append("title", file.name); // Backend requires title

      // Note: We can't easily track upload progress with fetch without XHR, 
      // so we'll simulate progress visually while the request is in flight.
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      await api.post("/documents/upload", formData);

      clearInterval(interval);
      setUploadProgress(100);
      setIsComplete(true);
      
      toast({
        title: "Upload complete!",
        description: "Your document is being analyzed.",
      });
    } catch (error) {
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-8">
          {!file ? (
            <motion.div
              onDragOver={(e) => {
                e.preventDefault();
                if (!isLimitReached) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isLimitReached && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                isLimitReached 
                  ? "border-destructive/50 bg-destructive/5 cursor-not-allowed"
                  : isDragging
                  ? "border-primary bg-primary/5 cursor-pointer"
                  : "border-border hover:border-primary/50 cursor-pointer"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                disabled={isLimitReached}
                onChange={(e) =>
                  e.target.files?.[0] && setFile(e.target.files[0])
                }
              />
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isLimitReached ? "bg-destructive/10" : "bg-primary/10"}`}>
                <UploadIcon className={`w-8 h-8 ${isLimitReached ? "text-destructive" : "text-primary"}`} />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                {isLimitReached ? "Upload Limit Reached" : "Drop your document here"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {isLimitReached ? "You have reached the free limit of 3 documents." : "Supports PDF and DOCX files"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                <FileText className="w-10 h-10 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!isComplete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setFile(null);
                      setUploadProgress(0);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {isUploading && (
                <Progress value={uploadProgress} className="h-2" />
              )}
              {isComplete ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                  <p className="font-medium text-success">
                    Document uploaded successfully!
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full gradient-primary"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Analyze Document"
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

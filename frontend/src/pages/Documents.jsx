import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Eye, Trash2, Grid, List, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { api } from "@/lib/api";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => api.get("/documents"),
  });

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="bg-background border border-border p-4 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">Delete Document?</h3>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this document? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toast.dismiss(t)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={async () => {
                toast.dismiss(t);
                try {
                  await api.delete(`/documents/${id}`);
                  queryClient.invalidateQueries(["documents"]);
                  toast.success("Document deleted successfully");
                } catch (err) {
                  toast.error(err.message || "Failed to delete document");
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const filtered = documents.filter((d) =>
    (d.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        }
      >
        {filtered.map((doc, i) => (
          <motion.div
            key={doc._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover-lift">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{doc.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {doc.documentType || "PDF"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {doc.isProcessed ? "Analyzed" : "Processing"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                       {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/documents/${doc._id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(doc._id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

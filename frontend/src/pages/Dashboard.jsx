import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Activity,
  HardDrive,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDashboardStats } from "@/data/mockData";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { api } from "@/lib/api";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => api.get("/documents"),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => api.get("/auth/stats"),
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

  const stats = [
    {
      title: "Total Documents",
      value: statsData?.totalDocuments || 0,
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "AI Queries Used",
      value: statsData?.aiQueriesUsed || 0,
      icon: MessageSquare,
      color: "text-accent",
    },
    {
      title: "Recent Activity",
      value: statsData?.recentActivity || "Inactive",
      icon: Activity,
      color: "text-success",
    },
    {
      title: "Storage Used",
      value: statsData?.storageUsed || "0 MB",
      icon: HardDrive,
      color: "text-warning",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-display font-bold mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Recent Documents</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/documents">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Document
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.slice(0, 5).map((doc) => (
                  <tr
                    key={doc._id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{doc.title}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{doc.documentType || "PDF"}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          doc.isProcessed
                            ? "default"
                            : "secondary"
                        }
                      >
                        {doc.isProcessed ? "Analyzed" : "Processing"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/documents/${doc._id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc._id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

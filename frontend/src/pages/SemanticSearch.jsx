import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockSearchResults } from "@/data/mockData";
import { Link } from "react-router-dom";

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results] = useState(mockSearchResults);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold mb-2">
          Semantic Search
        </h2>
        <p className="text-muted-foreground">
          Search legal documents by meaning, not just keywords
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search legal meaning..."
          className="h-14 pl-12 text-lg rounded-2xl"
        />
      </div>
      <div className="space-y-4">
        {results.map((result, i) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover-lift">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm mb-3">{result.clauseText}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{result.documentName}</span>
                      </div>
                      <Badge variant="secondary">
                        {Math.round(result.relevanceScore * 100)}% match
                      </Badge>
                    </div>
                  </div>
                  <Link
                    to={`/documents/${result.documentId}`}
                    className="text-primary hover:text-primary/80"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

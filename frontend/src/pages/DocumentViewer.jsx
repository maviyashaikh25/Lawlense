import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  List,
  AlertTriangle,
  MessageSquare,
  RefreshCw,
  Send,
  Bot,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "react-router-dom";

export default function DocumentViewer() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("content"); // Changed default
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const question = chatInput;
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsChatLoading(true);

    try {
      const res = await api.post("/chat/ask", { question });
      setMessages((prev) => [...prev, { role: "assistant", content: res.answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error processing your request." },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };
  const riskColors = {
    low: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
    high: "bg-destructive/10 text-destructive",
  };

  const {
    data: document,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["document", id],
    queryFn: () => api.get(`/documents/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex h-screen items-center justify-center text-destructive">
        Error loading document.
      </div>
    );
  }

  // Helper to parse summary points if structured, otherwise split by sentences or newlines
  const summaryPoints = document.summary
    ? document.summary
        .split(". ")
        .filter((s) => s.length > 10)
        .map((s) => (s.trim().endsWith(".") ? s : s + "."))
    : ["No summary available yet."];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-10rem)]">
      <div className="lg:col-span-3 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border py-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">{document.title}</CardTitle>
              <Badge variant="outline" className="ml-auto">
                {document.documentType}
              </Badge>
            </div>
          </CardHeader>
          <div className="flex flex-1 overflow-hidden">
            {/* Removed sidebar for sections as we might not have section parsing yet, just showing full text */}
            <ScrollArea className="flex-1 p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <h3 className="font-display font-semibold text-lg mb-3">
                  Content
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {document.preprocessedText || "Processing text..."}
                </p>
              </motion.div>
            </ScrollArea>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <Tabs defaultValue="summary" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4 pt-2">
              <TabsTrigger
                value="summary"
                className="data-[state=active]:bg-primary/10"
              >
                <List className="w-4 h-4 mr-1" />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="clauses"
                className="data-[state=active]:bg-primary/10"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Clauses
              </TabsTrigger>
              <TabsTrigger
                value="ask"
                className="data-[state=active]:bg-primary/10"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="flex-1 p-4 overflow-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">AI Summary</h4>
                  {document.summary ? (
                    <div className="space-y-3">
                        {document.summary.split('\n').filter(line => line.trim()).map((line, i) => (
                            <p key={i} className="text-base font-medium text-muted-foreground leading-relaxed">
                                {line}
                            </p>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Summary is being generated...
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="clauses" className="flex-1 p-4 overflow-auto">
              {document.clauses && document.clauses.length > 0 ? (
                <div className="space-y-4">
                  {document.clauses.map((clause, index) => {
                    // Risk badge logic
                    const riskKey = clause.risk ? clause.risk.toLowerCase() : "low";
                    const riskColor = riskColors[riskKey] || riskColors.low;
                    
                    // Confidence color logic
                    const score = clause.confidence * 100;
                    let scoreColor = "text-red-500";
                    if (score >= 75) scoreColor = "text-green-500";
                    else if (score >= 50) scoreColor = "text-yellow-600";

                      return (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-primary/10 text-primary border-primary/20"
                            >
                              {clause.title}
                            </Badge>
                            {clause.risk && (
                                <Badge variant="outline" className={`${riskColor} capitalize border-transparent`}>
                                    {clause.risk} Risk
                                </Badge>
                            )}
                             {clause.section && (
                                <Badge variant="secondary" className="text-xs">
                                    {clause.section}
                                </Badge>
                            )}
                          </div>
                          <span className={`text-xs font-medium ${scoreColor}`}>
                            {Math.round(score)}% Match
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 italic">
                            {clause.description}
                        </p>
                        <p className="text-base font-medium text-foreground/90 leading-loose">
                          {clause.original_text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                  <AlertTriangle className="w-8 h-8 opacity-20" />
                  <p>No specific clauses identified.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="ask" className="flex-1 flex flex-col p-4">
              <ScrollArea className="flex-1 mb-4 h-[400px]">
                <div className="space-y-4 px-2">
                    <div className="flex gap-2">
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="w-3 h-3 text-primary" />
                        </div>
                        <div className="bg-secondary rounded-xl px-3 py-2 text-sm max-w-[80%]">
                            Ask me anything about this document.
                        </div>
                    </div>

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                             {msg.role === 'assistant' && (
                                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="w-3 h-3 text-primary" />
                                </div>
                             )}
                            <div className={`rounded-xl px-3 py-2 text-sm max-w-[80%] ${
                                msg.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isChatLoading && (
                         <div className="flex gap-2">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                <Bot className="w-3 h-3 text-primary" />
                            </div>
                            <div className="bg-secondary rounded-xl px-3 py-2 text-sm">
                                <Loader2 className="w-3 h-3 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
              </ScrollArea>
              <form
                onSubmit={handleChatSubmit}
                className="flex gap-2"
              >
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about this document..."
                  disabled={isChatLoading}
                />
                <Button type="submit" size="icon" className="gradient-primary" disabled={isChatLoading}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

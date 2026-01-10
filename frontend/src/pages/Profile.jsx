import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

import { useEffect, useState } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    api
      .get("/auth/me")
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        if (
          err.message === "No token provided" ||
          err.message === "Invalid or expired token"
        ) {
          navigate("/login", { replace: true });
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center">
        Loading profile...
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center text-red-500">
        {error}
      </div>
    );
  }
  if (!user) {
    return null;
  }

  // Optionally, fetch document count and member since date if available
  // For now, show createdAt as member since
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display">
                {user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-display font-bold">
                {user.name || "User"}
              </h2>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user.email || "No email"}
              </p>
              <Badge className="mt-2">Free Plan</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: FileText,
            label: "Documents",
            value: user.documentCount !== undefined ? user.documentCount : "-",
          },
          {
            icon: Calendar,
            label: "Member Since",
            value: user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "-",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

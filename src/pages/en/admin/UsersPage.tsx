import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, User, Mail, Calendar, Search, Shield, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminUser {
  user_id: string;
  email_initial: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  auth_email: string;
  auth_created_at: string;
  last_sign_in_auth: string | null;
}

export default function UsersPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/en/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.rpc('admin_list_users', {
          p_limit: 200,
          p_offset: 0
        });

        if (error) {
          throw error;
        }

        setUsers(data || []);
      } catch (err) {
        console.error("[ADMIN USERS] Error fetching users:", err);
        setError("Failed to load users list");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, isAdmin, navigate]);

  const copyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    toast.success("User ID copied");
  };

  const formatUserId = (userId: string) => {
    return `${userId.slice(0, 8)}…${userId.slice(-4)}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never signed in";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(user => 
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email_initial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.auth_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUserDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-6"></div>
            <div className="h-10 bg-muted rounded mb-4"></div>
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-48"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => navigate("/en/admin")}
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? "No users match your search" : "No registered users yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.user_id} className="border-border cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-4" onClick={() => openUserDetails(user)}>
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.display_name?.charAt(0) || user.email_initial.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {user.display_name || "Member"}
                        </h3>
                        {user.last_sign_in_at && (
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {user.email_initial}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.auth_email}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {formatUserId(user.user_id)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyUserId(user.user_id);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div>Joined: {formatDate(user.created_at)}</div>
                        <div>Login: {formatDate(user.last_sign_in_at)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>

        {/* User Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Details
              </DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedUser.avatar_url || ""} />
                    <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                      {selectedUser.display_name?.charAt(0) || selectedUser.email_initial.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {selectedUser.display_name || "Member"}
                    </h3>
                    <p className="text-muted-foreground">{selectedUser.email_initial}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.auth_email}</p>
                  </div>
                </div>

                {/* User Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">User ID</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1">
                        {formatUserId(selectedUser.user_id)}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyUserId(selectedUser.user_id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Badge variant={selectedUser.last_sign_in_at ? "default" : "secondary"}>
                      {selectedUser.last_sign_in_at ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Account Created</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedUser.auth_created_at)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Profile Created</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedUser.created_at)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Sign In (Auth)</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedUser.last_sign_in_auth)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Sign In (Profile)</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedUser.last_sign_in_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

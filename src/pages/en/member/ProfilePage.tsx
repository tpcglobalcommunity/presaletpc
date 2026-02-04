import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, User, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  user_id: string;
  email_initial: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/en/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, email_initial, display_name, avatar_url, created_at, last_sign_in_at')
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (err) {
        console.error("[PROFILE] Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const copyUserId = () => {
    if (profile?.user_id) {
      navigator.clipboard.writeText(profile.user_id);
      toast.success("User ID copied");
    }
  };

  const formatUserId = (userId: string) => {
    return `${userId.slice(0, 8)}…${userId.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDisplayName = () => {
    if (profile?.display_name) {
      return profile.display_name;
    }
    return profile?.email_initial?.split('@')[0] || "Member";
  };

  const getInitial = () => {
    if (profile?.display_name) {
      return profile.display_name.charAt(0).toUpperCase();
    }
    return profile?.email_initial?.charAt(0).toUpperCase() || "M";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-6"></div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-48"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">{error || "Profile not found"}</p>
            <Button 
              onClick={() => navigate("/en/member/dashboard")}
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your profile information</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  {getInitial()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {getDisplayName()}
                </h3>
                <p className="text-muted-foreground">{profile.email_initial}</p>
                <Badge variant="secondary" className="mt-1">
                  Active
                </Badge>
              </div>
            </div>

            {/* User ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                User ID
              </label>
              <div className="flex items-center space-x-2">
                <code className="bg-muted px-3 py-2 rounded text-sm font-mono flex-1">
                  {formatUserId(profile.user_id)}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyUserId}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="text-sm text-muted-foreground">{profile.email_initial}</p>
            </div>

            {/* Created At */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </label>
              <p className="text-sm text-muted-foreground">
                {formatDate(profile.created_at)}
              </p>
            </div>

            {/* Last Sign In */}
            {profile.last_sign_in_at && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Last Sign In
                </label>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.last_sign_in_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

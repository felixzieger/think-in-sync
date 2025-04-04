
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogIn, LogOut, User } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: t.auth.logoutSuccess.title,
      description: t.auth.logoutSuccess.description,
    });
    navigate("/");
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:inline-block">
            {user.email}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline-block">
              {t.auth.form.logout || "Logout"}
            </span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/auth/login">
              <LogIn className="h-4 w-4" />
              <span className="hidden md:inline-block">{t.auth.login.linkText}</span>
            </Link>
          </Button>
          <Button
            variant="default"
            size="sm"
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/auth/register">
              <User className="h-4 w-4" />
              <span className="hidden md:inline-block">{t.auth.register.linkText}</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

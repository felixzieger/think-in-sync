import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    handleSignInWithGoogle: (response: { credential: string }) => Promise<void>;
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => Promise<void>;
            auto_select?: boolean;
            itp_support?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const Login = () => {
  const { signIn, signInWithGoogle, signInWithGitHub, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslation();
  const isEmbedded = !!import.meta.env.VITE_HUGGINGFACE;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Add Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      // Initialize Google Identity Services
      window.google?.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: window.handleSignInWithGoogle,
        auto_select: false,
        itp_support: true,
        use_fedcm_for_prompt: true
      });

      // Display the One Tap dialog
      window.google?.accounts.id.prompt();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (user && isOAuthLoading) {
      setIsOAuthLoading(false);
      toast({
        title: t.auth.loginSuccess.title,
        description: t.auth.loginSuccess.description,
      });
      navigate("/");
    }
  }, [user, isOAuthLoading, navigate, toast, t.auth.loginSuccess]);

  useEffect(() => {
    // Initialize Google One Tap
    window.handleSignInWithGoogle = async (response) => {
      try {
        if (!response.credential) {
          throw new Error('No credential received from Google');
        }
        
        setIsOAuthLoading(true);
        const { error } = await signInWithGoogle(response.credential);
        
        if (error) {
          setIsOAuthLoading(false);
          toast({
            variant: "destructive",
            title: t.auth.loginError.title,
            description: error.message,
          });
        }
      } catch (error) {
        setIsOAuthLoading(false);
        toast({
          variant: "destructive",
          title: t.auth.loginError.title,
          description: t.auth.loginError.description,
        });
      }
    };
  }, [signInWithGoogle, toast, t.auth.loginError]);

  const handleGitHubLogin = async () => {
    try {
      setIsOAuthLoading(true);
      const { error } = await signInWithGitHub();
      
      if (error) {
        setIsOAuthLoading(false);
        toast({
          variant: "destructive",
          title: t.auth.loginError.title,
          description: error.message,
        });
      }
    } catch (error) {
      setIsOAuthLoading(false);
      toast({
        variant: "destructive",
        title: t.auth.loginError.title,
        description: t.auth.loginError.description,
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const { error, success } = await signIn(values.email, values.password);
      
      if (success) {
        toast({
          title: t.auth.loginSuccess.title,
          description: t.auth.loginSuccess.description,
        });
        navigate("/");
      } else if (error) {
        toast({
          variant: "destructive",
          title: t.auth.loginError.title,
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.auth.loginError.title,
        description: t.auth.loginError.description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      {isOAuthLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Authenticating...</p>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t.auth.login.title}</h1>
            <p className="mt-2 text-sm text-gray-600">{t.auth.login.subtitle}</p>
          </div>
          
          <div className="flex flex-col gap-4 items-center">
            <div
              id="g_id_onload"
              data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              data-context="signin"
              data-ux_mode="popup"
              data-callback="handleSignInWithGoogle"
              data-auto_select="false"
              data-itp_support="true"
              data-use_fedcm_for_prompt="true"
            />
            
            <div className="w-full flex justify-center">
              <div 
                className="g_id_signin"
                data-type="standard"
                data-shape="pill"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2 h-10 rounded-full border-2 px-6"
              onClick={handleGitHubLogin}
              disabled={isLoading || isEmbedded}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </Button>
            {isEmbedded && (
              <p className="text-sm text-muted-foreground text-center">
                Social logins are only available on{" "}
                <a 
                  href="https://think-in-sync.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  think-in-sync.com
                </a>
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.form.email}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@example.com" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.form.password}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t.auth.login.loggingIn : t.auth.login.submit}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            <p>
              {t.auth.login.noAccount}{" "}
              <Link to="/auth/register" className="font-medium text-primary hover:underline">
                {t.auth.register.linkText}
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

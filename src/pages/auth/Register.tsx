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

declare global {
  interface Window {
    handleSignInWithGoogle: (response: { credential: string }) => Promise<void>;
    google?: {
      accounts: {
        id: {
          prompt: () => void;
        };
      };
    };
  }
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const Register = () => {
  const { signUp, signInWithGoogle, signInWithGitHub } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Add Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Initialize Google One Tap
    window.handleSignInWithGoogle = async (response) => {
      try {
        if (!response.credential) {
          throw new Error('No credential received from Google');
        }
        
        const { error, success } = await signInWithGoogle();
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
      }
    };
  }, [signInWithGoogle, toast, navigate, t.auth.loginSuccess, t.auth.loginError]);

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true);
      const { error, success } = await signInWithGitHub();
      
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const { error, success } = await signUp(values.email, values.password);
      
      if (success) {
        toast({
          title: t.auth.registerSuccess.title,
          description: t.auth.registerSuccess.description,
        });
        navigate("/auth/login");
      } else if (error) {
        toast({
          variant: "destructive",
          title: t.auth.registerError.title,
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.auth.registerError.title,
        description: t.auth.registerError.description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t.auth.register.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.auth.register.description}</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div
            id="g_id_onload"
            data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            data-context="signin"
            data-ux_mode="popup"
            data-callback="handleSignInWithGoogle"
            data-itp_support="true"
          />
          
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              window.google?.accounts.id.prompt();
            }}
            disabled={isLoading}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGitHubLogin}
            disabled={isLoading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </Button>
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
                  <FormLabel>{t.auth.register.email}</FormLabel>
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
                  <FormLabel>{t.auth.register.password}</FormLabel>
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
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.auth.register.confirmPassword}</FormLabel>
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
              {isLoading ? t.auth.register.registering : t.auth.register.submit}
            </Button>
          </form>
        </Form>
        
        <div className="mt-4 text-center text-sm">
          <p>
            {t.auth.register.haveAccount}{" "}
            <Link to="/auth/login" className="font-medium text-primary hover:underline">
              {t.auth.register.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

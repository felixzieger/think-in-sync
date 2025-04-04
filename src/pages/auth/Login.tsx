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
  }
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslation();
  
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
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t.auth.login.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.auth.login.subtitle}</p>
        </div>
        
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
          className="w-full flex items-center justify-center gap-2 mb-4"
          onClick={() => {
            // @ts-ignore - google is added by the script
            window.google?.accounts.id.prompt();
          }}
          disabled={isLoading}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continue with Google
        </Button>

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
    </div>
  );
};

export default Login;

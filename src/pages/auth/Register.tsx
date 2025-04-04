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
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const Register = () => {
  const { signUp, signInWithGoogle } = useAuth();
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
        
        <div
          id="g_id_onload"
          data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleSignInWithGoogle"
          data-auto_select="true"
          data-itp_support="true"
          data-use_fedcm_for_prompt="true"
        />
        <div
          className="g_id_signin flex justify-center mb-4"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        />

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

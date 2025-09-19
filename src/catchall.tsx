import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { PWAUpdatePrompt } from "@/components/pwa/PWAUpdatePrompt";

const queryClient = new QueryClient();

export default function Component() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster />
        <PWAUpdatePrompt />
      </AuthProvider>
    </QueryClientProvider>
  );
}
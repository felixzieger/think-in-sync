import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
const Index = lazy(() => import("@/pages/Index"));
const Credits = lazy(() => import("@/pages/Credits"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
import { Toaster } from "@/components/ui/toaster";
import { PWAUpdatePrompt } from "@/components/pwa/PWAUpdatePrompt";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/game" element={<Index />} />
              <Route path="/game/daily/model" element={<Index />} />
              <Route path="/game/freestyle/theme" element={<Index />} />
              <Route path="/game/freestyle/model" element={<Index />} />
              <Route path="/game/:gameId" element={<Index />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
            </Routes>
          </Suspense>
          <Toaster />
          <PWAUpdatePrompt />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

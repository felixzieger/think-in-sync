
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import { AdminIndex } from "@/pages/admin/Index";
import { AdminLogin } from "@/pages/admin/Login";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<Index />} />
            <Route path="/game/:gameId" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminIndex />
              </ProtectedRoute>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

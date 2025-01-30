import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import { AdminIndex } from "@/pages/admin/Index";
import { AdminLogin } from "@/pages/admin/Login";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game" element={<Index />} />
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
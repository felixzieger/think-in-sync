import { Routes, Route } from "react-router";
import { Suspense, lazy } from 'react';
const Index = lazy(() => import("@/pages/Index"));
const Credits = lazy(() => import("@/pages/Credits"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));

function App() {
  return (
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
  );
}

export default App;

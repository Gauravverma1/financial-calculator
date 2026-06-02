// Financial Calculator Core Application
// Developed by: [Your Name]
// Last Updated: [Current Date]

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileMenu from "./components/ProfileMenu";
import PrivateRoute from "./components/PrivateRoute";

// Custom Query Client Configuration
const queryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
};

const queryClient = new QueryClient(queryClientConfig);

// Application Configuration
const appConfig = {
  name: "Financial Calculator",
  version: "1.0.0",
  author: "[Your Name]",
  description: "A comprehensive financial calculator for personal finance management",
};

const AppRoutes = () => {
  const location = useLocation();
  const hideProfileMenu = location.pathname === '/login' || location.pathname === '/register';
  return (
    <>
      {!hideProfileMenu && <ProfileMenu />}
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Index />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  console.log(`Starting ${appConfig.name} v${appConfig.version}`);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

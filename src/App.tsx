import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VendorsPage from "./pages/VendorsPage";
import VersionsPage from "./pages/VersionsPage";
import VersionDetailPage from "./pages/VersionDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to vendors */}
            <Route path="/" element={<Navigate to="/vendors" replace />} />
            
            {/* Vendor Routes */}
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/vendors/:vendorId/versions" element={<VersionsPage />} />
            <Route path="/vendors/:vendorId/versions/:versionId" element={<VersionDetailPage />} />
            
            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

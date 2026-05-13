import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { AuditPage } from "./pages/audit-page";
import { LandingPage } from "./pages/landing-page";
import { PublicReportPage } from "./pages/public-report-page";
import { ResultsPage } from "./pages/results-page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function ReportToAuditRedirect() {
  const { shareId } = useParams<{ shareId: string }>();
  return <Navigate to={shareId ? `/audit/${shareId}` : "/"} replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="credex-theme">
        <Router>
          <div className="bg-background min-h-screen font-sans antialiased">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/audit/:shareId" element={<PublicReportPage />} />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/results/:shareId" element={<ResultsPage />} />
              <Route path="/report/:shareId" element={<ReportToAuditRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

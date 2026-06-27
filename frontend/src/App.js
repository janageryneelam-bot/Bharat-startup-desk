import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { ProfileProvider } from "@/lib/profile";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import Landing from "@/pages/Landing";
import Explore from "@/pages/Explore";
import Onboarding from "@/pages/Onboarding";
import RegisterBusiness from "@/pages/RegisterBusiness";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import Overview from "@/pages/dashboard/Overview";
import Compliance from "@/pages/dashboard/Compliance";
import Schemes from "@/pages/dashboard/Schemes";
import StateIntel from "@/pages/dashboard/StateIntel";
import Licenses from "@/pages/dashboard/Licenses";
import Trademark from "@/pages/dashboard/Trademark";
import Roadmap from "@/pages/dashboard/Roadmap";
import Copilot from "@/pages/dashboard/Copilot";
import IdeaValidator from "@/pages/dashboard/IdeaValidator";
import Admin from "@/pages/Admin";

const guard = (el) => <ErrorBoundary>{el}</ErrorBoundary>;

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <BrowserRouter>
          <ErrorBoundary>
          <Routes>
            <Route path="/" element={guard(<Landing />)} />
            <Route path="/explore" element={guard(<Explore />)} />
            <Route path="/onboarding" element={guard(<Onboarding />)} />
            <Route path="/register-business" element={guard(<RegisterBusiness />)} />
            <Route path="/admin" element={guard(<Admin />)} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={guard(<Overview />)} />
              <Route path="compliance" element={guard(<Compliance />)} />
              <Route path="schemes" element={guard(<Schemes />)} />
              <Route path="state" element={guard(<StateIntel />)} />
              <Route path="licenses" element={guard(<Licenses />)} />
              <Route path="trademark" element={guard(<Trademark />)} />
              <Route path="roadmap" element={guard(<Roadmap />)} />
              <Route path="copilot" element={guard(<Copilot />)} />
              <Route path="validator" element={guard(<IdeaValidator />)} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </ErrorBoundary>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </ProfileProvider>
    </ThemeProvider>
  );
}

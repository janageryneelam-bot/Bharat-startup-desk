import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { ProfileProvider } from "@/lib/profile";
import { Toaster } from "@/components/ui/sonner";
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

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/register-business" element={<RegisterBusiness />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="compliance" element={<Compliance />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="state" element={<StateIntel />} />
              <Route path="licenses" element={<Licenses />} />
              <Route path="trademark" element={<Trademark />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="copilot" element={<Copilot />} />
              <Route path="validator" element={<IdeaValidator />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </ProfileProvider>
    </ThemeProvider>
  );
}

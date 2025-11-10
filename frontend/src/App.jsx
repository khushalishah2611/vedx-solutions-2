import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminLoginPage from './components/admin/AdminLoginPage.jsx';
import AdminDashboardPage from './components/admin/AdminDashboardPage.jsx';
import AdminContactsPage from './components/admin/AdminContactsPage.jsx';
import AdminProfilePage from './components/admin/AdminProfilePage.jsx';
import AdminChangePasswordPage from './components/admin/AdminChangePasswordPage.jsx';
import AdminForgotPasswordPage from './components/admin/AdminForgotPasswordPage.jsx';
import AdminVerifyOtpPage from './components/admin/AdminVerifyOtpPage.jsx';
import AdminResetPasswordPage from './components/admin/AdminResetPasswordPage.jsx';
import HomePage from './components/pages/HomePage.jsx';
import ServicesPage from './components/pages/ServicesPage.jsx';
import ServiceDetailPage from './components/pages/ServiceDetailPage.jsx';
import ComingSoonPage from './components/shared/ComingSoonPage.jsx';
import NotFoundPage from './components/shared/NotFoundPage.jsx';
import BlogListPage from './components/pages/BlogListPage.jsx';
import BlogDetailPage from './components/pages/BlogDetailPage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Routes>
          <Route path="/admin">
            <Route index element={<AdminLoginPage />} />
            <Route path="forgot-password" element={<AdminForgotPasswordPage />} />
            <Route path="verify-otp" element={<AdminVerifyOtpPage />} />
            <Route path="reset-password" element={<AdminResetPasswordPage />} />
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="contacts" element={<AdminContactsPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
              <Route path="change-password" element={<AdminChangePasswordPage />} />
            </Route>
          </Route>
          <Route path="/" element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services">
              <Route index element={<ServicesPage />} />
              <Route path=":categorySlug/:serviceSlug" element={<ServiceDetailPage />} />
            </Route>
            <Route
              path="about"
              element={
                <ComingSoonPage
                  title="About Vedx Solutions"
                  description="We are curating a detailed story about our mission, our people, and the values that drive every solution we build. Check back soon to explore the journey."
                />
              }
            />
             <Route
              path="casestudy"
              element={
                <ComingSoonPage
                  title="Case Study Vedx Solutions"
                  description="We are curating a detailed story about our mission, our people, and the values that drive every solution we build. Check back soon to explore the journey."
                />
              }
            />
            <Route
              path="ourprojects"
              element={
                <ComingSoonPage
                  title="Our Projects Vedx Solutions"
                  description="We are curating a detailed story about our mission, our people, and the values that drive every solution we build. Check back soon to explore the journey."
                />
              }
            />
            <Route path="blog">
              <Route index element={<BlogListPage />} />
              <Route path=":slug" element={<BlogDetailPage />} />
            </Route>
            <Route
              path="contact"
              element={
                <ComingSoonPage
                  title="Let's Connect"
                  description="A refreshed contact experience is on its way. In the meantime, drop us a line at hello@vedxsolution.com and we will get back within one business day."
                  primaryActionHref="mailto:hello@vedxsolution.com"
                  ctaLabel="Email Us"
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;

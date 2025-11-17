import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminLoginPage from './components/admin/AdminLoginPage.jsx';
import AdminDashboardPage from './components/admin/AdminDashboardPage.jsx';
import AdminContactsPage from './components/admin/AdminContactsPage.jsx';
import AdminProfilePage from './components/admin/AdminProfilePage.jsx';
import AdminChangePasswordPage from './components/admin/AdminChangePasswordPage.jsx';
import AdminBlogsPage from './components/admin/AdminBlogsPage.jsx';
import AdminForgotPasswordPage from './components/admin/AdminForgotPasswordPage.jsx';
import AdminVerifyOtpPage from './components/admin/AdminVerifyOtpPage.jsx';
import AdminResetPasswordPage from './components/admin/AdminResetPasswordPage.jsx';
import HomePage from './components/pages/HomePage.jsx';
import ServicesPage from './components/pages/ServicesPage.jsx';
import ServiceDetailPage from './components/pages/ServiceDetailPage.jsx';
import HireDevelopersPage from './components/pages/HireDevelopersPage.jsx';
import HireDeveloperDetailPage from './components/pages/HireDeveloperDetailPage.jsx';
import ComingSoonPage from './components/shared/ComingSoonPage.jsx';
import NotFoundPage from './components/shared/NotFoundPage.jsx';
import BlogListPage from './components/pages/BlogListPage.jsx';
import BlogDetailPage from './components/pages/BlogDetailPage.jsx';
import AboutPage from './components/pages/AboutPage.jsx';
import CareersPage from './components/pages/CareersPage.jsx';
import ContactPage from './components/pages/ContactPage.jsx';
import CaseStudiesPage from './components/pages/CaseStudiesPage.jsx';
import CaseStudyDetailPage from './components/pages/CaseStudyDetailPage.jsx';

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
              <Route path="blogs" element={<AdminBlogsPage />} />
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
            <Route path="hire-developers">
              <Route index element={<HireDevelopersPage />} />
              <Route path=":categorySlug/:roleSlug" element={<HireDeveloperDetailPage />} />
          
            </Route>
            <Route path="about" element={<AboutPage />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="casestudy">
              <Route index element={<CaseStudiesPage />} />
              <Route path=":slug" element={<CaseStudyDetailPage />} />
            </Route>
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
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;

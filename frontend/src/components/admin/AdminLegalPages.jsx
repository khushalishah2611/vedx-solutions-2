import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Tab, Tabs, Typography } from '@mui/material';

import { AppButton, AppTextField } from '../shared/FormControls.jsx';
import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const AdminLegalPages = () => {
  const { fetchWithLoading } = useLoadingFetch();
  const [activeTab, setActiveTab] = useState('privacy');
  const [privacyForm, setPrivacyForm] = useState({ id: '', description: '' });
  const [termsForm, setTermsForm] = useState({ id: '', description: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Your session expired. Please log in again.');
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    let isMounted = true;

    const loadPolicies = async () => {
      setError('');
      try {
        const headers = getAuthHeaders();
        const [privacyRes, termsRes] = await Promise.all([
          fetchWithLoading(apiUrl('/api/admin/privacy-policy'), { headers }),
          fetchWithLoading(apiUrl('/api/admin/terms-conditions'), { headers }),
        ]);

        const [privacyData, termsData] = await Promise.all([privacyRes.json(), termsRes.json()]);

        if (!privacyRes.ok) {
          throw new Error(privacyData?.message || 'Unable to load privacy policy.');
        }
        if (!termsRes.ok) {
          throw new Error(termsData?.message || 'Unable to load terms and conditions.');
        }

        if (!isMounted) return;
        setPrivacyForm({
          id: privacyData?.policy?.id || '',
          description: privacyData?.policy?.description || '',
        });
        setTermsForm({
          id: termsData?.terms?.id || '',
          description: termsData?.terms?.description || '',
        });
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || 'Unable to load legal pages.');
      }
    };

    loadPolicies();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  const handleSave = async () => {
    setError('');
    setSaving(true);

    try {
      const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() };

      if (activeTab === 'privacy') {
        const response = await fetchWithLoading(apiUrl('/api/admin/privacy-policy'), {
          method: 'POST',
          headers,
          body: JSON.stringify(privacyForm),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Unable to save privacy policy.');
        setPrivacyForm((prev) => ({ ...prev, id: data?.policy?.id || prev.id }));
      } else {
        const response = await fetchWithLoading(apiUrl('/api/admin/terms-conditions'), {
          method: 'POST',
          headers,
          body: JSON.stringify(termsForm),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Unable to save terms and conditions.');
        setTermsForm((prev) => ({ ...prev, id: data?.terms?.id || prev.id }));
      }
    } catch (err) {
      setError(err?.message || 'Unable to save legal content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 3, md: 6 }, py: 4 }}>
      <Card>
        <CardHeader
          title="Legal Pages"
          subheader="Manage the Privacy Policy and Terms and Condition content (HTML supported)."
        />
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            sx={{ mb: 3 }}
          >
            <Tab label="Privacy Policy" value="privacy" />
            <Tab label="Terms and Condition" value="terms" />
          </Tabs>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {activeTab === 'privacy' ? (
            <AppTextField
              label="Privacy Policy (HTML allowed)"
              value={privacyForm.description}
              onChange={(event) =>
                setPrivacyForm((prev) => ({ ...prev, description: event.target.value }))
              }
              multiline
              minRows={12}
              fullWidth
            />
          ) : (
            <AppTextField
              label="Terms and Condition (HTML allowed)"
              value={termsForm.description}
              onChange={(event) =>
                setTermsForm((prev) => ({ ...prev, description: event.target.value }))
              }
              multiline
              minRows={12}
              fullWidth
            />
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <AppButton variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </AppButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminLegalPages;

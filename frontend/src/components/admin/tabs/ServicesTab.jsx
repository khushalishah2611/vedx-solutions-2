import * as React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import SelectClearAdornment from '../SelectClearAdornment.jsx';

function ValidationDialog({ open, title, messages, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title || 'Validation'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.25}>
          {(messages || []).map((msg, idx) => (
            <Alert key={idx} severity="error" variant="outlined">
              {msg}
            </Alert>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const ServicesTab = ({
  dateFilterOptions,
  serviceDateFilter,
  setServiceDateFilter,

  categoryFilter,
  setCategoryFilter,
  categoryOptions,

  subcategoryFilter,
  setSubcategoryFilter,
  subcategoryLookup,
  allSubcategoryOptions,

  serviceDateRange,
  setServiceDateRange,

  groupedServices,
  imagePlaceholder,

  setViewService,
  openServiceEditDialog,
  openServiceDeleteDialog,

  filteredServices,
  rowsPerPage,
  servicePage,
  setServicePage,

  openServiceCreateDialog,
}) => {
  const [validationOpen, setValidationOpen] = React.useState(false);
  const [validationTitle, setValidationTitle] = React.useState('Validation');
  const [validationMessages, setValidationMessages] = React.useState([]);

  const showValidation = (messages, title = 'Validation') => {
    setValidationTitle(title);
    setValidationMessages(Array.isArray(messages) ? messages : [String(messages)]);
    setValidationOpen(true);
  };

  return (
    <>
      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Service menu"
          subheader="Manage category wise banners, sub-categories, and project statistics."
          action={
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openServiceCreateDialog}>
              Add service
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'flex-end' }}
            mb={2}
          >
            <TextField
              select
              label="Date"
              value={serviceDateFilter}
              onChange={(event) => {
                const next = event.target.value;
                setServiceDateFilter(next);
                setServicePage?.(1);
              }}
              InputProps={{
                endAdornment: (
                  <SelectClearAdornment
                    visible={serviceDateFilter !== 'all'}
                    onClear={() => {
                      setServiceDateFilter('all');
                      setServicePage?.(1);
                    }}
                  />
                ),
              }}
              sx={{ minWidth: 220 }}
            >
              {(dateFilterOptions || []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Category"
              value={categoryFilter}
              onChange={(event) => {
                const next = event.target.value;

                // if category cleared -> clear subcategory
                if (!next && subcategoryFilter) setSubcategoryFilter('');

                // if category changed -> if current subcategory not valid -> clear it
                if (next && subcategoryFilter) {
                  const allowed = (subcategoryLookup?.get(next) || []).map(String);
                  if (allowed.length > 0 && !allowed.includes(String(subcategoryFilter))) {
                    setSubcategoryFilter('');
                  }
                }

                setCategoryFilter(next);
                setServicePage?.(1);
              }}
              InputProps={{
                endAdornment: (
                  <SelectClearAdornment
                    visible={Boolean(categoryFilter)}
                    onClear={() => {
                      setCategoryFilter('');
                      setSubcategoryFilter('');
                      setServicePage?.(1);
                    }}
                  />
                ),
              }}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="">All categories</MenuItem>
              {(categoryOptions || []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Sub-category"
              value={subcategoryFilter}
              onChange={(event) => {
                const next = event.target.value;

                // If user tries to pick subcategory without category -> show dialog
                if (next && !categoryFilter) {
                  showValidation(['Please select a category first, then choose sub-category.'], 'Filter validation');
                  return;
                }

                // Validate subcategory belongs to selected category
                if (next && categoryFilter) {
                  const allowed = (subcategoryLookup?.get(categoryFilter) || []).map(String);
                  if (allowed.length > 0 && !allowed.includes(String(next))) {
                    showValidation(['Selected sub-category is not valid for the chosen category.'], 'Filter validation');
                    return;
                  }
                }

                setSubcategoryFilter(next);
                setServicePage?.(1);
              }}
              InputProps={{
                endAdornment: (
                  <SelectClearAdornment
                    visible={Boolean(subcategoryFilter)}
                    onClear={() => {
                      setSubcategoryFilter('');
                      setServicePage?.(1);
                    }}
                  />
                ),
              }}
              sx={{ minWidth: 240 }}
            >
              <MenuItem value="">All sub-categories</MenuItem>
              {(categoryFilter ? subcategoryLookup?.get(categoryFilter) || [] : allSubcategoryOptions || []).map(
                (name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                )
              )}
            </TextField>

            {serviceDateFilter === 'custom' && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
                <TextField
                  type="date"
                  label="From"
                  value={serviceDateRange?.start || ''}
                  onChange={(event) =>
                    setServiceDateRange?.((prev) => ({ ...(prev || {}), start: event.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="To"
                  value={serviceDateRange?.end || ''}
                  onChange={(event) => setServiceDateRange?.((prev) => ({ ...(prev || {}), end: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>
            )}
          </Stack>

          <Stack spacing={1.5}>
            {(groupedServices || []).map(({ category, services }) => (
              <Accordion key={category} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <Typography variant="subtitle1" fontWeight={700}>
                      {category}
                    </Typography>
                    <Chip label={`${services.length} entr${services.length === 1 ? 'y' : 'ies'}`} size="small" />
                    <Chip
                      label={`${services.reduce((sum, item) => sum + (item.subcategories?.length || 0), 0)} sub-categories`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Stack spacing={1.5}>
                    {(services || []).map((service) => (
                      <Card key={service.id} variant="outlined">
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Sub-categories
                              </Typography>

                              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                                {(service.subcategories || []).map((item) => (
                                  <Chip key={item.name} label={item.name} size="small" />
                                ))}
                              </Stack>

                              <Chip label={`${service.faqs?.length || 0} FAQs`} size="small" sx={{ mt: 1 }} />
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Banner Preview
                              </Typography>

                              <Box
                                component="img"
                                src={service.bannerImage || imagePlaceholder}
                                alt={`${service.category} banner`}
                                sx={{
                                  width: '100%',
                                  height: 120,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                }}
                              />

                              <Typography variant="body2" fontWeight={600} noWrap mt={1}>
                                {service.bannerTitle}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} md={3}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Totals
                              </Typography>

                              <Typography variant="body2">Services: {service.totalServices}</Typography>
                              <Typography variant="body2">Projects: {service.totalProjects}</Typography>
                              <Typography variant="body2">Clients: {service.totalClients}</Typography>
                            </Grid>

                            <Grid item xs={12} md={1} display="flex" alignItems="flex-end">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="View details">
                                  <IconButton size="small" onClick={() => setViewService?.(service)}>
                                    <VisibilityOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => openServiceEditDialog?.(service)}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => openServiceDeleteDialog?.(service)}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredServices?.length === 0 && (
                      <Typography variant="body2" color="text.secondary" align="center">
                        No service categories yet. Click "Add service" to create your first entry.
                      </Typography>
                    )}
                  </Stack>

                  <Stack mt={2} alignItems="flex-end">
                    <Pagination
                      count={Math.max(1, Math.ceil((filteredServices?.length || 0) / rowsPerPage))}
                      page={servicePage}
                      onChange={(event, page) => setServicePage?.(page)}
                      color="primary"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Validation dialog */}
      <ValidationDialog
        open={validationOpen}
        title={validationTitle}
        messages={validationMessages}
        onClose={() => setValidationOpen(false)}
      />
    </>
  );
};

export default ServicesTab;

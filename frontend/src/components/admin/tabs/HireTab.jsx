import * as React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SelectClearAdornment from '../SelectClearAdornment.jsx';
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
import PropTypes from 'prop-types';

const HireTab = ({
  categoryOptions,
  subcategoryLookup,
  allSubcategoryOptions,
  categoryFilter,
  setCategoryFilter,
  subcategoryFilter,
  setSubcategoryFilter,
  groupedHireServices,
  hireContent,
  rowsPerPage,
  hireServicePage,
  setHireServicePage,
  openHireServiceCreateDialog,
  openHireServiceEditDialog,
  openHireServiceDeleteDialog,
  imagePlaceholder,
}) => {
  const [validationOpen, setValidationOpen] = React.useState(false);
  const [validationTitle, setValidationTitle] = React.useState('Validation');
  const [validationMessages, setValidationMessages] = React.useState([]);

  const showValidation = (messages, title = 'Validation') => {
    setValidationTitle(title);
    setValidationMessages(Array.isArray(messages) ? messages : [String(messages)]);
    setValidationOpen(true);
  };

  const subOptions = categoryFilter ? subcategoryLookup.get(categoryFilter) || [] : allSubcategoryOptions;

  return (
    <>
      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Development services"
          subheader="Manage the service tiles shown within the development services menu."
          action={
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={openHireServiceCreateDialog}
            >
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
              label="Category"
              value={categoryFilter}
              onChange={(event) => {
                const next = event.target.value;

                if (!next && subcategoryFilter) setSubcategoryFilter('');
                if (next && subcategoryFilter) {
                  const allowed = (subcategoryLookup.get(next) || []).map(String);
                  if (allowed.length > 0 && !allowed.includes(String(subcategoryFilter))) {
                    setSubcategoryFilter('');
                  }
                }

                setCategoryFilter(next);
                setHireServicePage?.(1);
              }}
              InputProps={{
                endAdornment: (
                  <SelectClearAdornment
                    visible={Boolean(categoryFilter)}
                    onClear={() => {
                      setCategoryFilter('');
                      if (subcategoryFilter) setSubcategoryFilter('');
                      setHireServicePage?.(1);
                    }}
                  />
                ),
              }}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="">All categories</MenuItem>
              {categoryOptions.map((option) => (
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

                if (next && !categoryFilter) {
                  showValidation(['Please select a category first, then choose sub-category.'], 'Filter validation');
                  return;
                }

                if (next && categoryFilter) {
                  const allowed = (subcategoryLookup.get(categoryFilter) || []).map(String);
                  if (allowed.length > 0 && !allowed.includes(String(next))) {
                    showValidation(['Selected sub-category is not valid for the chosen category.'], 'Filter validation');
                    return;
                  }
                }

                setSubcategoryFilter(next);
                setHireServicePage?.(1);
              }}
              InputProps={{
                endAdornment: (
                  <SelectClearAdornment
                    visible={Boolean(subcategoryFilter)}
                    onClear={() => {
                      setSubcategoryFilter('');
                      setHireServicePage?.(1);
                    }}
                  />
                ),
              }}
              sx={{ minWidth: 240 }}
              disabled={categoryFilter ? (subcategoryLookup.get(categoryFilter) || []).length === 0 : (allSubcategoryOptions || []).length === 0}
            >
              <MenuItem value="">All sub-categories</MenuItem>
              {subOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack spacing={1.5}>
            {groupedHireServices.map(({ category, services }) => (
              <Accordion key={category} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <Typography variant="subtitle1" fontWeight={700}>
                      {category}
                    </Typography>
                    <Chip label={`${services.length} service${services.length === 1 ? '' : 's'}`} size="small" />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {services.map((service) => (
                      <Grid item xs={12} md={6} key={service.id}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Stack spacing={1.5} height="100%">
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-start' }}>
                                <Stack spacing={0.5} flex={1}>
                                  <Typography variant="subtitle1" fontWeight={700}>
                                    {service.title}
                                  </Typography>
                                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                                    <Chip
                                      label={service.category || 'Uncategorised'}
                                      size="small"
                                      color={service.category ? 'default' : 'warning'}
                                    />
                                    <Chip
                                      label={service.subcategory || 'No sub-category'}
                                      size="small"
                                      variant="outlined"
                                      color={service.subcategory ? 'primary' : 'default'}
                                    />
                                  </Stack>
                                </Stack>
                                <Box component="img" src={service.image || imagePlaceholder} alt={`${service.title} preview`} sx={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 1 }} />
                              </Stack>

                              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                {service.description || 'No description added yet.'}
                              </Typography>

                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit">
                                  <IconButton size="small" color="primary" onClick={() => openHireServiceEditDialog(service)}>
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton size="small" color="error" onClick={() => openHireServiceDeleteDialog(service)}>
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            {hireContent.services.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center">
                No development services configured yet.
              </Typography>
            )}
          </Stack>

          <Stack mt={2} alignItems="flex-end">
            <Pagination
              count={Math.max(1, Math.ceil(hireContent.services.length / rowsPerPage))}
              page={hireServicePage}
              onChange={(event, page) => setHireServicePage(page)}
              color="primary"
            />
          </Stack>
        </CardContent>
      </Card>

      <ValidationDialog
        open={validationOpen}
        title={validationTitle}
        messages={validationMessages}
        onClose={() => setValidationOpen(false)}
      />
    </>
  );
};

HireTab.propTypes = {
  categoryOptions: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })).isRequired,
  subcategoryLookup: PropTypes.instanceOf(Map).isRequired,
  allSubcategoryOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  categoryFilter: PropTypes.string.isRequired,
  setCategoryFilter: PropTypes.func.isRequired,
  subcategoryFilter: PropTypes.string.isRequired,
  setSubcategoryFilter: PropTypes.func.isRequired,
  groupedHireServices: PropTypes.arrayOf(PropTypes.shape({ category: PropTypes.string, services: PropTypes.array })).isRequired,
  hireContent: PropTypes.shape({ services: PropTypes.array }).isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  hireServicePage: PropTypes.number.isRequired,
  setHireServicePage: PropTypes.func.isRequired,
  openHireServiceCreateDialog: PropTypes.func.isRequired,
  openHireServiceEditDialog: PropTypes.func.isRequired,
  openHireServiceDeleteDialog: PropTypes.func.isRequired,
  imagePlaceholder: PropTypes.string.isRequired,
};

export default HireTab;


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
        <Button onClick={onClose} variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  );
}

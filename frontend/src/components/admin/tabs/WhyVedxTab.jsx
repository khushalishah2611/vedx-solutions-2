import * as React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import SelectClearAdornment from '../SelectClearAdornment.jsx';
import ImageUpload from './ImageUpload.jsx';

/** ✅ Dialog component */
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

const isBlank = (v) => String(v ?? '').trim().length === 0;

export default function WhyVedxTab({
  showHeroImage = true,
  categoryOptions = [],
  whyVedxCategoryFilter,
  setWhyVedxCategoryFilter,
  whyVedxSubcategoryFilter,
  setWhyVedxSubcategoryFilter,
  subcategoryLookup,
  allSubcategoryOptions = [],
  whyVedxOptions = [],
  selectedWhyVedxId,
  handleWhyVedxSelect,
  handleNewWhyVedxHero,
  serviceCategories = [],
  whyVedxHeroForm,
  handleWhyVedxHeroChange,
  handleWhyVedxHeroSave,
  whyVedxSubcategoryOptions = [],
  activeWhyVedxReasons = [],
  rowsPerPage = 10,
  whyVedxPage = 1,
  setWhyVedxPage,
  openWhyVedxCreateDialog,
  openWhyVedxEditDialog,
  openWhyVedxDeleteDialog,
}) {
  const [validationOpen, setValidationOpen] = React.useState(false);
  const [validationTitle, setValidationTitle] = React.useState('Validation');
  const [validationMessages, setValidationMessages] = React.useState([]);

  const showValidation = (messages, title = 'Validation') => {
    setValidationTitle(title);
    setValidationMessages(Array.isArray(messages) ? messages : [String(messages)]);
    setValidationOpen(true);
  };

  const validateHero = () => {
    const errors = [];

    const categoryId = String(whyVedxHeroForm?.categoryId || '').trim();
    const subcategoryId = String(whyVedxHeroForm?.subcategoryId || '').trim();
    const title = String(whyVedxHeroForm?.heroTitle || '').trim();
    const description = String(whyVedxHeroForm?.heroDescription || '').trim();
    const heroImage = whyVedxHeroForm?.heroImage;

    if (!categoryId) errors.push('Category is required.');

    // If this category has subcategories, require it
    if (categoryId && (whyVedxSubcategoryOptions || []).length > 0 && !subcategoryId) {
      errors.push('Subcategory is required for this category.');
    }

    if (isBlank(title)) errors.push('Title is required.');
    if (isBlank(description)) errors.push('Description is required.');
    if (showHeroImage && !heroImage) errors.push('Hero image is required.');

    return errors;
  };

  const categoryMenu = categoryOptions || [];
  const subcategoryListForFilter = whyVedxCategoryFilter
    ? subcategoryLookup?.get?.(whyVedxCategoryFilter) || []
    : allSubcategoryOptions || [];

  const pageCount = Math.max(1, Math.ceil((activeWhyVedxReasons || []).length / rowsPerPage));
  const pagedReasons = (activeWhyVedxReasons || []).slice((whyVedxPage - 1) * rowsPerPage, whyVedxPage * rowsPerPage);

  return (
    <>
      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader title="Why choose VedX Solutions" subheader="Control headline, description, and proof points." />
        <Divider />
        <CardContent>
          <Stack spacing={3}>
            {/* Filters */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                select
                label="Category"
                value={whyVedxCategoryFilter}
                onChange={(event) => {
                  const next = event.target.value;

                  // clear invalid subcategory when category changes
                  if (!next && whyVedxSubcategoryFilter) setWhyVedxSubcategoryFilter('');
                  if (next && whyVedxSubcategoryFilter) {
                    const allowed = (subcategoryLookup.get(next) || []).map(String);
                    if (allowed.length > 0 && !allowed.includes(String(whyVedxSubcategoryFilter))) {
                      setWhyVedxSubcategoryFilter('');
                    }
                  }

                  setWhyVedxCategoryFilter(next);
                  setWhyVedxPage?.(1);
                }}
                InputProps={{
                  endAdornment: (
                    <SelectClearAdornment
                      visible={Boolean(whyVedxCategoryFilter)}
                      onClear={() => {
                        setWhyVedxCategoryFilter('');
                        setWhyVedxSubcategoryFilter('');
                        setWhyVedxPage?.(1);
                      }}
                    />
                  ),
                }}
                sx={{ minWidth: 240 }}
              >
                <MenuItem value="">All categories</MenuItem>
                {categoryMenu.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Sub-category"
                value={whyVedxSubcategoryFilter}
                onChange={(event) => {
                  const next = event.target.value;

                  if (next && !whyVedxCategoryFilter) {
                    showValidation(['Please select a category first, then choose sub-category.'], 'Filter validation');
                    return;
                  }

                  if (next && whyVedxCategoryFilter) {
                    const allowed = (subcategoryLookup.get(whyVedxCategoryFilter) || []).map(String);
                    if (allowed.length > 0 && !allowed.includes(String(next))) {
                      showValidation(['Selected sub-category is not valid for the chosen category.'], 'Filter validation');
                      return;
                    }
                  }

                  setWhyVedxSubcategoryFilter(next);
                  setWhyVedxPage?.(1);
                }}
                InputProps={{
                  endAdornment: (
                    <SelectClearAdornment
                      visible={Boolean(whyVedxSubcategoryFilter)}
                      onClear={() => {
                        setWhyVedxSubcategoryFilter('');
                        setWhyVedxPage?.(1);
                      }}
                    />
                  ),
                }}
                sx={{ minWidth: 240 }}
                disabled={
                  whyVedxCategoryFilter
                    ? (subcategoryLookup.get(whyVedxCategoryFilter) || []).length === 0
                    : (allSubcategoryOptions || []).length === 0
                }
              >
                <MenuItem value="">All sub-categories</MenuItem>
                {subcategoryListForFilter.map((option) => (
                  <MenuItem key={String(option)} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {/* Select config + add hero */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
              <Autocomplete
                disableClearable={false}
                clearOnEscape
                options={whyVedxOptions || []}
                value={(whyVedxOptions || []).find((o) => String(o.value) === String(selectedWhyVedxId)) || null}
                onChange={(event, option) => handleWhyVedxSelect?.(option)}
                renderInput={(params) => (
                  <TextField {...params} label="Select why choose config" placeholder="Select category / subcategory" fullWidth />
                )}
                sx={{ minWidth: 260, flex: 1 }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="outlined" onClick={handleNewWhyVedxHero}>
                  Add new hero
                </Button>
              </Stack>
            </Stack>

            {/* Hero form */}
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                const errors = validateHero();
                if (errors.length > 0) {
                  showValidation(errors, 'Why VedX validation');
                  return;
                }
                handleWhyVedxHeroSave?.(e);
              }}
              sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={showHeroImage ? 8 : 12}>
                  <Stack spacing={2}>
                    <Autocomplete
                      disableClearable={false}
                      clearOnEscape
                      options={(serviceCategories || []).map((c) => ({ value: c.id, label: c.name }))}
                      value={
                        (serviceCategories || [])
                          .map((c) => ({ value: c.id, label: c.name }))
                          .find((o) => String(o.value) === String(whyVedxHeroForm?.categoryId)) || null
                      }
                      onChange={(event, option) => {
                        const next = option?.value || '';
                        handleWhyVedxHeroChange?.('categoryId', next);

                        // clear subcategory if invalid
                        if (!next) {
                          if (whyVedxHeroForm?.subcategoryId) handleWhyVedxHeroChange?.('subcategoryId', '');
                          return;
                        }

                        if (whyVedxHeroForm?.subcategoryId) {
                          const allowed = (whyVedxSubcategoryOptions || []).map((o) => String(o.value));
                          if (allowed.length > 0 && !allowed.includes(String(whyVedxHeroForm.subcategoryId))) {
                            handleWhyVedxHeroChange?.('subcategoryId', '');
                          }
                        }
                      }}
                      renderInput={(params) => <TextField {...params} label="Category" placeholder="Select category" fullWidth />}
                      fullWidth
                    />

                    <Autocomplete
                      disableClearable={false}
                      clearOnEscape
                      options={whyVedxSubcategoryOptions || []}
                      value={(whyVedxSubcategoryOptions || []).find((o) => String(o.value) === String(whyVedxHeroForm?.subcategoryId)) || null}
                      onChange={(event, option) => handleWhyVedxHeroChange?.('subcategoryId', option?.value || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Subcategory"
                          placeholder={whyVedxHeroForm?.categoryId ? 'Select a subcategory' : 'Select a category to filter subcategories'}
                          fullWidth
                        />
                      )}
                      fullWidth
                      disabled={!(whyVedxSubcategoryOptions || []).length}
                    />

                    <TextField
                      label="Title"
                      value={whyVedxHeroForm?.heroTitle || ''}
                      onChange={(event) => handleWhyVedxHeroChange?.('heroTitle', event.target.value)}
                      fullWidth
                      required
                    />

                    <TextField
                      label="Description"
                      value={whyVedxHeroForm?.heroDescription || ''}
                      onChange={(event) => handleWhyVedxHeroChange?.('heroDescription', event.target.value)}
                      fullWidth
                      required
                      multiline
                      minRows={3}
                    />

                    <Button type="submit" variant="contained">
                      Save hero content
                    </Button>
                  </Stack>
                </Grid>
                {showHeroImage && (
                  <Grid item xs={12} md={4}>
                    <ImageUpload
                      label="Hero image"
                      value={whyVedxHeroForm?.heroImage || ''}
                      onChange={(value) => handleWhyVedxHeroChange?.('heroImage', value)}
                      required
                    />
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Reasons table */}
            <Stack spacing={1}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Typography variant="h6">Reasons</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={openWhyVedxCreateDialog}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Add reason
                </Button>
              </Stack>

                  <TableContainer sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pagedReasons.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell width={120}>
                              {row.image ? (
                                <Box
                                  component="img"
                                  src={row.image}
                                  alt={row.title || 'Reason image'}
                                  sx={{
                                    width: 96,
                                    height: 64,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                />
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No image
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell sx={{ maxWidth: 520 }}>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {row.description}
                              </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => openWhyVedxEditDialog?.(row)}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => openWhyVedxDeleteDialog?.(row)}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}

                        {pagedReasons.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Typography variant="body2" color="text.secondary" align="center">
                                No reasons found.
                              </Typography>
                            </TableCell>
                          </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack alignItems="flex-end">
                <Pagination count={pageCount} page={whyVedxPage} onChange={(e, p) => setWhyVedxPage?.(p)} />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ✅ This MUST be rendered (previously it was missing -> dialog never showed) */}
      <ValidationDialog
        open={validationOpen}
        title={validationTitle}
        messages={validationMessages}
        onClose={() => setValidationOpen(false)}
      />
    </>
  );
}

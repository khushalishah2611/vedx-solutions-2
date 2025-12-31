import * as React from 'react';
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SelectClearAdornment from '../SelectClearAdornment.jsx';

/** ✅ Dialog component (keep outside main component) */
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

const WhyVedxTab = ({
  categoryOptions,
  whyVedxCategoryFilter,
  setWhyVedxCategoryFilter,
  whyVedxSubcategoryFilter,
  setWhyVedxSubcategoryFilter,
  subcategoryLookup,
  allSubcategoryOptions,
  whyVedxOptions,
  selectedWhyVedxId,
  handleWhyVedxSelect,
  handleNewWhyVedxHero,
  serviceCategories,
  whyVedxHeroForm,
  handleWhyVedxHeroChange,
  handleWhyVedxHeroSave,
  ImageUpload,
  whyVedxSubcategoryOptions,
  activeWhyVedxReasons,
  rowsPerPage,
  whyVedxPage,
  setWhyVedxPage,
  imagePlaceholder,
  openWhyVedxCreateDialog,
  openWhyVedxEditDialog,
  openWhyVedxDeleteDialog,
}) => {
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

    // If subcategories exist for this category, require selection
    if (categoryId && (whyVedxSubcategoryOptions || []).length > 0 && !subcategoryId) {
      errors.push('Subcategory is required for this category.');
    }

    if (!title) errors.push('Title is required.');
    if (!description) errors.push('Description is required.');
    if (!heroImage) errors.push('Hero image is required.');

    return errors;
  };

  const categoryMenu = categoryOptions || [];
  const subcategoryListForFilter = whyVedxCategoryFilter
    ? subcategoryLookup?.get?.(whyVedxCategoryFilter) || []
    : allSubcategoryOptions || [];

  const pagedReasons = (activeWhyVedxReasons || []).slice(
    (whyVedxPage - 1) * rowsPerPage,
    whyVedxPage * rowsPerPage
  );

  return (
    <>
      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Why choose VedX Solutions"
          subheader="Control headline, description, and proof points."
        />
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
                onChange={(event, option) => handleWhyVedxSelect(option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select why choose config"
                    placeholder="Select category / subcategory"
                    fullWidth
                  />
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
                <Grid item xs={12} md={8}>
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
                        handleWhyVedxHeroChange('categoryId', next);

                        // clear subcategory if invalid
                        if (!next) {
                          if (whyVedxHeroForm?.subcategoryId) handleWhyVedxHeroChange('subcategoryId', '');
                          return;
                        }

                        if (whyVedxHeroForm?.subcategoryId) {
                          const allowed = (whyVedxSubcategoryOptions || []).map((o) => String(o.value));
                          if (allowed.length > 0 && !allowed.includes(String(whyVedxHeroForm.subcategoryId))) {
                            handleWhyVedxHeroChange('subcategoryId', '');
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
                      value={
                        (whyVedxSubcategoryOptions || []).find(
                          (o) => String(o.value) === String(whyVedxHeroForm?.subcategoryId)
                        ) || null
                      }
                      onChange={(event, option) => handleWhyVedxHeroChange('subcategoryId', option?.value || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Subcategory"
                          placeholder={
                            whyVedxHeroForm?.categoryId ? 'Select a subcategory' : 'Select a category to filter subcategories'
                          }
                          fullWidth
                        />
                      )}
                      fullWidth
                      disabled={!(whyVedxSubcategoryOptions || []).length}
                    />

                    <TextField
                      label="Title"
                      value={whyVedxHeroForm?.heroTitle || ''}
                      onChange={(event) => handleWhyVedxHeroChange('heroTitle', event.target.value)}
                      fullWidth
                    />

                    <TextField
                      label="Description"
                      value={whyVedxHeroForm?.heroDescription || ''}
                      onChange={(event) => handleWhyVedxHeroChange('heroDescription', event.target.value)}
                      fullWidth
                      multiline
                      minRows={3}
                    />

                    <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
                      Save hero content
                    </Button>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <ImageUpload
                    label="Hero image"
                    value={whyVedxHeroForm?.heroImage || ''}
                    onChange={(value) => handleWhyVedxHeroChange('heroImage', value)}
                    required
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Reasons */}
            <Stack spacing={1}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Box>
                  <Typography variant="h6">Reasons to choose us</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add visuals, titles, and descriptions that appear below the hero section.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={openWhyVedxCreateDialog}
                  sx={{ mt: { xs: 1, sm: 0 } }}
                  disabled={!selectedWhyVedxId}
                >
                  Add reason
                </Button>
              </Stack>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Subcategory</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {pagedReasons.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                        <TableCell>{item.categoryName || '—'}</TableCell>
                        <TableCell>{item.subcategoryName || '—'}</TableCell>
                        <TableCell>
                          <Box
                            component="img"
                            src={item.image || imagePlaceholder}
                            alt={`${item.title} visual`}
                            sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {item.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton size="small" color="primary" onClick={() => openWhyVedxEditDialog(item)}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => openWhyVedxDeleteDialog(item)}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}

                    {(activeWhyVedxReasons || []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            {selectedWhyVedxId ? 'No reasons added yet.' : 'Select a hero card to start adding reasons.'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil((activeWhyVedxReasons || []).length / rowsPerPage))}
                  page={whyVedxPage}
                  onChange={(event, page) => setWhyVedxPage(page)}
                  color="primary"
                />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ✅ Validation dialog mounted correctly */}
      <ValidationDialog
        open={validationOpen}
        title={validationTitle}
        messages={validationMessages}
        onClose={() => setValidationOpen(false)}
      />
    </>
  );
};

export default WhyVedxTab;

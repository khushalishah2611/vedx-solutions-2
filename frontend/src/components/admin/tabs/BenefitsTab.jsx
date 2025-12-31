// BenefitsTab.jsx
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
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
  Autocomplete,
} from '@mui/material';
import PropTypes from 'prop-types';
import SelectClearAdornment from '../SelectClearAdornment.jsx';

/**
 * Small helpers
 */
const isBlank = (v) => String(v ?? '').trim().length === 0;

const safeStr = (v) => (v == null ? '' : String(v));

const normalizeId = (v) => (v === '' || v == null ? '' : String(v));

const optionLabelForConfig = (option) => {
  if (!option) return '';
  const left = safeStr(option.categoryName).trim();
  const right = safeStr(option.subcategoryName).trim();
  const joined = [left, right].filter(Boolean).join(' / ');
  return joined || safeStr(option.title) || 'Untitled';
};

const uniqueBy = (arr, keyFn) => {
  const seen = new Set();
  return (arr || []).filter((x) => {
    const k = keyFn(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/**
 * Validation: Benefits Hero form
 * - title required
 * - categoryId required (because hero is config-based)
 * - subcategoryId required if there are subcategories for selected category
 */
function validateBenefitHero(hero, benefitHeroSubcategoryOptions) {
  const errors = {};

  const title = safeStr(hero?.title).trim();
  const categoryId = normalizeId(hero?.categoryId);
  const subcategoryId = normalizeId(hero?.subcategoryId);

  if (isBlank(title)) errors.title = 'Title is required.';

  // If your UI truly supports "All categories" for hero, remove this check.
  // In most CMS, hero is tied to a category/subcategory => we enforce.
  if (!categoryId) errors.categoryId = 'Category is required.';

  if (categoryId) {
    const allowedSubs = (benefitHeroSubcategoryOptions || [])
      .filter((opt) => normalizeId(opt.categoryId) === normalizeId(categoryId))
      .map((opt) => normalizeId(opt.value));

    // if category has sub options, enforce subcategory
    if (allowedSubs.length > 0 && !subcategoryId) {
      errors.subcategoryId = 'Sub-category is required for this category.';
    }

    // if subcategory chosen but not allowed
    if (subcategoryId && allowedSubs.length > 0 && !allowedSubs.includes(subcategoryId)) {
      errors.subcategoryId = 'Selected sub-category is not valid for the chosen category.';
    }
  }

  return errors;
}

/**
 * Validation: Filters
 * - if subcategory selected, category should not be empty (recommended)
 * - if category selected, subcategory should belong to that category
 */
function validateFilters({
  benefitCategoryFilter,
  benefitSubcategoryFilter,
  subcategoryLookup,
  allSubcategoryOptions,
}) {
  const errors = {};

  const cat = safeStr(benefitCategoryFilter);
  const sub = safeStr(benefitSubcategoryFilter);

  if (sub && !cat) {
    // recommended UX: selecting subcategory without category can be confusing
    errors.benefitSubcategoryFilter = 'Please select a category first.';
  }

  if (cat && sub) {
    const allowed = (subcategoryLookup?.get(cat) || []).map(String);
    if (allowed.length > 0 && !allowed.includes(sub)) {
      errors.benefitSubcategoryFilter = 'This sub-category does not belong to the selected category.';
    }
  } else if (!cat && sub) {
    // if category not selected but sub selected (if you allow), ensure it exists globally
    const global = (allSubcategoryOptions || []).map(String);
    if (global.length > 0 && !global.includes(sub)) {
      errors.benefitSubcategoryFilter = 'Invalid sub-category selection.';
    }
  }

  return errors;
}

/**
 * Validation: Config selection
 * - selectedBenefitConfigId must exist when hasBenefitConfig = true
 */
function validateConfigSelection({ hasBenefitConfig, benefitConfigs, selectedBenefitConfigId }) {
  const errors = {};
  if (!hasBenefitConfig) return errors;

  const id = normalizeId(selectedBenefitConfigId);
  if (!id) {
    errors.selectedBenefitConfigId = 'Please select a benefits config.';
    return errors;
  }

  const exists = (benefitConfigs || []).some((c) => normalizeId(c?.id) === id);
  if (!exists) errors.selectedBenefitConfigId = 'Selected config is not valid.';
  return errors;
}

const BenefitsTab = ({
  categoryOptions,
  subcategoryLookup,
  allSubcategoryOptions,
  benefitCategoryFilter,
  setBenefitCategoryFilter,
  benefitSubcategoryFilter,
  setBenefitSubcategoryFilter,
  benefitConfigs,
  selectedBenefitConfigId,
  handleBenefitConfigSelect,
  handleNewBenefitConfig,
  benefitHero,
  benefitHeroCategoryOptions,
  benefitHeroSubcategoryOptions,
  handleBenefitHeroChange,
  handleBenefitHeroSave,
  benefitHeroSaved,
  hasBenefitConfig,
  groupedBenefits,
  visibleBenefits,
  rowsPerPage,
  benefitPage,
  setBenefitPage,
  openBenefitCreateDialog,
  openBenefitEditDialog,
  openBenefitDeleteDialog,
  imagePlaceholder,
}) => {
  /**
   * Derived: validate everything for UI feedback
   */
  const filterErrors = validateFilters({
    benefitCategoryFilter,
    benefitSubcategoryFilter,
    subcategoryLookup,
    allSubcategoryOptions,
  });

  const configErrors = validateConfigSelection({
    hasBenefitConfig,
    benefitConfigs,
    selectedBenefitConfigId,
  });

  const heroErrors = validateBenefitHero(benefitHero, benefitHeroSubcategoryOptions);

  const hasAnyError =
    Object.keys(filterErrors).length > 0 ||
    Object.keys(configErrors).length > 0 ||
    Object.keys(heroErrors).length > 0;

  /**
   * Subcategory options for filter dropdown
   */
  const filterSubOptions = benefitCategoryFilter
    ? subcategoryLookup.get(benefitCategoryFilter) || []
    : allSubcategoryOptions || [];

  /**
   * Subcategory options for hero dropdown (only those matching selected category)
   * NOTE: your original code was not filtering the list in UI; it showed all subcategories.
   * We filter to avoid wrong selections.
   */
  const heroCategoryId = normalizeId(benefitHero?.categoryId);
  const heroSubOptions = uniqueBy(
    (benefitHeroSubcategoryOptions || []).filter(
      (opt) => !heroCategoryId || normalizeId(opt.categoryId) === heroCategoryId
    ),
    (opt) => `${normalizeId(opt.categoryId)}::${normalizeId(opt.value)}`
  );

  const canAddBenefit = Boolean(hasBenefitConfig && !configErrors.selectedBenefitConfigId);

  const onHeroSubmit = (e) => {
    // keep both: submit + button click safe
    if (e?.preventDefault) e.preventDefault();

    const errors = validateBenefitHero(benefitHero, benefitHeroSubcategoryOptions);

    if (Object.keys(errors).length > 0) {
      // do NOT save if invalid
      return;
    }
    // call parent save handler
    handleBenefitHeroSave?.(e);
  };

  return (
    <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
      <CardHeader
        title="Benefits"
        subheader="Control benefit cards with images and rich descriptions."
        action={
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={openBenefitCreateDialog}
            disabled={!canAddBenefit}
          >
            Add benefit
          </Button>
        }
      />
      <Divider />
      <CardContent>
        {/* Filters */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
          <TextField
            select
            label="Category filter"
            value={benefitCategoryFilter}
            onChange={(event) => {
              const next = event.target.value;

              // if category changes, reset subcategory if it becomes invalid
              if (next) {
                const allowed = (subcategoryLookup.get(next) || []).map(String);
                if (benefitSubcategoryFilter && allowed.length > 0 && !allowed.includes(benefitSubcategoryFilter)) {
                  setBenefitSubcategoryFilter('');
                }
              } else {
                // if clearing category, also clear subcategory (recommended)
                if (benefitSubcategoryFilter) setBenefitSubcategoryFilter('');
              }

              setBenefitCategoryFilter(next);
              // when filters change, typically reset pagination to page 1
              setBenefitPage?.(1);
            }}
            InputProps={{
              endAdornment: (
                <SelectClearAdornment
                  visible={Boolean(benefitCategoryFilter)}
                  onClear={() => {
                    setBenefitCategoryFilter('');
                    if (benefitSubcategoryFilter) setBenefitSubcategoryFilter('');
                    setBenefitPage?.(1);
                  }}
                />
              ),
            }}
            sx={{ minWidth: 240 }}
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
            label="Sub-category filter"
            value={benefitSubcategoryFilter}
            onChange={(event) => {
              const next = event.target.value;

              // enforce "subcategory needs category" UX: if user selects sub, and category empty, try to keep allowed scenario
              // Here we simply set it but show validation message if category not selected.
              setBenefitSubcategoryFilter(next);
              setBenefitPage?.(1);
            }}
            error={Boolean(filterErrors.benefitSubcategoryFilter)}
            helperText={filterErrors.benefitSubcategoryFilter || ' '}
            InputProps={{
              endAdornment: (
                <SelectClearAdornment
                  visible={Boolean(benefitSubcategoryFilter)}
                  onClear={() => {
                    setBenefitSubcategoryFilter('');
                    setBenefitPage?.(1);
                  }}
                />
              ),
            }}
            sx={{ minWidth: 240 }}
            disabled={
              benefitCategoryFilter
                ? (subcategoryLookup.get(benefitCategoryFilter) || []).length === 0
                : (allSubcategoryOptions || []).length === 0
            }
          >
            <MenuItem value="">All sub-categories</MenuItem>
            {filterSubOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {/* Config select + New config */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="nowrap">
          <Autocomplete
            disableClearable={false}
            clearOnEscape
            options={benefitConfigs}
            getOptionLabel={optionLabelForConfig}
            fullWidth
            value={
              benefitConfigs.find((item) => normalizeId(item?.id) === normalizeId(selectedBenefitConfigId)) || null
            }
            onChange={(event, value) => {
              handleBenefitConfigSelect?.(value);

              // when config changes, generally reset filters + pagination (optional)
              setBenefitPage?.(1);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select benefits config"
                error={Boolean(configErrors.selectedBenefitConfigId)}
                helperText={configErrors.selectedBenefitConfigId || ' '}
              />
            )}
            sx={{ minWidth: 0 }}
          />

          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleNewBenefitConfig}
            sx={{ whiteSpace: 'nowrap' }}
          >
            New config
          </Button>
        </Stack>

        {/* Hero form */}
        <Stack spacing={2} mb={3} component="form" onSubmit={onHeroSubmit} noValidate>
          <TextField
            select
            label="Category"
            value={normalizeId(benefitHero.categoryId)}
            onChange={(event) => {
              const value = event.target.value;

              handleBenefitHeroChange('categoryId', value);

              // Reset invalid subcategory when category changes
              const allowedSubcategories = (benefitHeroSubcategoryOptions || [])
                .filter((option) => normalizeId(option.categoryId) === normalizeId(value))
                .map((option) => normalizeId(option.value));

              if (value && normalizeId(benefitHero.subcategoryId) && !allowedSubcategories.includes(normalizeId(benefitHero.subcategoryId))) {
                handleBenefitHeroChange('subcategoryId', '');
              }

              if (!value) {
                // clearing category -> also clear subcategory
                if (normalizeId(benefitHero.subcategoryId)) handleBenefitHeroChange('subcategoryId', '');
              }
            }}
            error={Boolean(heroErrors.categoryId)}
            helperText={heroErrors.categoryId || ' '}
            InputProps={{
              endAdornment: (
                <SelectClearAdornment
                  visible={Boolean(benefitHero.categoryId)}
                  onClear={() => {
                    handleBenefitHeroChange('categoryId', '');
                    if (normalizeId(benefitHero.subcategoryId)) handleBenefitHeroChange('subcategoryId', '');
                  }}
                />
              ),
            }}
            fullWidth
          >
            <MenuItem value="">Select category</MenuItem>
            {benefitHeroCategoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Sub-category"
            value={normalizeId(benefitHero.subcategoryId)}
            onChange={(event) => handleBenefitHeroChange('subcategoryId', event.target.value)}
            error={Boolean(heroErrors.subcategoryId)}
            helperText={heroErrors.subcategoryId || ' '}
            InputProps={{
              endAdornment: (
                <SelectClearAdornment
                  visible={Boolean(benefitHero.subcategoryId)}
                  onClear={() => handleBenefitHeroChange('subcategoryId', '')}
                />
              ),
            }}
            fullWidth
            disabled={!benefitHeroCategoryOptions.length || !normalizeId(benefitHero.categoryId)}
          >
            <MenuItem value="">
              {heroCategoryId ? 'Select sub-category' : 'Select category first'}
            </MenuItem>
            {heroSubOptions.map((option) => (
              <MenuItem key={`${normalizeId(option.categoryId)}-${normalizeId(option.value)}`} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Benefits title"
            value={safeStr(benefitHero.title)}
            onChange={(event) => handleBenefitHeroChange('title', event.target.value)}
            required
            fullWidth
            error={Boolean(heroErrors.title)}
            helperText={heroErrors.title || ' '}
          />

          <TextField
            label="Benefits description"
            value={safeStr(benefitHero.description)}
            onChange={(event) => handleBenefitHeroChange('description', event.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              type="submit"
              disabled={Boolean(Object.keys(heroErrors).length)}
            >
              Save Benefits
            </Button>

            {benefitHeroSaved && (
              <Typography variant="body2" color="success.main">
                Saved
              </Typography>
            )}

            {hasAnyError && !benefitHeroSaved && (
              <Typography variant="caption" color="error">
                Please fix validation errors.
              </Typography>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Grouped list */}
        <Stack spacing={2}>
          {groupedBenefits.map((group) => (
            <Accordion key={group.category} defaultExpanded disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1">{group.category}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {group.items.length} benefit{group.items.length === 1 ? '' : 's'}
                  </Typography>
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Sub-category</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {group.items.map((benefit) => (
                        <TableRow key={benefit.id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>{benefit.title}</TableCell>
                          <TableCell>{benefit.subcategory || '-'}</TableCell>
                          <TableCell sx={{ maxWidth: 200 }}>
                            <Box
                              component="img"
                              src={benefit.image || imagePlaceholder}
                              alt={`${benefit.title} visual`}
                              sx={{
                                width: 140,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 240 }}>
                            <Typography variant="body2" color="text.secondary" noWrap title={benefit.description || ''}>
                              {benefit.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton size="small" color="primary" onClick={() => openBenefitEditDialog(benefit)}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => openBenefitDeleteDialog(benefit)}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}

          {visibleBenefits.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center">
              No benefits configured yet.
            </Typography>
          )}
        </Stack>

        {/* Pagination */}
        <Stack mt={2} alignItems="flex-end">
          <Pagination
            count={Math.max(1, Math.ceil(visibleBenefits.length / rowsPerPage))}
            page={benefitPage}
            onChange={(event, page) => setBenefitPage(page)}
            color="primary"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

BenefitsTab.propTypes = {
  categoryOptions: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })).isRequired,
  subcategoryLookup: PropTypes.instanceOf(Map).isRequired,
  allSubcategoryOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  benefitCategoryFilter: PropTypes.string.isRequired,
  setBenefitCategoryFilter: PropTypes.func.isRequired,
  benefitSubcategoryFilter: PropTypes.string.isRequired,
  setBenefitSubcategoryFilter: PropTypes.func.isRequired,
  benefitConfigs: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedBenefitConfigId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleBenefitConfigSelect: PropTypes.func.isRequired,
  handleNewBenefitConfig: PropTypes.func.isRequired,
  benefitHero: PropTypes.shape({
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    subcategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  benefitHeroCategoryOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ).isRequired,
  benefitHeroSubcategoryOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
      categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  handleBenefitHeroChange: PropTypes.func.isRequired,
  handleBenefitHeroSave: PropTypes.func.isRequired,
  benefitHeroSaved: PropTypes.bool.isRequired,
  hasBenefitConfig: PropTypes.bool.isRequired,
  groupedBenefits: PropTypes.arrayOf(PropTypes.shape({ category: PropTypes.string, items: PropTypes.array })).isRequired,
  visibleBenefits: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  benefitPage: PropTypes.number.isRequired,
  setBenefitPage: PropTypes.func.isRequired,
  openBenefitCreateDialog: PropTypes.func.isRequired,
  openBenefitEditDialog: PropTypes.func.isRequired,
  openBenefitDeleteDialog: PropTypes.func.isRequired,
  imagePlaceholder: PropTypes.string.isRequired,
};

export default BenefitsTab;

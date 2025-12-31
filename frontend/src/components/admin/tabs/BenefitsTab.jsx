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
}) => (
  <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
    <CardHeader
      title="Benefits"
      subheader="Control benefit cards with images and rich descriptions."
      action={
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={openBenefitCreateDialog}
          disabled={!hasBenefitConfig}
        >
          Add benefit
        </Button>
      }
    />
    <Divider />
    <CardContent>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField
          select
          label="Category filter"
          value={benefitCategoryFilter}
          onChange={(event) => setBenefitCategoryFilter(event.target.value)}
          InputProps={{
            endAdornment: (
              <SelectClearAdornment
                visible={Boolean(benefitCategoryFilter)}
                onClear={() => setBenefitCategoryFilter('')}
              />
            ),
          }}
          fullWidth
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
          onChange={(event) => setBenefitSubcategoryFilter(event.target.value)}
          InputProps={{
            endAdornment: (
              <SelectClearAdornment
                visible={Boolean(benefitSubcategoryFilter)}
                onClear={() => setBenefitSubcategoryFilter('')}
              />
            ),
          }}
          fullWidth
          disabled={
            benefitCategoryFilter
              ? (subcategoryLookup.get(benefitCategoryFilter) || []).length === 0
              : allSubcategoryOptions.length === 0
          }
        >
          <MenuItem value="">All sub-categories</MenuItem>
          {(benefitCategoryFilter ? subcategoryLookup.get(benefitCategoryFilter) || [] : allSubcategoryOptions).map(
            (option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            )
          )}
        </TextField>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        mb={2}
        flexWrap="nowrap"
      >
        <Autocomplete
            disableClearable={false}
            clearOnEscape
          options={benefitConfigs}
          getOptionLabel={(option) =>
            option?.categoryName || option?.subcategoryName
              ? [option.categoryName, option.subcategoryName].filter(Boolean).join(' / ')
              : option?.title || 'Untitled'
          }
          fullWidth
          value={
            benefitConfigs.find(
              (item) => String(item.id) === String(selectedBenefitConfigId)
            ) || null
          }
          onChange={(event, value) => handleBenefitConfigSelect(value)}
          renderInput={(params) => (
            <TextField {...params} label="Select benefits config" />
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

      <Stack spacing={2} mb={3} component="form" onSubmit={handleBenefitHeroSave}>
        <TextField
          select
          label="Category"
          value={benefitHero.categoryId}
          onChange={(event) => {
            const value = event.target.value;
            handleBenefitHeroChange('categoryId', value);

            const allowedSubcategories = benefitHeroSubcategoryOptions
              .filter((option) => Number(option.categoryId) === Number(value))
              .map((option) => option.value);

            if (value && benefitHero.subcategoryId && !allowedSubcategories.includes(benefitHero.subcategoryId)) {
              handleBenefitHeroChange('subcategoryId', '');
            }
          }}
          InputProps={{
            endAdornment: (
              <SelectClearAdornment
                visible={Boolean(benefitHero.categoryId)}
                onClear={() => handleBenefitHeroChange('categoryId', '')}
              />
            ),
          }}
          fullWidth
        >
          <MenuItem value="">All categories</MenuItem>
          {benefitHeroCategoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sub-category"
          value={benefitHero.subcategoryId}
          onChange={(event) => handleBenefitHeroChange('subcategoryId', event.target.value)}
          InputProps={{
            endAdornment: (
              <SelectClearAdornment
                visible={Boolean(benefitHero.subcategoryId)}
                onClear={() => handleBenefitHeroChange('subcategoryId', '')}
              />
            ),
          }}
          fullWidth
          disabled={!benefitHeroCategoryOptions.length}
        >
          <MenuItem value="">All sub-categories</MenuItem>
          {benefitHeroSubcategoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Benefits title"
          value={benefitHero.title}
          onChange={(event) => handleBenefitHeroChange('title', event.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Benefits description"
          value={benefitHero.description}
          onChange={(event) => handleBenefitHeroChange('description', event.target.value)}
          fullWidth
          multiline
          minRows={2}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="contained" onClick={handleBenefitHeroSave}>
            Save Benefits
          </Button>
          {benefitHeroSaved && (
            <Typography variant="body2" color="success.main">
              Saved
            </Typography>
          )}
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />
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
                            sx={{ width: 140, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 240 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
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
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => openBenefitDeleteDialog(benefit)}
                              >
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
  benefitHeroCategoryOptions: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), label: PropTypes.string })).isRequired,
  benefitHeroSubcategoryOptions: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), label: PropTypes.string, categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) })
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

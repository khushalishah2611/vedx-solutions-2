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
} from '@mui/material';
import PropTypes from 'prop-types';
import ImageUpload from '../ImageUpload.jsx';
import SelectClearAdornment from '../SelectClearAdornment.jsx';

const WhyChooseTab = ({
  categoryOptions,
  subcategoryLookup,
  allSubcategoryOptions,
  whyServiceCategoryFilter,
  setWhyServiceCategoryFilter,
  whyServiceSubcategoryFilter,
  setWhyServiceSubcategoryFilter,
  whyChooseList,
  selectedWhyChooseId,
  setSelectedWhyChooseId,
  onNewConfig,
  whyHeroForm,
  handleWhyHeroChange,
  handleWhyHeroSave,
  openWhyServiceCreateDialog,
  pagedWhyServices,
  whyChoose,
  openWhyServiceEditDialog,
  openWhyServiceDeleteDialog,
  rowsPerPage,
  whyServicePage,
  setWhyServicePage,
}) => (
  <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
    <CardHeader
      title="Why choose this service"
      subheader="Set the hero headline, supporting description, and highlight cards per category/sub-category."
    />
    <Divider />
    <CardContent>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            label="Category filter"
            value={whyServiceCategoryFilter}
            onChange={(event) => setWhyServiceCategoryFilter(event.target.value)}
            InputProps={{
              endAdornment: (
                <SelectClearAdornment
                  visible={Boolean(whyServiceCategoryFilter)}
                  onClear={() => setWhyServiceCategoryFilter('')}
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
            value={whyServiceSubcategoryFilter}
            onChange={(event) => setWhyServiceSubcategoryFilter(event.target.value)}
            InputProps={{
              endAdornment: (
                <SelectClearAdornment
                  visible={Boolean(whyServiceSubcategoryFilter)}
                  onClear={() => setWhyServiceSubcategoryFilter('')}
                />
              ),
            }}
            fullWidth
            disabled={
              whyServiceCategoryFilter
                ? (subcategoryLookup.get(whyServiceCategoryFilter) || []).length === 0
                : allSubcategoryOptions.length === 0
            }
          >
            <MenuItem value="">All sub-categories</MenuItem>
            {(whyServiceCategoryFilter
              ? subcategoryLookup.get(whyServiceCategoryFilter) || []
              : allSubcategoryOptions
            ).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="nowrap"
        >
          <Autocomplete
            disableClearable={false}
            clearOnEscape
            options={whyChooseList}
            getOptionLabel={(option) =>
              [option.category, option.subcategory].filter(Boolean).join(' / ') || 'Untitled'
            }
            fullWidth
            value={
              whyChooseList.find(
                (item) => String(item.id) === String(selectedWhyChooseId)
              ) || null
            }
            onChange={(event, value) =>
              setSelectedWhyChooseId(value?.id ? String(value.id) : '')
            }
            renderInput={(params) => (
              <TextField {...params} label="Select why choose config" />
            )}
            sx={{ minWidth: 0 }}
          />

          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={onNewConfig}
            sx={{ whiteSpace: 'nowrap' }}
          >
            New config
          </Button>
        </Stack>
        <Box
          component="form"
          onSubmit={handleWhyHeroSave}
          sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 2 }}
        >
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <TextField
                  select
                  label="Category"
                  value={whyHeroForm.category}
                  onChange={(event) => handleWhyHeroChange('category', event.target.value)}
                  fullWidth
                  required
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Sub-category"
                  value={whyHeroForm.subcategory}
                  onChange={(event) => handleWhyHeroChange('subcategory', event.target.value)}
                  fullWidth
                  disabled={!whyHeroForm.category || (subcategoryLookup.get(whyHeroForm.category) || []).length === 0}

                >
                  {(subcategoryLookup.get(whyHeroForm.category) || []).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Hero title"
                  value={whyHeroForm.heroTitle}
                  onChange={(event) => handleWhyHeroChange('heroTitle', event.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Hero description"
                  value={whyHeroForm.heroDescription}
                  onChange={(event) => handleWhyHeroChange('heroDescription', event.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <TextField
                  label="Service table title"
                  value={whyHeroForm.tableTitle}
                  onChange={(event) => handleWhyHeroChange('tableTitle', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Service table description"
                  value={whyHeroForm.tableDescription}
                  onChange={(event) => handleWhyHeroChange('tableDescription', event.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                />
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button type="submit" variant="contained">
                    Save hero content
                  </Button>

                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageUpload
                label="Hero image"
                value={whyHeroForm.heroImage}
                onChange={(value) => handleWhyHeroChange('heroImage', value)}
                required
              />
            </Grid>
          </Grid>
        </Box>

        <Stack spacing={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Box>
              <Typography variant="h6">{whyChoose.tableTitle || 'Service highlights'}</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={openWhyServiceCreateDialog}
              disabled={!selectedWhyChooseId}
              sx={{ mt: { xs: 1, sm: 0 } }}
            >
              Add highlight
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Sub-category</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedWhyServices.map((service) => (
                  <TableRow key={service.id} hover>
                    <TableCell>{service.category || '-'}</TableCell>
                    <TableCell>{service.subcategory || '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{service.title}</TableCell>
                    <TableCell sx={{ maxWidth: 340 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {service.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openWhyServiceEditDialog(service)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openWhyServiceDeleteDialog(service)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {whyChoose.services.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        No highlights yet. Use "Add highlight" to create category-wise reasons to choose you.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack mt={2} alignItems="flex-end">
            <Pagination
              count={Math.max(1, Math.ceil(whyChoose.services.length / rowsPerPage))}
              page={whyServicePage}
              onChange={(event, page) => setWhyServicePage(page)}
              color="primary"
            />
          </Stack>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

WhyChooseTab.propTypes = {
  categoryOptions: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })).isRequired,
  subcategoryLookup: PropTypes.instanceOf(Map).isRequired,
  allSubcategoryOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  whyServiceCategoryFilter: PropTypes.string.isRequired,
  setWhyServiceCategoryFilter: PropTypes.func.isRequired,
  whyServiceSubcategoryFilter: PropTypes.string.isRequired,
  setWhyServiceSubcategoryFilter: PropTypes.func.isRequired,
  whyChooseList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedWhyChooseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setSelectedWhyChooseId: PropTypes.func.isRequired,
  onNewConfig: PropTypes.func.isRequired,
  whyHeroForm: PropTypes.shape({
    category: PropTypes.string,
    subcategory: PropTypes.string,
    heroTitle: PropTypes.string,
    heroDescription: PropTypes.string,
    heroImage: PropTypes.string,
    tableTitle: PropTypes.string,
    tableDescription: PropTypes.string,
  }).isRequired,
  handleWhyHeroChange: PropTypes.func.isRequired,
  handleWhyHeroSave: PropTypes.func.isRequired,
  openWhyServiceCreateDialog: PropTypes.func.isRequired,
  pagedWhyServices: PropTypes.arrayOf(PropTypes.object).isRequired,
  whyChoose: PropTypes.shape({ services: PropTypes.arrayOf(PropTypes.object), tableTitle: PropTypes.string }).isRequired,
  openWhyServiceEditDialog: PropTypes.func.isRequired,
  openWhyServiceDeleteDialog: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  whyServicePage: PropTypes.number.isRequired,
  setWhyServicePage: PropTypes.func.isRequired,
};

export default WhyChooseTab;

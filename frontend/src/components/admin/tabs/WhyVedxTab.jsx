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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SelectClearAdornment from '../SelectClearAdornment.jsx';

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
}) => (
  <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
    <CardHeader
      title="Why choose VedX Solutions"
      subheader="Control headline, description, and proof points."
    />
    <Divider />
    <CardContent>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            label="Category"
            value={whyVedxCategoryFilter}
            onChange={(event) => setWhyVedxCategoryFilter(event.target.value)}
            InputProps={{
              endAdornment: (
                <SelectClearAdornment
                  visible={Boolean(whyVedxCategoryFilter)}
                  onClear={() => setWhyVedxCategoryFilter('')}
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
            label="Sub-category"
            value={whyVedxSubcategoryFilter}
            onChange={(event) => setWhyVedxSubcategoryFilter(event.target.value)}
            InputProps={{
              endAdornment: (
                <SelectClearAdornment
                  visible={Boolean(whyVedxSubcategoryFilter)}
                  onClear={() => setWhyVedxSubcategoryFilter('')}
                />
              ),
            }}
                sx={{ minWidth: 240 }}
            disabled={
              whyVedxCategoryFilter
                ? (subcategoryLookup.get(whyVedxCategoryFilter) || []).length === 0
                : allSubcategoryOptions.length === 0
            }
          >
            <MenuItem value="">All sub-categories</MenuItem>
            {(whyVedxCategoryFilter ? subcategoryLookup.get(whyVedxCategoryFilter) || [] : allSubcategoryOptions).map(
              (option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              )
            )}
          </TextField>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <Autocomplete
            disableClearable={false}
            clearOnEscape
            options={whyVedxOptions}
            value={whyVedxOptions.find((option) => String(option.value) === String(selectedWhyVedxId)) || null}
            onChange={(event, option) => handleWhyVedxSelect(option)}
            renderInput={(params) => (
              <TextField {...params} label="Select why choose config" placeholder="Select category / subcategory" fullWidth />
            )}
            sx={{ minWidth: 260, flex: 1 }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              onClick={handleNewWhyVedxHero}
            >
              Add new hero
            </Button>
          </Stack>
        </Stack>
        <Box component="form" onSubmit={handleWhyVedxHeroSave} sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Autocomplete
                  disableClearable={false}
                  clearOnEscape
                  options={serviceCategories.map((category) => ({ value: category.id, label: category.name }))}
                  value={
                    serviceCategories
                      .map((category) => ({ value: category.id, label: category.name }))
                      .find((option) => String(option.value) === String(whyVedxHeroForm.categoryId)) || null
                  }
                  onChange={(event, option) => handleWhyVedxHeroChange('categoryId', option?.value || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" placeholder="Select category" fullWidth />
                  )}
                  fullWidth
                />
                <Autocomplete
                  disableClearable={false}
                  clearOnEscape
                  options={whyVedxSubcategoryOptions}
                  value={
                    whyVedxSubcategoryOptions.find(
                      (option) => String(option.value) === String(whyVedxHeroForm.subcategoryId)
                    ) || null
                  }
                  onChange={(event, option) => handleWhyVedxHeroChange('subcategoryId', option?.value || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subcategory"
                      placeholder={
                        whyVedxHeroForm.categoryId
                          ? 'Select a subcategory'
                          : 'Select a category to filter subcategories'
                      }
                      fullWidth
                    />
                  )}
                  fullWidth
                  disabled={!whyVedxSubcategoryOptions.length}
                />
                <TextField
                  label="Title"
                  value={whyVedxHeroForm.heroTitle}
                  onChange={(event) => handleWhyVedxHeroChange('heroTitle', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={whyVedxHeroForm.heroDescription}
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
                value={whyVedxHeroForm.heroImage}
                onChange={(value) => handleWhyVedxHeroChange('heroImage', value)}
                required
              />
            </Grid>
          </Grid>
        </Box>

        <Stack spacing={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
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
                {activeWhyVedxReasons
                  .slice((whyVedxPage - 1) * rowsPerPage, whyVedxPage * rowsPerPage)
                  .map((item) => (
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
                {activeWhyVedxReasons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {selectedWhyVedxId
                          ? 'No reasons added yet.'
                          : 'Select a hero card to start adding reasons.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack mt={2} alignItems="flex-end">
            <Pagination
              count={Math.max(1, Math.ceil(activeWhyVedxReasons.length / rowsPerPage))}
              page={whyVedxPage}
              onChange={(event, page) => setWhyVedxPage(page)}
              color="primary"
            />
          </Stack>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default WhyVedxTab;

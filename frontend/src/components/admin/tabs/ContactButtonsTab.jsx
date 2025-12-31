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
} from '@mui/material';
import PropTypes from 'prop-types';
import SelectClearAdornment from '../SelectClearAdornment.jsx';

const ContactButtonsTab = ({
  categoryOptions,
  contactCategoryFilter,
  setContactCategoryFilter,
  contactSubcategoryFilter,
  setContactSubcategoryFilter,
  subcategoryLookup,
  allSubcategoryOptions,
  groupedContactButtons,
  contactButtons,
  filteredContactButtons,
  rowsPerPage,
  contactButtonPage,
  setContactButtonPage,
  openContactButtonCreateDialog,
  openContactButtonEditDialog,
  openContactButtonDeleteDialog,
  imagePlaceholder,
}) => (
  <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
    <CardHeader
      title="Contact buttons"
      subheader="Showcase contact CTAs with supporting copy and imagery."
      action={
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={openContactButtonCreateDialog}
        >
          Add contact button
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
          value={contactCategoryFilter}
          onChange={(event) => setContactCategoryFilter(event.target.value)}
          InputProps={{
            endAdornment: (
              <SelectClearAdornment
                visible={Boolean(contactCategoryFilter)}
                onClear={() => setContactCategoryFilter('')}
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
          value={contactSubcategoryFilter}
          onChange={(event) => setContactSubcategoryFilter(event.target.value)}
          InputProps={{
            endAdornment: (
              <SelectClearAdornment
                visible={Boolean(contactSubcategoryFilter)}
                onClear={() => setContactSubcategoryFilter('')}
              />
            ),
          }}
          sx={{ minWidth: 240 }}
        >
          <MenuItem value="">All sub-categories</MenuItem>
          {(contactCategoryFilter
            ? subcategoryLookup.get(contactCategoryFilter) || []
            : allSubcategoryOptions
          ).map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack spacing={2}>
        {groupedContactButtons.map((group) => (
          <Accordion key={group.category} defaultExpanded disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack spacing={0.5}>
                <Typography variant="subtitle1">{group.category}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {group.items.length} contact CTA{group.items.length === 1 ? '' : 's'}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Sub-category</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.items.map((button) => (
                      <TableRow key={button.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{button.title}</TableCell>
                        <TableCell sx={{ maxWidth: 360 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {button.description || 'No description provided.'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 140 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {button.subcategory || 'Not set'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            component="img"
                            src={button.image || imagePlaceholder}
                            alt={`${button.title} visual`}
                            sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => openContactButtonEditDialog(button)}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => openContactButtonDeleteDialog(button)}
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
        {groupedContactButtons.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            {contactButtons.length === 0
              ? 'No contact buttons configured yet.'
              : 'No contact buttons match the selected filters.'}
          </Typography>
        )}
      </Stack>
      <Stack mt={2} alignItems="flex-end">
        <Pagination
          count={Math.max(1, Math.ceil(filteredContactButtons.length / rowsPerPage))}
          page={contactButtonPage}
          onChange={(event, page) => setContactButtonPage(page)}
          color="primary"
        />
      </Stack>
    </CardContent>
  </Card>
);

ContactButtonsTab.propTypes = {
  categoryOptions: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })).isRequired,
  contactCategoryFilter: PropTypes.string.isRequired,
  setContactCategoryFilter: PropTypes.func.isRequired,
  contactSubcategoryFilter: PropTypes.string.isRequired,
  setContactSubcategoryFilter: PropTypes.func.isRequired,
  subcategoryLookup: PropTypes.instanceOf(Map).isRequired,
  allSubcategoryOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupedContactButtons: PropTypes.arrayOf(PropTypes.shape({ category: PropTypes.string, items: PropTypes.array })).isRequired,
  contactButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
  filteredContactButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  contactButtonPage: PropTypes.number.isRequired,
  setContactButtonPage: PropTypes.func.isRequired,
  openContactButtonCreateDialog: PropTypes.func.isRequired,
  openContactButtonEditDialog: PropTypes.func.isRequired,
  openContactButtonDeleteDialog: PropTypes.func.isRequired,
  imagePlaceholder: PropTypes.string.isRequired,
};

export default ContactButtonsTab;

import * as React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardHeader, Divider, IconButton, MenuItem, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Alert } from '@mui/material';
import { AppButton, AppDialog, AppDialogActions, AppDialogContent, AppDialogTitle, AppSelectField, AppTextField } from '../../shared/FormControls.jsx';

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
}) => {
  const [validationOpen, setValidationOpen] = React.useState(false);
  const [validationTitle, setValidationTitle] = React.useState('Validation');
  const [validationMessages, setValidationMessages] = React.useState([]);

  const showValidation = (messages, title = 'Validation') => {
    setValidationTitle(title);
    setValidationMessages(Array.isArray(messages) ? messages : [String(messages)]);
    setValidationOpen(true);
  };

  const subOptions = contactCategoryFilter
    ? subcategoryLookup.get(contactCategoryFilter) || []
    : allSubcategoryOptions;

  return (
    <>
      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Contact buttons"
          subheader="Showcase contact CTAs with supporting copy and imagery."
          action={
            <AppButton
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={openContactButtonCreateDialog}
            >
              Add contact button
            </AppButton>
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
            <AppSelectField
             
              label="Category"
              value={contactCategoryFilter}
              onChange={(event) => {
                const next = event.target.value;

                // reset invalid subcategory when category changes/clears
                if (!next && contactSubcategoryFilter) setContactSubcategoryFilter('');
                if (next && contactSubcategoryFilter) {
                  const allowed = (subcategoryLookup.get(next) || []).map(String);
                  if (allowed.length > 0 && !allowed.includes(String(contactSubcategoryFilter))) {
                    setContactSubcategoryFilter('');
                  }
                }

                setContactCategoryFilter(next);
                setContactButtonPage?.(1);
              }}
              InputProps={{
                endAdornment: (
                  <SelectClearAdornment
                    visible={Boolean(contactCategoryFilter)}
                    onClear={() => {
                      setContactCategoryFilter('');
                      if (contactSubcategoryFilter) setContactSubcategoryFilter('');
                      setContactButtonPage?.(1);
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
            </AppSelectField>

            <AppSelectField
             
              label="Sub-category"
              value={contactSubcategoryFilter}
              onChange={(event) => {
                const next = event.target.value;

                // Required UX: user must choose category before subcategory
                if (next && !contactCategoryFilter) {
                  showValidation(['Please select a category first, then choose sub-category.'], 'Filter validation');
                  return;
                }

                // If category selected, sub must belong to it
                if (next && contactCategoryFilter) {
                  const allowed = (subcategoryLookup.get(contactCategoryFilter) || []).map(String);
                  if (allowed.length > 0 && !allowed.includes(String(next))) {
                    showValidation(['Selected sub-category is not valid for the chosen category.'], 'Filter validation');
                    return;
                  }
                }

                setContactSubcategoryFilter(next);
                setContactButtonPage?.(1);
              }}
              InputProps={{
                endAdornment: (
                  <SelectClearAdornment
                    visible={Boolean(contactSubcategoryFilter)}
                    onClear={() => {
                      setContactSubcategoryFilter('');
                      setContactButtonPage?.(1);
                    }}
                  />
                ),
              }}
              sx={{ minWidth: 240 }}
              disabled={contactCategoryFilter ? (subcategoryLookup.get(contactCategoryFilter) || []).length === 0 : (allSubcategoryOptions || []).length === 0}
            >
              <MenuItem value="">All sub-categories</MenuItem>
              {subOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </AppSelectField>
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

      <ValidationDialog
        open={validationOpen}
        title={validationTitle}
        messages={validationMessages}
        onClose={() => setValidationOpen(false)}
      />
    </>
  );
};

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


function ValidationDialog({ open, title, messages, onClose }) {
  return (
    <AppDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <AppDialogTitle>{title || 'Validation'}</AppDialogTitle>
      <AppDialogContent dividers>
        <Stack spacing={1.25}>
          {(messages || []).map((msg, idx) => (
            <Alert key={idx} severity="error" variant="outlined">
              {msg}
            </Alert>
          ))}
        </Stack>
      </AppDialogContent>
      <AppDialogActions>
        <AppButton onClick={onClose} variant="contained">OK</AppButton>
      </AppDialogActions>
    </AppDialog>
  );
}

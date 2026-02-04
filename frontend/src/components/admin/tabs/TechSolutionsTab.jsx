import * as React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Card, CardContent, CardHeader, Divider, Grid, IconButton, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Alert } from '@mui/material';
import { AppButton, AppDialog, AppDialogActions, AppDialogContent, AppDialogTitle, AppTextField } from '../../shared/FormControls.jsx';

import PropTypes from 'prop-types';

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
        <AppButton onClick={onClose} variant="contained">
          OK
        </AppButton>
      </AppDialogActions>
    </AppDialog>
  );
}

const TechSolutionsTab = ({
  techSolutions,
  setTechSolutions,
  rowsPerPage,
  techSolutionPage,
  setTechSolutionPage,
  openTechSolutionCreateDialog,
  openTechSolutionEditDialog,
  openTechSolutionDeleteDialog,
}) => {
  const [validationOpen, setValidationOpen] = React.useState(false);
  const [validationTitle, setValidationTitle] = React.useState('Validation');
  const [validationMessages, setValidationMessages] = React.useState([]);

  const showValidation = (messages, title = 'Validation') => {
    setValidationTitle(title);
    setValidationMessages(Array.isArray(messages) ? messages : [String(messages)]);
    setValidationOpen(true);
  };

  const validateHeader = () => {
    const errors = [];
    const title = String(techSolutions?.title || '').trim();
    const description = String(techSolutions?.description || '').trim();
    if (!title) errors.push('Title is required.');
    if (!description) errors.push('Description is required.');
    return errors;
  };

  const solutions = Array.isArray(techSolutions?.solutions) ? techSolutions.solutions : [];

  return (
    <>
      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Tech solutions for all business types"
          subheader="Control heading, copy, and business-type specific solutions."
        />
        <Divider />
        <CardContent>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <AppTextField
                  label="Title"
                  value={techSolutions?.title || ''}
                  onChange={(event) =>
                    setTechSolutions((prev) => ({
                      ...(prev || {}),
                      title: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AppTextField
                  label="Description"
                  value={techSolutions?.description || ''}
                  onChange={(event) =>
                    setTechSolutions((prev) => ({
                      ...(prev || {}),
                      description: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>
            </Grid>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Box>
                <Typography variant="h6">Business solutions</Typography>
                <Typography variant="body2" color="text.secondary">
                  Add solution cards for each business type with concise descriptions.
                </Typography>
              </Box>

              <AppButton
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => {
                  const errors = validateHeader();
                  if (errors.length > 0) {
                    showValidation(errors, 'Tech solutions validation');
                    return;
                  }
                  openTechSolutionCreateDialog?.();
                }}
                sx={{ mt: { xs: 1, sm: 0 } }}
              >
                Add solution
              </AppButton>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Sort order</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {solutions
                    .slice((techSolutionPage - 1) * rowsPerPage, techSolutionPage * rowsPerPage)
                    .map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                        <TableCell sx={{ maxWidth: 360 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {item.description}
                          </Typography>
                        </TableCell>
                        <TableCell>{Number.isFinite(Number(item.sortOrder)) ? item.sortOrder : 0}</TableCell>
                        <TableCell>{item.isActive ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => openTechSolutionEditDialog?.(item)}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => openTechSolutionDeleteDialog?.(item)}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}

                  {solutions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No tech solutions yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(solutions.length / rowsPerPage))}
                page={techSolutionPage}
                onChange={(event, page) => setTechSolutionPage?.(page)}
                color="primary"
              />
            </Stack>
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

TechSolutionsTab.propTypes = {
  techSolutions: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    solutions: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setTechSolutions: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  techSolutionPage: PropTypes.number.isRequired,
  setTechSolutionPage: PropTypes.func.isRequired,
  openTechSolutionCreateDialog: PropTypes.func.isRequired,
  openTechSolutionEditDialog: PropTypes.func.isRequired,
  openTechSolutionDeleteDialog: PropTypes.func.isRequired,
};

export default TechSolutionsTab;

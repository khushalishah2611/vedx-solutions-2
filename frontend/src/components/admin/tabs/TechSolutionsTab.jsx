import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
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

const TechSolutionsTab = ({
  techSolutions,
  setTechSolutions,
  rowsPerPage,
  techSolutionPage,
  setTechSolutionPage,
  openTechSolutionCreateDialog,
  openTechSolutionEditDialog,
  openTechSolutionDeleteDialog,
}) => (
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
            <TextField
              label="Title"
              value={techSolutions.title}
              onChange={(event) => setTechSolutions((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Description"
              value={techSolutions.description}
              onChange={(event) => setTechSolutions((prev) => ({ ...prev, description: event.target.value }))}
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
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={openTechSolutionCreateDialog}
            sx={{ mt: { xs: 1, sm: 0 } }}
          >
            Add solution
          </Button>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {techSolutions.solutions
                .slice((techSolutionPage - 1) * rowsPerPage, techSolutionPage * rowsPerPage)
                .map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => openTechSolutionEditDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => openTechSolutionDeleteDialog(item)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              {techSolutions.solutions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
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
            count={Math.max(1, Math.ceil(techSolutions.solutions.length / rowsPerPage))}
            page={techSolutionPage}
            onChange={(event, page) => setTechSolutionPage(page)}
            color="primary"
          />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

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

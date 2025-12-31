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

const ExpertiseTab = ({
  expertiseHeroForm,
  handleExpertiseHeroChange,
  handleExpertiseHeroSave,
  expertise,
  openExpertiseCreateDialog,
  openExpertiseEditDialog,
  openExpertiseDeleteDialog,
  rowsPerPage,
  expertisePage,
  setExpertisePage,
  imagePlaceholder,
}) => (
  <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
    <CardHeader title="Ways to choose our expertise" subheader="Control headline, description, and expert cards." />
    <Divider />
    <CardContent>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Title"
              value={expertiseHeroForm.title}
              onChange={(event) => handleExpertiseHeroChange('title', event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Description"
              value={expertiseHeroForm.description}
              onChange={(event) => handleExpertiseHeroChange('description', event.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleExpertiseHeroSave} sx={{ alignSelf: 'flex-start' }}>
          Save intro
        </Button>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Box>
            <Typography variant="h6">Expertise options</Typography>
            <Typography variant="body2" color="text.secondary">
              Add cards with images, titles, and descriptions for each engagement model.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={openExpertiseCreateDialog}
            sx={{ mt: { xs: 1, sm: 0 } }}
          >
            Add option
          </Button>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expertise.items
                .slice((expertisePage - 1) * rowsPerPage, expertisePage * rowsPerPage)
                .map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                    <TableCell>
                      <Box
                        component="img"
                        src={item.image || imagePlaceholder}
                        alt={`${item.title} visual`}
                        sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => openExpertiseEditDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => openExpertiseDeleteDialog(item)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              {expertise.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      No expertise cards configured yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack mt={2} alignItems="flex-end">
          <Pagination
            count={Math.max(1, Math.ceil(expertise.items.length / rowsPerPage))}
            page={expertisePage}
            onChange={(event, page) => setExpertisePage(page)}
            color="primary"
          />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

ExpertiseTab.propTypes = {
  expertiseHeroForm: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  handleExpertiseHeroChange: PropTypes.func.isRequired,
  handleExpertiseHeroSave: PropTypes.func.isRequired,
  expertise: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  openExpertiseCreateDialog: PropTypes.func.isRequired,
  openExpertiseEditDialog: PropTypes.func.isRequired,
  openExpertiseDeleteDialog: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  expertisePage: PropTypes.number.isRequired,
  setExpertisePage: PropTypes.func.isRequired,
  imagePlaceholder: PropTypes.string.isRequired,
};

export default ExpertiseTab;

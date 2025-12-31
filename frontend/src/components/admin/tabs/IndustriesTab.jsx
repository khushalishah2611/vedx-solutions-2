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

const IndustriesTab = ({
  industries,
  setIndustries,
  imagePlaceholder,
  rowsPerPage,
  industryPage,
  setIndustryPage,
  openIndustryCreateDialog,
  openIndustryEditDialog,
  openIndustryDeleteDialog,
}) => (
  <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
    <CardHeader title="Industry we serve" subheader="Set the headline and list of industries with imagery." />
    <Divider />
    <CardContent>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Title"
              value={industries.title}
              onChange={(event) => setIndustries((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Description"
              value={industries.description}
              onChange={(event) => setIndustries((prev) => ({ ...prev, description: event.target.value }))}
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
            <Typography variant="h6">Industries</Typography>
            <Typography variant="body2" color="text.secondary">
              Upload images, set titles, and describe each industry you support.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={openIndustryCreateDialog}
            sx={{ mt: { xs: 1, sm: 0 } }}
          >
            Add industry
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
              {industries.items
                .slice((industryPage - 1) * rowsPerPage, industryPage * rowsPerPage)
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
                          <IconButton size="small" color="primary" onClick={() => openIndustryEditDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => openIndustryDeleteDialog(item)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              {industries.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      No industries configured yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack mt={2} alignItems="flex-end">
          <Pagination
            count={Math.max(1, Math.ceil(industries.items.length / rowsPerPage))}
            page={industryPage}
            onChange={(event, page) => setIndustryPage(page)}
            color="primary"
          />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

IndustriesTab.propTypes = {
  industries: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setIndustries: PropTypes.func.isRequired,
  imagePlaceholder: PropTypes.string.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  industryPage: PropTypes.number.isRequired,
  setIndustryPage: PropTypes.func.isRequired,
  openIndustryCreateDialog: PropTypes.func.isRequired,
  openIndustryEditDialog: PropTypes.func.isRequired,
  openIndustryDeleteDialog: PropTypes.func.isRequired,
};

export default IndustriesTab;

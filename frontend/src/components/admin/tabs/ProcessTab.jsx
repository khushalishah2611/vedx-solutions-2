import { Box, Card, CardContent, CardHeader, Divider, IconButton, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { AppButton } from '../../shared/FormControls.jsx';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const ProcessTab = ({
  pagedProcesses,
  imagePlaceholder,
  openProcessCreateDialog,
  filteredProcesses,
  rowsPerPage,
  processPage,
  setProcessPage,
  processList,
  openProcessEditDialog,
  openProcessDeleteDialog,
}) => (
  <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
    <CardHeader
      title="Process"
      subheader="Capture delivery steps with visuals."
      action={
        <AppButton variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openProcessCreateDialog}>
          Add process step
        </AppButton>
      }
    />
    <Divider />
    <CardContent>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sort order</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedProcesses.map((item) => (
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
                <TableCell sx={{ maxWidth: 240 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell>{Number.isFinite(Number(item.sortOrder)) ? item.sortOrder : 0}</TableCell>
                <TableCell>{item.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => openProcessEditDialog(item)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => openProcessDeleteDialog(item)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {pagedProcesses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {processList.length === 0
                      ? 'No process steps added yet.'
                      : 'No process steps match the selected filters.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack mt={2} alignItems="flex-end">
        <Pagination
          count={Math.max(1, Math.ceil(filteredProcesses.length / rowsPerPage))}
          page={processPage}
          onChange={(event, page) => setProcessPage(page)}
          color="primary"
        />
      </Stack>
    </CardContent>
  </Card>
);

export default ProcessTab;

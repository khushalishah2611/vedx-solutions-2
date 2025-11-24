import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const initialFeedbacks = [
  {
    id: 'fb-1',
    name: 'Priya Desai',
    title: 'Great onboarding',
    rating: 5,
    description: 'The team guided us through the entire onboarding and delivered ahead of schedule.',
    submittedAt: '2024-07-14',
  },
  {
    id: 'fb-2',
    name: 'Kunal Shah',
    title: 'Clear communication',
    rating: 4,
    description: 'Daily updates and transparent timelines made execution easy to follow.',
    submittedAt: '2024-07-11',
  },
];

const emptyFeedbackForm = {
  id: '',
  name: '',
  title: '',
  rating: 5,
  description: '',
  submittedAt: new Date().toISOString().split('T')[0],
};

const dateFilterOptions = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
];

const matchesDateFilter = (value, filter) => {
  if (filter === 'all') return true;
  const target = value ? new Date(value) : null;
  if (!target || Number.isNaN(target.getTime())) return false;

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  switch (filter) {
    case 'today':
      return target >= startOfToday && target < endOfToday;
    case 'week': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 7);
      return target >= start && target < endOfToday;
    }
    case 'month': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 30);
      return target >= start && target < endOfToday;
    }
    default:
      return true;
  }
};

const AdminFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackDialogMode, setFeedbackDialogMode] = useState('create');
  const [feedbackForm, setFeedbackForm] = useState(emptyFeedbackForm);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const [nameFilter, setNameFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const resetFeedbackForm = () => setFeedbackForm(emptyFeedbackForm);

  const openFeedbackCreateDialog = () => {
    resetFeedbackForm();
    setFeedbackDialogMode('create');
    setFeedbackDialogOpen(true);
  };

  const openFeedbackEditDialog = (feedback) => {
    setFeedbackDialogMode('edit');
    setFeedbackForm({ ...feedback });
    setFeedbackDialogOpen(true);
  };

  const closeFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
  };

  const handleFeedbackFormChange = (field, value) => {
    setFeedbackForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeedbackSubmit = (event) => {
    event?.preventDefault();
    if (!feedbackForm.name.trim() || !feedbackForm.title.trim() || !feedbackForm.description.trim()) return;

    if (feedbackDialogMode === 'edit') {
      setFeedbacks((prev) => prev.map((item) => (item.id === feedbackForm.id ? { ...feedbackForm } : item)));
    } else {
      const newFeedback = { ...feedbackForm, id: `fb-${Date.now()}` };
      setFeedbacks((prev) => [newFeedback, ...prev]);
    }

    closeFeedbackDialog();
  };

  const openDeleteDialog = (feedback) => setFeedbackToDelete(feedback);
  const closeDeleteDialog = () => setFeedbackToDelete(null);
  const confirmDelete = () => {
    if (!feedbackToDelete) return;
    setFeedbacks((prev) => prev.filter((item) => item.id !== feedbackToDelete.id));
    closeDeleteDialog();
  };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const matchesName = nameFilter ? feedback.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
      const matchesTitle = titleFilter
        ? feedback.title.toLowerCase().includes(titleFilter.toLowerCase())
        : true;
      const matchesRating = ratingFilter ? Number(feedback.rating) === Number(ratingFilter) : true;
      const matchesDate = matchesDateFilter(feedback.submittedAt, dateFilter);

      return matchesName && matchesTitle && matchesRating && matchesDate;
    });
  }, [dateFilter, feedbacks, nameFilter, ratingFilter, titleFilter]);

  const pagedFeedbacks = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredFeedbacks.slice(start, start + rowsPerPage);
  }, [filteredFeedbacks, page]);

  return (
    <Stack spacing={3}>
      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Feedbacks"
          subheader="Track customer feedback with filters, CRUD actions, and quick previews."
          action={
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openFeedbackCreateDialog}>
              Add feedback
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Stack spacing={2} mb={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }}>
            <TextField
              label="Name filter"
              value={nameFilter}
              onChange={(event) => setNameFilter(event.target.value)}
              sx={{ minWidth: 200 }}
            />
            <TextField
              label="Title filter"
              value={titleFilter}
              onChange={(event) => setTitleFilter(event.target.value)}
              sx={{ minWidth: 200 }}
            />
            <TextField
              select
              label="Rating"
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">All ratings</MenuItem>
              {[5, 4, 3, 2, 1].map((value) => (
                <MenuItem key={value} value={value}>
                  {value} star{value > 1 ? 's' : ''}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Date filter"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              sx={{ minWidth: 160 }}
            >
              {dateFilterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id} hover>
                    <TableCell>{feedback.name}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{feedback.title}</TableCell>
                    <TableCell>{feedback.rating}</TableCell>
                    <TableCell sx={{ maxWidth: 340 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {feedback.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{feedback.submittedAt}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" color="primary" onClick={() => setViewingFeedback(feedback)}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary" onClick={() => openFeedbackEditDialog(feedback)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => openDeleteDialog(feedback)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFeedbacks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        No feedbacks found. Adjust filters or add a new record.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack mt={2} alignItems="flex-end">
            <Pagination
              count={Math.max(1, Math.ceil(filteredFeedbacks.length / rowsPerPage))}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={feedbackDialogOpen} onClose={closeFeedbackDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{feedbackDialogMode === 'edit' ? 'Edit feedback' : 'Add feedback'}</DialogTitle>
        <DialogContent dividers>
          <Stack component="form" spacing={2} onSubmit={handleFeedbackSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  value={feedbackForm.name}
                  onChange={(event) => handleFeedbackFormChange('name', event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Title"
                  value={feedbackForm.title}
                  onChange={(event) => handleFeedbackFormChange('title', event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Rating"
                  value={feedbackForm.rating}
                  onChange={(event) => handleFeedbackFormChange('rating', event.target.value)}
                  fullWidth
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value} star{value > 1 ? 's' : ''}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  label="Submitted date"
                  value={feedbackForm.submittedAt}
                  onChange={(event) => handleFeedbackFormChange('submittedAt', event.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TextField
              label="Description"
              value={feedbackForm.description}
              onChange={(event) => handleFeedbackFormChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={3}
              required
            />
            <Box>
              <Button type="submit" variant="contained">
                {feedbackDialogMode === 'edit' ? 'Save changes' : 'Create feedback'}
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(viewingFeedback)} onClose={() => setViewingFeedback(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Feedback preview</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={700}>
              {viewingFeedback?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From {viewingFeedback?.name} — Rated {viewingFeedback?.rating} / 5 on {viewingFeedback?.submittedAt}
            </Typography>
            <Typography variant="body1">{viewingFeedback?.description}</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingFeedback(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(feedbackToDelete)} onClose={closeDeleteDialog}>
        <DialogTitle>Delete feedback</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Are you sure you want to delete "{feedbackToDelete?.title}" from {feedbackToDelete?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AdminFeedbacksPage;

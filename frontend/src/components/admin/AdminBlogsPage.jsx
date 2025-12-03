import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Stack,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { apiUrl } from '../../utils/const.js';

const normalizeDateInput = (value) => {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().split('T')[0];
  return parsed.toISOString().split('T')[0];
};

const deriveStatusFromDate = (status, publishDate) => {
  const normalizedDate = normalizeDateInput(publishDate);
  const today = new Date().toISOString().split('T')[0];

  if (status === 'Draft') return 'Draft';
  if (normalizedDate > today) return 'Scheduled';
  return 'Published';
};

const dateFilterOptions = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' },
];

const matchesDateFilter = (value, filter, range) => {
  if (filter === 'all') return true;
  const target = value ? new Date(value) : null;
  if (!target || Number.isNaN(target.getTime())) return false;

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const dateInRange = (start, end) => target >= start && target < end;

  switch (filter) {
    case 'today':
      return dateInRange(startOfToday, endOfToday);
    case 'yesterday': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 1);
      return dateInRange(start, startOfToday);
    }
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
    case 'custom': {
      const start = range?.start ? new Date(range.start) : null;
      const end = range?.end ? new Date(range.end) : null;
      const normalizedEnd = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1) : null;
      if (start && target < start) return false;
      if (normalizedEnd && target >= normalizedEnd) return false;
      return true;
    }
    default:
      return true;
  }
};

const defaultBlogFilters = { category: 'all', status: 'all', date: 'all', start: '', end: '' };
const statusOptions = ['Draft', 'Published', 'Scheduled'];

const mapApiBlogToRow = (blog) => ({
  id: blog.id,
  title: blog.title,
  category: blog.category?.name || 'Uncategorized',
  categoryId: blog.categoryId || '',
  publishDate: blog.publishDate ? normalizeDateInput(blog.publishDate) : new Date().toISOString().split('T')[0],
  description: blog.description || '',
  conclusion: blog.conclusion || '',
  status: deriveStatusFromDate(blog.status, blog.publishDate),
});

const AdminBlogsPage = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');

  const [blogList, setBlogList] = useState([]);
  const [blogsError, setBlogsError] = useState('');
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeBlog, setActiveBlog] = useState(null);
  const [savingBlog, setSavingBlog] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const [formState, setFormState] = useState({
    id: '',
    title: '',
    categoryId: '',
    publishDate: new Date().toISOString().split('T')[0],
    description: '',
    conclusion: '',
    status: 'Draft',
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  // view dialog state
  const [viewBlog, setViewBlog] = useState(null);

  const rowsPerPage = 5;
  const [page, setPage] = useState(1);
  const [filterDraft, setFilterDraft] = useState(defaultBlogFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultBlogFilters);

  const token = useMemo(() => localStorage.getItem('adminToken'), []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    setCategoriesError('');
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl('/api/admin/blog-categories'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load categories.');
      setCategoryOptions(payload.categories || []);
    } catch (error) {
      console.error('Load blog categories failed', error);
      setCategoryOptions([]);
      setCategoriesError(error?.message || 'Unable to load categories right now.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadBlogs = async () => {
    setLoadingBlogs(true);
    setBlogsError('');
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl('/api/admin/blog-posts'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load blogs.');
      setBlogList((payload.posts || []).map(mapApiBlogToRow));
    } catch (error) {
      console.error('Load blogs failed', error);
      setBlogList([]);
      setBlogsError(error?.message || 'Unable to load blogs right now.');
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadBlogs();
  }, []);

  useEffect(() => {
    if (categoryOptions.length && !formState.categoryId) {
      setFormState((prev) => ({ ...prev, categoryId: categoryOptions[0].id }));
    }
  }, [categoryOptions, formState.categoryId]);

  const filteredBlogs = useMemo(
    () =>
      blogList.filter((blog) => {
        const categoryMatch = appliedFilters.category === 'all' || blog.categoryId === appliedFilters.category;
        const statusMatch = appliedFilters.status === 'all' || blog.status === appliedFilters.status;
        const dateMatch = matchesDateFilter(blog.publishDate, appliedFilters.date, appliedFilters);
        return categoryMatch && dateMatch && statusMatch;
      }),
    [blogList, appliedFilters]
  );

  const pagedBlogs = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredBlogs.slice(start, start + rowsPerPage);
  }, [filteredBlogs, page, rowsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredBlogs.length / rowsPerPage));
    setPage((prev) => Math.min(prev, maxPage));
  }, [filteredBlogs.length, rowsPerPage]);

  const openCreateDialog = () => {
    setDialogMode('create');
    setActiveBlog(null);
    setDialogError('');
    setDialogOpen(true);
    setFormState({
      id: '',
      title: '',
      categoryId: categoryOptions[0]?.id || '',
      publishDate: new Date().toISOString().split('T')[0],
      description: '',
      conclusion: '',
      status: 'Draft',
    });
  };

  const openEditDialog = (blog) => {
    setDialogMode('edit');
    setActiveBlog(blog);
    setDialogOpen(true);
    setDialogError('');
    setFormState({ ...blog });
  };

  const closeDialog = () => {
    setActiveBlog(null);
    setDialogOpen(false);
    setDialogError('');
  };

  const applyFilters = () => setAppliedFilters(filterDraft);

  const clearFilters = () => {
    setFilterDraft(defaultBlogFilters);
    setAppliedFilters(defaultBlogFilters);
  };

  const removeFilter = (key) => {
    const updated = { ...filterDraft, [key]: defaultBlogFilters[key] };
    if (key === 'date') {
      updated.start = '';
      updated.end = '';
    }
    setFilterDraft(updated);
    setAppliedFilters(updated);
  };

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (appliedFilters.category !== 'all') {
      const label = categoryOptions.find((cat) => cat.id === appliedFilters.category)?.name || 'Uncategorized';
      chips.push({ key: 'category', label: `Category: ${label}` });
    }
    if (appliedFilters.status !== 'all') chips.push({ key: 'status', label: `Status: ${appliedFilters.status}` });
    if (appliedFilters.date !== 'all') {
      const rangeLabel =
        appliedFilters.date === 'custom'
          ? ` (${appliedFilters.start || 'any'} → ${appliedFilters.end || 'any'})`
          : '';
      chips.push({ key: 'date', label: `Publish date: ${appliedFilters.date}${rangeLabel}` });
    }
    return chips;
  }, [appliedFilters, categoryOptions]);

  const handleFormChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setDialogError('');

    if (!formState.title.trim() || !formState.description.trim()) {
      setDialogError('Title and description are required.');
      return;
    }

    setSavingBlog(true);
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const payload = {
        title: formState.title,
        categoryId: formState.categoryId || null,
        publishDate: formState.publishDate,
        description: formState.description,
        conclusion: formState.conclusion,
        status: formState.status,
      };

      const response = await fetch(
        dialogMode === 'edit'
          ? apiUrl(`/api/admin/blog-posts/${formState.id}`)
          : apiUrl('/api/admin/blog-posts'),
        {
          method: dialogMode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || 'Unable to save blog.');

      const mapped = mapApiBlogToRow(result.post);

      setBlogList((prev) => {
        if (dialogMode === 'edit') {
          return prev.map((blog) => (blog.id === mapped.id ? mapped : blog));
        }
        return [mapped, ...prev];
      });

      closeDialog();
    } catch (error) {
      console.error('Save blog failed', error);
      setDialogError(error?.message || 'Unable to save blog right now.');
    } finally {
      setSavingBlog(false);
    }
  };

  const openDeleteDialog = (blog) => {
    setDeleteTarget(blog);
  };

  const closeDeleteDialog = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl(`/api/admin/blog-posts/${deleteTarget.id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || 'Unable to delete blog.');
      setBlogList((prev) => prev.filter((blog) => blog.id !== deleteTarget.id));
      closeDeleteDialog();
    } catch (error) {
      console.error('Delete blog failed', error);
      setBlogsError(error?.message || 'Unable to delete blog right now.');
    }
  };

  const openViewDialog = (blog) => {
    setViewBlog(blog);
  };

  const closeViewDialog = () => {
    setViewBlog(null);
  };

  return (
    <Stack spacing={3}>
      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Blogs"
          subheader="Create, edit, view or remove posts in a simple table view."
          action={
            <Button
              startIcon={<NoteAddOutlinedIcon />}
              variant="contained"
              onClick={openCreateDialog}
            >
              New draft
            </Button>
          }
        />
        <Divider />
        <CardContent>
          {blogsError && (
            <Typography color="error" variant="body2" mb={2}>
              {blogsError}
            </Typography>
          )}
          {categoriesError && (
            <Typography color="error" variant="body2" mb={2}>
              {categoriesError}
            </Typography>
          )}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-end' }} mb={2}>
            <TextField
              select
              label="Category"
              value={filterDraft.category}
              onChange={(event) => setFilterDraft((prev) => ({ ...prev, category: event.target.value }))}
              sx={{ minWidth: 200 }}
              disabled={loadingCategories}
            >
              <MenuItem value="all">All categories</MenuItem>
              {categoryOptions.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
              <MenuItem value="">Uncategorized</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              value={filterDraft.status}
              onChange={(event) => setFilterDraft((prev) => ({ ...prev, status: event.target.value }))}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">All statuses</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Publish date"
              value={filterDraft.date}
              onChange={(event) => setFilterDraft((prev) => ({ ...prev, date: event.target.value }))}
              sx={{ minWidth: 200 }}
            >
              {dateFilterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {filterDraft.date === 'custom' && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
                <TextField
                  type="date"
                  label="From"
                  value={filterDraft.start}
                  onChange={(event) => setFilterDraft((prev) => ({ ...prev, start: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="To"
                  value={filterDraft.end}
                  onChange={(event) => setFilterDraft((prev) => ({ ...prev, end: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>
            )}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mb={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
              {activeFilterChips.map((chip) => (
                <Chip key={chip.key} label={chip.label} onDelete={() => removeFilter(chip.key)} />
              ))}
              {activeFilterChips.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No filters applied
                </Typography>
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="inherit" onClick={clearFilters}>
                Clear filters
              </Button>
              <Button variant="contained" onClick={applyFilters}>
                Apply filters
              </Button>
            </Stack>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Publish Date</TableCell>
                  <TableCell>Summary</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedBlogs.map((blog) => (
                  <TableRow key={blog.id} hover>
                    <TableCell width="24%">
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        noWrap
                        sx={{ color: '#ffffff' }}
                      >
                        {blog.title}
                      </Typography>
                    </TableCell>
                    <TableCell width="16%">
                      <Chip
                        label={blog.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell width="14%">
                      <Chip
                        label={blog.status}
                        size="small"
                        color={blog.status === 'Draft' ? 'default' : 'success'}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell width="14%">
                      <Typography variant="body2" color="text.secondary">
                        {blog.publishDate}
                      </Typography>
                    </TableCell>
                    <TableCell width="22%">
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {blog.description || 'No summary added yet.'}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => openViewDialog(blog)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit draft">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openEditDialog(blog)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openDeleteDialog(blog)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!loadingBlogs && filteredBlogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        No drafts yet. Click "New draft" to create one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {loadingBlogs && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Loading blogs...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </TableContainer>
          <Stack mt={2} alignItems="flex-end">
            <Pagination
              count={Math.max(1, Math.ceil(filteredBlogs.length / rowsPerPage))}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Create / Edit draft dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'edit' ? 'Edit draft' : 'New draft'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1} component="form" onSubmit={handleSubmit}>
            <TextField
              label="Title"
              placeholder="Enter blog title"
              fullWidth
              value={formState.title}
              onChange={(event) => handleFormChange('title', event.target.value)}
              required
            />
            <TextField
              select
              label="Category"
              value={formState.categoryId}
              onChange={(event) => handleFormChange('categoryId', event.target.value)}
              fullWidth
              disabled={loadingCategories}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
              <MenuItem value="">Uncategorized</MenuItem>
            </TextField>
            <TextField
              label="Publish date"
              type="date"
              value={formState.publishDate}
              onChange={(event) => handleFormChange('publishDate', event.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="Scheduled posts publish automatically on this date"
              sx={{
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)',
                  cursor: 'pointer'
                }
              }}
            />
            <TextField
              select
              label="Status"
              value={formState.status}
              onChange={(event) => handleFormChange('status', event.target.value)}
              fullWidth
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Description"
              placeholder="Write a short description for the blog post"
              value={formState.description}
              onChange={(event) => handleFormChange('description', event.target.value)}
              multiline
              minRows={4}
              maxRows={12}
              fullWidth
              required
            />
            <TextField
              label="Conclusion"
              placeholder="Summarize the key takeaway for readers"
              value={formState.conclusion}
              onChange={(event) => handleFormChange('conclusion', event.target.value)}
              multiline
              minRows={3}
              maxRows={10}
              fullWidth
            />
            {dialogError && (
              <Typography color="error" variant="body2">
                {dialogError}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={savingBlog}>
            {dialogMode === 'edit' ? 'Save changes' : 'Save draft'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View details dialog */}
      <Dialog
        open={Boolean(viewBlog)}
        onClose={closeViewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Blog details</DialogTitle>
        <DialogContent dividers>
          {viewBlog && (
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {viewBlog.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={viewBlog.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={viewBlog.status}
                  size="small"
                  color={viewBlog.status === 'Draft' ? 'default' : 'success'}
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  Publish date: {viewBlog.publishDate}
                </Typography>
              </Stack>
              <Divider />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {viewBlog.description}
              </Typography>
              <Divider />
              <Stack spacing={0.5}>
                <Typography variant="subtitle2" color="text.secondary">
                  Conclusion
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {viewBlog.conclusion || 'No conclusion added yet.'}
                </Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete blog</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AdminBlogsPage;

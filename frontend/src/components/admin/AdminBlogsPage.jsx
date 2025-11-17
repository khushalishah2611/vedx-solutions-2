import { useMemo, useState } from 'react';
import {
  Box,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { blogPosts } from '../../data/blogs.js';

const normalizeDateInput = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().split('T')[0];
  return parsed.toISOString().split('T')[0];
};

const normalizeConclusion = (conclusion) => {
  if (typeof conclusion === 'string') return conclusion;
  if (conclusion?.paragraphs?.length) {
    return conclusion.paragraphs.join('\n\n');
  }
  return '';
};

const mapBlogPostsToRows = (posts) =>
  posts.slice(0, 5).map((post) => ({
    id: post.slug,
    title: post.title,
    category: post.category,
    publishDate: normalizeDateInput(post.publishedOn),
    description: post.excerpt,
    conclusion: normalizeConclusion(post.conclusion),
    textColor: '#1f2937',
    isBold: false
  }));

const AdminBlogsPage = () => {
  const categoryOptions = useMemo(
    () => Array.from(new Set(blogPosts.map((post) => post.category))),
    []
  );

  const [blogList, setBlogList] = useState(mapBlogPostsToRows(blogPosts));

  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeBlog, setActiveBlog] = useState(null);

  const [formState, setFormState] = useState({
    id: '',
    title: '',
    category: categoryOptions[0] || 'General',
    publishDate: new Date().toISOString().split('T')[0],
    description: '',
    conclusion: '',
    textColor: '#1f2937',
    isBold: false
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  // view dialog state
  const [viewBlog, setViewBlog] = useState(null);

  const openCreateDialog = () => {
    setDialogMode('create');
    setActiveBlog(null);
    setDialogOpen(true);
    setFormState({
      id: '',
      title: '',
      category: categoryOptions[0] || 'General',
      publishDate: new Date().toISOString().split('T')[0],
      description: '',
      conclusion: '',
      textColor: '#1f2937',
      isBold: false
    });
  };

  const openEditDialog = (blog) => {
    setDialogMode('edit');
    setActiveBlog(blog);
    setDialogOpen(true);
    // keep id so we can update correct row
    setFormState({ ...blog });
  };

  const closeDialog = () => {
    setActiveBlog(null);
    setDialogOpen(false);
  };

  const handleFormChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event?.preventDefault();
    if (!formState.title.trim() || !formState.description.trim()) return;

    if (dialogMode === 'edit' && activeBlog) {
      // update existing draft
      setBlogList((prev) =>
        prev.map((blog) =>
          blog.id === activeBlog.id ? { ...formState } : blog
        )
      );
    } else {
      // create new draft
      const newEntry = {
        ...formState,
        id: `${Date.now()}`
      };
      setBlogList((prev) => [newEntry, ...prev]);
    }

    closeDialog();
  };

  const openDeleteDialog = (blog) => {
    setDeleteTarget(blog);
  };

  const closeDeleteDialog = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setBlogList((prev) => prev.filter((blog) => blog.id !== deleteTarget.id));
    closeDeleteDialog();
  };

  const openViewDialog = (blog) => {
    setViewBlog(blog);
  };

  const closeViewDialog = () => {
    setViewBlog(null);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Manage Blogs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add new blog drafts, update existing posts, and control how they appear on the site.
        </Typography>
      </Box>

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
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Publish Date</TableCell>

                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogList.map((blog) => (
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
                    <TableCell width="16%">
                      <Typography variant="body2" color="text.secondary">
                        {blog.publishDate}
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
                {blogList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        No drafts yet. Click &quot;New draft&quot; to create one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
              value={formState.category}
              onChange={(event) => handleFormChange('category', event.target.value)}
              fullWidth
            >
              {(categoryOptions.length ? categoryOptions : ['General']).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Publish date"
              type="date"
              value={formState.publishDate}
              onChange={(event) => handleFormChange('publishDate', event.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)',
                  cursor: 'pointer'
                }
              }}
            />
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
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
            Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
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

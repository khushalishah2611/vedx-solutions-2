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
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { blogPosts } from '../../data/blogs.js';

const mapBlogPostsToRows = (posts) =>
  posts.slice(0, 5).map((post) => ({
    id: post.slug,
    title: post.title,
    category: post.category,
    publishDate: post.publishedOn,
    description: post.excerpt,
    textColor: '#1f2937',
    isBold: false
  }));

const AdminBlogsPage = () => {
  const categoryOptions = useMemo(
    () => Array.from(new Set(blogPosts.map((post) => post.category))),
    []
  );

  const [blogList, setBlogList] = useState(mapBlogPostsToRows(blogPosts));
  const [dialogMode, setDialogMode] = useState('create');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeBlog, setActiveBlog] = useState(null);
  const [formState, setFormState] = useState({
    title: '',
    category: categoryOptions[0] || 'General',
    publishDate: new Date().toISOString().split('T')[0],
    description: '',
    textColor: '#1f2937',
    isBold: false
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreateDialog = () => {
    setDialogMode('create');
    setActiveBlog(null);
    setDialogOpen(true);
    setFormState({
      title: '',
      category: categoryOptions[0] || 'General',
      publishDate: new Date().toISOString().split('T')[0],
      description: '',
      textColor: '#1f2937',
      isBold: false
    });
  };

  const openEditDialog = (blog) => {
    setDialogMode('edit');
    setActiveBlog(blog);
    setDialogOpen(true);
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
      setBlogList((prev) => prev.map((blog) => (blog.id === activeBlog.id ? { ...formState } : blog)));
    } else {
      const newEntry = { ...formState, id: `${Date.now()}` };
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
          subheader="Create, edit, or remove posts in a simple table view."
          action={
            <Button startIcon={<NoteAddOutlinedIcon />} variant="contained" onClick={openCreateDialog}>
              New blog
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
                  <TableCell>Description</TableCell>
                  <TableCell>Style</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogList.map((blog) => (
                  <TableRow key={blog.id} hover>
                    <TableCell width="24%">
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {blog.title}
                      </Typography>
                    </TableCell>
                    <TableCell width="16%">
                      <Chip label={blog.category} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell width="16%">
                      <Typography variant="body2" color="text.secondary">
                        {blog.publishDate}
                      </Typography>
                    </TableCell>
                    <TableCell width="28%">
                      <Typography
                        variant="body2"
                        color={blog.textColor}
                        fontWeight={blog.isBold ? 700 : 400}
                        noWrap
                      >
                        {blog.description}
                      </Typography>
                    </TableCell>
                    <TableCell width="10%">
                      <Stack direction="row" spacing={1} alignItems="center">
                        {blog.isBold && <Chip label="Bold" size="small" color="success" variant="outlined" />}
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: 0.75,
                            bgcolor: blog.textColor,
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => openEditDialog(blog)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => openDeleteDialog(blog)}>
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
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogMode === 'edit' ? 'Edit blog' : 'New blog'}</DialogTitle>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Publish date"
                  type="date"
                  value={formState.publishDate}
                  onChange={(event) => handleFormChange('publishDate', event.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Button
                  startIcon={<FormatBoldIcon />}
                  variant={formState.isBold ? 'contained' : 'outlined'}
                  color={formState.isBold ? 'primary' : 'inherit'}
                  onClick={() => handleFormChange('isBold', !formState.isBold)}
                  fullWidth
                >
                  {formState.isBold ? 'Bold text enabled' : 'Make description bold'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description color"
                  type="color"
                  value={formState.textColor}
                  onChange={(event) => handleFormChange('textColor', event.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Description"
              placeholder="Write a short description for the blog post"
              value={formState.description}
              onChange={(event) => handleFormChange('description', event.target.value)}
              multiline
              minRows={4}
              fullWidth
              required
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

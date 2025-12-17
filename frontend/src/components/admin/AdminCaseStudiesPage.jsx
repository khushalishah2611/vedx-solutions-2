import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { apiUrl } from '../../utils/const.js';
import { fileToDataUrl } from '../../utils/files.js';

const slugify = (value = '') =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const defaultFormState = {
  id: '',
  title: '',
  subtitle: '',
  description: '',
  slug: '',
  coverImage: '',
  tagIds: [],
};

const formatCaseStudyRow = (item) => ({
  id: item.id,
  title: item.title || '',
  subtitle: item.subtitle || '',
  description: item.description || '',
  slug: item.slug || '',
  coverImage: item.coverImage || '',
  tagIds: Array.isArray(item.tagIds) ? item.tagIds : [],
  tags: Array.isArray(item.tags) ? item.tags : [],
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const formatTag = (tag) => ({
  id: tag.id,
  name: tag.name || '',
});

const ImageUpload = ({ label, value, onChange }) => {
  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onChange?.(dataUrl);
  };

  return (
    <Stack spacing={1}>
      <Button component="label" variant="outlined">
        {value ? `Change ${label}` : `Upload ${label}`}
        <input type="file" hidden accept="image/*" onChange={handleChange} />
      </Button>
      {value && (
        <img
          src={value}
          alt={`Selected ${label}`}
          style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8 }}
        />
      )}
    </Stack>
  );
};

const AdminCaseStudiesPage = () => {
  const token = useMemo(() => localStorage.getItem('adminToken'), []);
  const navigate = useNavigate();

  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [tags, setTags] = useState([]);
  const [tagsError, setTagsError] = useState('');
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [tagDialogMode, setTagDialogMode] = useState('create');
  const [tagForm, setTagForm] = useState({ id: '', name: '' });
  const [savingTag, setSavingTag] = useState(false);
  const [tagDialogError, setTagDialogError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // create | edit
  const [formState, setFormState] = useState(defaultFormState);
  const [saving, setSaving] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewCaseStudy, setViewCaseStudy] = useState(null);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', tagId: 'all' });

  const rowsPerPage = 10;

  const loadTags = async () => {
    setTagsError('');
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl('/api/admin/tags'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load tags.');
      setTags((payload.tags || []).map(formatTag));
    } catch (err) {
      console.error('Load tags failed', err);
      setTags([]);
      setTagsError(err?.message || 'Unable to load tags right now.');
    }
  };

  const loadCaseStudies = async (targetPage = page, targetFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');

      const params = new URLSearchParams({
        page: String(targetPage),
        pageSize: String(rowsPerPage),
      });

      if (targetFilters.search.trim()) {
        params.set('search', targetFilters.search.trim());
      }

      if (targetFilters.tagId && targetFilters.tagId !== 'all') {
        params.set('tagIds', String(targetFilters.tagId));
      }

      const response = await fetch(apiUrl(`/api/admin/case-studies?${params.toString()}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load case studies.');

      setCaseStudies((payload.caseStudies || []).map(formatCaseStudyRow));
      const incomingPagination = payload.pagination || {};
      setPagination({
        page: incomingPagination.page || 1,
        totalPages: incomingPagination.totalPages || 1,
        total: incomingPagination.total || 0,
      });
    } catch (err) {
      console.error('Load case studies failed', err);
      setCaseStudies([]);
      setPagination({ page: 1, totalPages: 1, total: 0 });
      setError(err?.message || 'Unable to load case studies right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    loadCaseStudies(page, filters);
  }, [page, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dialogMode === 'create') {
      setFormState((prev) => ({
        ...prev,
        slug: slugify(prev.title || ''),
      }));
    }
  }, [formState.title, dialogMode]);

  const openTagDialog = (mode = 'create', tag = null) => {
    setTagDialogMode(mode);
    setTagDialogError('');
    setTagDialogOpen(true);
    setTagForm(tag ? { id: tag.id, name: tag.name || '' } : { id: '', name: '' });
  };

  const closeTagDialog = () => {
    if (savingTag) return;
    setTagDialogOpen(false);
    setTagDialogError('');
  };

  const handleTagSave = async () => {
    const name = tagForm.name.trim();
    if (!name) {
      setTagDialogError('Tag name is required.');
      return;
    }

    setSavingTag(true);
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(
        tagDialogMode === 'edit'
          ? apiUrl(`/api/admin/tags/${tagForm.id}`)
          : apiUrl('/api/admin/tags'),
        {
          method: tagDialogMode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to save tag.');

      const saved = formatTag(payload.tag);
      setTags((prev) =>
        tagDialogMode === 'edit'
          ? prev.map((tag) => (tag.id === saved.id ? saved : tag))
          : [saved, ...prev]
      );

      setFormState((prev) => ({
        ...prev,
        tagIds: prev.tagIds.includes(saved.id) ? prev.tagIds : [...prev.tagIds, saved.id],
      }));

      closeTagDialog();
    } catch (err) {
      console.error('Save tag failed', err);
      setTagDialogError(err?.message || 'Unable to save tag right now.');
    } finally {
      setSavingTag(false);
    }
  };

  const handleTagDelete = async (tagId) => {
    if (!tagId) return;
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl(`/api/admin/tags/${tagId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to delete tag.');

      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
      setFormState((prev) => ({ ...prev, tagIds: prev.tagIds.filter((id) => id !== tagId) }));
    } catch (err) {
      console.error('Delete tag failed', err);
      setTagsError(err?.message || 'Unable to delete tag right now.');
    }
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setDialogError('');
    setFormState(defaultFormState);
    setDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setDialogMode('edit');
    setDialogError('');
    setFormState({
      id: item.id,
      title: item.title || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
      slug: item.slug || '',
      coverImage: item.coverImage || '',
      tagIds: Array.isArray(item.tagIds) ? item.tagIds : [],
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setDialogError('');
  };

  const handleSave = async () => {
    setDialogError('');
    const trimmedTitle = formState.title.trim();
    const trimmedSlug = formState.slug.trim() || slugify(formState.title);

    if (!trimmedTitle) {
      setDialogError('Title is required.');
      return;
    }

    if (!trimmedSlug) {
      setDialogError('Slug is required.');
      return;
    }

    setSaving(true);
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const payload = {
        title: trimmedTitle,
        subtitle: formState.subtitle,
        description: formState.description,
        coverImage: formState.coverImage,
        slug: trimmedSlug,
        tagIds: formState.tagIds,
      };

      const response = await fetch(
        dialogMode === 'edit'
          ? apiUrl(`/api/admin/case-studies/${formState.id}`)
          : apiUrl('/api/admin/case-studies'),
        {
          method: dialogMode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Unable to save case study.');

      const saved = formatCaseStudyRow(data.caseStudy);
      setCaseStudies((prev) =>
        dialogMode === 'edit'
          ? prev.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...prev]
      );

      closeDialog();
    } catch (err) {
      console.error('Save case study failed', err);
      setDialogError(err?.message || 'Unable to save case study right now.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const shouldMovePage = caseStudies.length <= 1 && page > 1;
      const nextPage = shouldMovePage ? page - 1 : page;
      const response = await fetch(apiUrl(`/api/admin/case-studies/${deleteTarget.id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to delete case study.');

      setCaseStudies((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setPage(nextPage);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete case study failed', err);
      setError(err?.message || 'Unable to delete case study right now.');
      setDeleteTarget(null);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Case Studies
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage case study records, tags, and cover images.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<LocalOfferOutlinedIcon />}
            onClick={() => openTagDialog('create')}
          >
            Add Tag
          </Button>
          <Button
            variant="contained"
            startIcon={<NoteAddOutlinedIcon />}
            onClick={openCreateDialog}
          >
            Add Case Study
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Filters" />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Search"
                  size="small"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search title or description"
                  fullWidth
                />
                <TextField
                  label="Tag"
                  select
                  size="small"
                  value={filters.tagId}
                  onChange={(e) => handleFilterChange('tagId', e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  fullWidth
                >
                  <MenuItem value="all">All tags</MenuItem>
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </TextField>
                {tagsError && (
                  <Typography variant="caption" color="error">
                    {tagsError}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardHeader title="Tags" />
            <CardContent>
              {tags.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No tags added yet.
                </Typography>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      onDelete={() => handleTagDelete(tag.id)}
                      onClick={() => openTagDialog('edit', tag)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Case Study List"
              subheader={`Total: ${pagination.total}`}
              action={
                <Button variant="contained" size="small" startIcon={<NoteAddOutlinedIcon />} onClick={openCreateDialog}>
                  Add New
                </Button>
              }
            />
            <CardContent>
              {error && (
                <Typography color="error" variant="body2" mb={2}>
                  {error}
                </Typography>
              )}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Tags</TableCell>
                      <TableCell>Updated</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {caseStudies.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            {item.coverImage ? (
                              <Box
                                component="img"
                                src={item.coverImage}
                                alt={item.title}
                                sx={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 1 }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 64,
                                  height: 48,
                                  bgcolor: 'grey.200',
                                  borderRadius: 1,
                                }}
                              />
                            )}
                            <Box>
                              <Typography fontWeight={700}>{item.title}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.subtitle || '—'}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {item.tags?.map((tag) => (
                              <Chip key={tag.id} label={tag.name} size="small" />
                            ))}
                          </Stack>
                        </TableCell>
                        <TableCell>{item.updatedAt ? String(item.updatedAt).split('T')[0] : '-'}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Manage Details">
                              <IconButton color="primary" onClick={() => navigate(`/admin/case-studies/${item.id}/details`)}>
                                <FactCheckOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View">
                              <IconButton color="primary" onClick={() => setViewCaseStudy(item)}>
                                <VisibilityOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => openEditDialog(item)}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton color="error" onClick={() => setDeleteTarget(item)}>
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

              {caseStudies.length === 0 && !loading && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No case studies found.
                </Typography>
              )}

              <Stack direction="row" justifyContent="center" mt={3}>
                <Pagination
                  page={pagination.page}
                  count={pagination.totalPages}
                  onChange={(_event, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'edit' ? 'Edit Case Study' : 'Add Case Study'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} mt={1}>
            <TextField
              label="Title"
              value={formState.title}
              onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Subtitle"
              value={formState.subtitle}
              onChange={(e) => setFormState((prev) => ({ ...prev, subtitle: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Slug"
              value={formState.slug}
              onChange={(e) => setFormState((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
              helperText="Used in the public URL."
              fullWidth
            />
            <TextField
              label="Description"
              value={formState.description}
              onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <ImageUpload
              label="Cover Image"
              value={formState.coverImage}
              onChange={(value) => setFormState((prev) => ({ ...prev, coverImage: value }))}
            />
            <TextField
              label="Tags"
              select
              SelectProps={{ multiple: true }}
              value={formState.tagIds}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  tagIds: e.target.value.map((value) => Number(value)),
                }))
              }
              helperText="Select one or more tags"
              fullWidth
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </TextField>
            {dialogError && (
              <Typography variant="body2" color="error">
                {dialogError}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {dialogMode === 'edit' ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!viewCaseStudy} onClose={() => setViewCaseStudy(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Case Study</DialogTitle>
        <DialogContent dividers>
          {viewCaseStudy && (
            <Stack spacing={2}>
              {viewCaseStudy.coverImage && (
                <Box
                  component="img"
                  src={viewCaseStudy.coverImage}
                  alt={viewCaseStudy.title}
                  sx={{ width: '100%', borderRadius: 2 }}
                />
              )}
              <Box>
                <Typography variant="overline" color="text.secondary">
                  {viewCaseStudy.slug}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {viewCaseStudy.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {viewCaseStudy.subtitle}
                </Typography>
              </Box>
              <Divider />
              <Typography variant="body1">{viewCaseStudy.description || 'No description provided.'}</Typography>
              {viewCaseStudy.tags?.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {viewCaseStudy.tags.map((tag) => (
                    <Chip key={tag.id} label={tag.name} />
                  ))}
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewCaseStudy(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete case study?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={tagDialogOpen} onClose={closeTagDialog}>
        <DialogTitle>{tagDialogMode === 'edit' ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tag Name"
            fullWidth
            value={tagForm.name}
            onChange={(e) => setTagForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          {tagDialogError && (
            <Typography variant="body2" color="error" mt={1}>
              {tagDialogError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTagDialog} disabled={savingTag}>
            Cancel
          </Button>
          <Button onClick={handleTagSave} variant="contained" disabled={savingTag}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCaseStudiesPage;

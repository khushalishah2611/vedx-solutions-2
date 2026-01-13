import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Chip, Divider, MenuItem, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, IconButton, Tooltip, Typography } from '@mui/material';
import { AppButton, AppDialog, AppDialogActions, AppDialogContent, AppDialogTitle, AppSelectField, AppTextField } from '../shared/FormControls.jsx';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { apiUrl } from '../../utils/const.js';
import { fileToDataUrl } from '../../utils/files.js';

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

const formatDisplayDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return '-';
  return parsed.toISOString().split('T')[0];
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

const ImageUpload = ({ label, value, onChange, helperText }) => {
  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onChange?.(dataUrl);
  };

  return (
    <Stack spacing={1}>
      <AppButton component="label" variant="outlined">
        {value ? `Change ${label}` : `Upload ${label}`}
        <input type="file" hidden accept="image/*" onChange={handleChange} />
      </AppButton>
      {value && (
        <img
          src={value}
          alt={`Selected ${label}`}
          style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8 }}
        />
      )}
      {helperText && (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      )}
    </Stack>
  );
};

const sanitizeRichText = (value) => {
  if (!value) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, 'text/html');
  const allowedTags = new Set(['A', 'B', 'STRONG', 'EM', 'I', 'U', 'UL', 'OL', 'LI', 'P', 'BR']);

  const sanitizeNode = (node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) return;

      if (child.nodeType !== Node.ELEMENT_NODE || !allowedTags.has(child.tagName)) {
        const text = child.textContent || '';
        child.replaceWith(doc.createTextNode(text));
        return;
      }

      if (child.tagName === 'A') {
        const href = child.getAttribute('href') || '';
        if (!/^https?:\/\//i.test(href) && !href.startsWith('mailto:')) {
          child.replaceWith(doc.createTextNode(child.textContent || ''));
          return;
        }
        child.setAttribute('target', '_blank');
        child.setAttribute('rel', 'noopener noreferrer');
        [...child.attributes].forEach((attr) => {
          if (!['href', 'target', 'rel'].includes(attr.name)) {
            child.removeAttribute(attr.name);
          }
        });
      } else {
        [...child.attributes].forEach((attr) => child.removeAttribute(attr.name));
      }

      sanitizeNode(child);
    });
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML || doc.body.textContent || '';
};

const RichTextSection = ({ label, content, emptyText }) => {
  const sanitized = useMemo(() => sanitizeRichText(content || ''), [content]);
  const hasContent = Boolean(sanitized.trim());

  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      {hasContent ? (
        <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
          <Box component="span" dangerouslySetInnerHTML={{ __html: sanitized }} />
        </Typography>
      ) : (
        <Typography variant="body1" color="text.secondary">
          {emptyText}
        </Typography>
      )}
    </Stack>
  );
};

const mapApiBlogToRow = (blog) => ({
  id: blog.id,
  title: blog.title,
  subtitle: blog.subtitle || '',
  category: blog.category?.name || 'Uncategorized',
  categoryId: blog.categoryId || '',
  publishDate: blog.publishDate ? normalizeDateInput(blog.publishDate) : new Date().toISOString().split('T')[0],
  shortDescription: blog.shortDescription || blog.description || '',
  longDescription: blog.longDescription || blog.conclusion || blog.description || '',
  conclusion: blog.conclusion || '',
  status: deriveStatusFromDate(blog.status, blog.publishDate),
  coverImage: blog.coverImage || blog.blogImage || '',
  blogImage: blog.blogImage || blog.coverImage || '',
  slug: blog.slug || '',
});

const createEmptyFormState = () => ({
  id: '',
  title: '',
  subtitle: '',
  slug: '',
  categoryId: '',
  publishDate: new Date().toISOString().split('T')[0],
  shortDescription: '',
  longDescription: '',
  conclusion: '',
  status: 'Draft',
  coverImage: '',
  blogImage: '',
});

const AdminBlogsPage = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryDialogMode, setCategoryDialogMode] = useState('create');
  const [categoryDialogError, setCategoryDialogError] = useState('');
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '' });
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);

  const [blogList, setBlogList] = useState([]);
  const [blogsError, setBlogsError] = useState('');
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeBlog, setActiveBlog] = useState(null);
  const [savingBlog, setSavingBlog] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const [formState, setFormState] = useState(createEmptyFormState());

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

  const openCategoryDialog = (mode = 'create', category = null) => {
    setCategoryDialogMode(mode);
    setCategoryDialogError('');
    setCategoryDialogOpen(true);
    if (category) {
      setCategoryForm({ id: category.id, name: category.name || '' });
    } else {
      setCategoryForm({ id: '', name: '' });
    }
  };

  const closeCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setCategoryDialogError('');
  };

  const handleCategorySave = async () => {
    setCategoryDialogError('');
    const trimmedName = categoryForm.name.trim();
    if (!trimmedName) {
      setCategoryDialogError('Category name is required.');
      return;
    }

    setSavingCategory(true);
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');

      const response = await fetch(
        categoryDialogMode === 'edit'
          ? apiUrl(`/api/admin/blog-categories/${categoryForm.id}`)
          : apiUrl('/api/admin/blog-categories'),
        {
          method: categoryDialogMode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: trimmedName }),
        }
      );

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to save category.');

      const saved = payload.category;
      setCategoryOptions((prev) =>
        categoryDialogMode === 'edit'
          ? prev.map((cat) => (cat.id === saved.id ? saved : cat))
          : [saved, ...prev]
      );

      if (categoryDialogMode === 'edit') {
        setBlogList((prev) =>
          prev.map((blog) =>
            blog.categoryId === saved.id ? { ...blog, category: saved.name } : blog
          )
        );
      }

      // if the blog form or filters were using an empty category, set it to the newly created one
      if (!formState.categoryId || formState.categoryId === categoryForm.id) {
        setFormState((prev) => ({ ...prev, categoryId: saved.id }));
      }

      if (appliedFilters.category === categoryForm.id) {
        setAppliedFilters((prev) => ({ ...prev, category: saved.id }));
      }

      closeCategoryDialog();
    } catch (error) {
      console.error('Save blog category failed', error);
      setCategoryDialogError(error?.message || 'Unable to save category right now.');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleCategoryDelete = async () => {
    if (!categoryToDelete) return;
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl(`/api/admin/blog-categories/${categoryToDelete.id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to delete category.');

      const updatedCategories = categoryOptions.filter((cat) => cat.id !== categoryToDelete.id);
      setCategoryOptions(updatedCategories);

      setBlogList((prev) =>
        prev.map((blog) =>
          blog.categoryId === categoryToDelete.id
            ? { ...blog, categoryId: '', category: 'Uncategorized' }
            : blog
        )
      );

      if (filterDraft.category === categoryToDelete.id || appliedFilters.category === categoryToDelete.id) {
        setFilterDraft((prev) => ({ ...prev, category: 'all' }));
        setAppliedFilters((prev) => ({ ...prev, category: 'all' }));
      }

      if (formState.categoryId === categoryToDelete.id) {
        setFormState((prev) => ({ ...prev, categoryId: updatedCategories[0]?.id || '' }));
      }

      setCategoryToDelete(null);
    } catch (error) {
      console.error('Delete blog category failed', error);
      setCategoriesError(error?.message || 'Unable to delete category right now.');
    } finally {
      setCategoryToDelete(null);
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
    setFormState({ ...createEmptyFormState(), categoryId: categoryOptions[0]?.id || '' });
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

    const trimmedTitle = formState.title.trim();
    const trimmedSubtitle = formState.subtitle.trim();
    const trimmedSlug = formState.slug.trim();
    const trimmedShortDescription = formState.shortDescription.trim();
    const trimmedLongDescription = formState.longDescription.trim();
    const trimmedConclusion = formState.conclusion.trim();
    const trimmedCoverImage = formState.coverImage.trim();
    const trimmedBlogImage = formState.blogImage.trim();

    const requiredField = [
      { key: trimmedTitle, label: 'Title' },
      { key: trimmedSubtitle, label: 'Subtitle' },
      { key: formState.categoryId, label: 'Category' },
      { key: formState.publishDate, label: 'Publish date' },
      { key: formState.status, label: 'Status' },
      { key: trimmedShortDescription, label: 'Short description' },
      { key: trimmedLongDescription, label: 'Long description' },
      { key: trimmedConclusion, label: 'Conclusion' },
    ].find((entry) => !entry.key);

    if (requiredField) {
      setDialogError(`${requiredField.label} is required.`);
      return;
    }

    const resolvedCoverImage = trimmedCoverImage || trimmedBlogImage;
    const resolvedBlogImage = trimmedBlogImage || trimmedCoverImage;

    if (!resolvedCoverImage) {
      setDialogError('A cover or blog image is required.');
      return;
    }

    setSavingBlog(true);
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const payload = {
        title: trimmedTitle,
        subtitle: trimmedSubtitle,
        categoryId: formState.categoryId,
        publishDate: formState.publishDate,
        slug: trimmedSlug || trimmedTitle,
        shortDescription: trimmedShortDescription,
        longDescription: trimmedLongDescription || trimmedShortDescription,
        conclusion: trimmedConclusion || trimmedLongDescription || trimmedShortDescription,
        status: formState.status,
        coverImage: resolvedCoverImage,
        blogImage: resolvedBlogImage,
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
          title="Blog categories"
          subheader="Create, rename, or delete categories used by blog posts."
          action={
            <AppButton variant="contained" onClick={() => openCategoryDialog('create')}>
              Add category
            </AppButton>
          }
        />
        <Divider />
        <CardContent>
          {categoriesError && (
            <Typography color="error" variant="body2" mb={2}>
              {categoriesError}
            </Typography>
          )}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryOptions.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{category.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDisplayDate(category.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit category">
                          <IconButton size="small" onClick={() => openCategoryDialog('edit', category)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete category">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setCategoryToDelete(category)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!loadingCategories && categoryOptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        No categories yet. Create one to start organising posts.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {loadingCategories && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Loading categories...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Blogs"
          subheader="Create, edit, view or remove posts in a simple table view."
          action={
            <AppButton
              startIcon={<NoteAddOutlinedIcon />}
              variant="contained"
              onClick={openCreateDialog}
            >
              New draft
            </AppButton>
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
            <AppSelectField
             
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
            </AppSelectField>
            <AppSelectField
             
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
            </AppSelectField>
            <AppSelectField
             
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
            </AppSelectField>
            {filterDraft.date === 'custom' && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
                <AppTextField
                  type="date"
                  label="From"
                  value={filterDraft.start}
                  onChange={(event) => setFilterDraft((prev) => ({ ...prev, start: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <AppTextField
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
              <AppButton variant="outlined" color="inherit" onClick={clearFilters}>
                Clear filters
              </AppButton>
              <AppButton variant="contained" onClick={applyFilters}>
                Apply filters
              </AppButton>
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
                  <TableCell>Short description</TableCell>
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: 'pre-line' }}
                      >
                        {blog.shortDescription || 'No summary added yet.'}
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
                    <TableCell colSpan={7}>
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
                    <TableCell colSpan={7}>
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

      {/* Blog category dialog */}
      <AppDialog open={categoryDialogOpen} onClose={closeCategoryDialog} maxWidth="xs" fullWidth>
        <AppDialogTitle>{categoryDialogMode === 'edit' ? 'Edit category' : 'Add category'}</AppDialogTitle>
        <AppDialogContent dividers>
          <Stack spacing={2} mt={1}>
            <AppTextField
              label="Category name"
              value={categoryForm.name}
              onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
              required
              autoFocus
            />
            {categoryDialogError && (
              <Typography color="error" variant="body2">
                {categoryDialogError}
              </Typography>
            )}
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeCategoryDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleCategorySave} variant="contained" disabled={savingCategory}>
            {categoryDialogMode === 'edit' ? 'Save changes' : 'Create category'}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      <AppDialog open={Boolean(categoryToDelete)} onClose={() => setCategoryToDelete(null)} maxWidth="xs" fullWidth>
        <AppDialogTitle>Delete category</AppDialogTitle>
        <AppDialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Delete "{categoryToDelete?.name}"? Posts in this category will become uncategorized.
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={() => setCategoryToDelete(null)} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleCategoryDelete} color="error" variant="contained">
            Delete
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Create / Edit draft dialog */}
      <AppDialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <AppDialogTitle>
          {dialogMode === 'edit' ? 'Edit draft' : 'New draft'}
        </AppDialogTitle>
        <AppDialogContent dividers>
          <Stack spacing={2} mt={1} component="form" onSubmit={handleSubmit}>
            <AppTextField
              label="Title"
              placeholder="Enter blog title"
              fullWidth
              value={formState.title}
              onChange={(event) => handleFormChange('title', event.target.value)}
              required
            />
            <AppTextField
              label="Subtitle"
              placeholder="Enter blog sub title"
              fullWidth
              value={formState.subtitle}
              onChange={(event) => handleFormChange('subtitle', event.target.value)}
              multiline
              minRows={2}
              maxRows={4}
              required
            />
            <AppSelectField
             
              label="Category"
              value={formState.categoryId}
              onChange={(event) => handleFormChange('categoryId', event.target.value)}
              fullWidth
              disabled={loadingCategories || !categoryOptions.length}
              required
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
              <MenuItem value="">Uncategorized</MenuItem>
            </AppSelectField>
            <AppTextField
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
              required
            />
            <AppSelectField
             
              label="Status"
              value={formState.status}
              onChange={(event) => handleFormChange('status', event.target.value)}
              fullWidth
              required
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </AppSelectField>
            <ImageUpload
              label="cover image"
              value={formState.coverImage}
              onChange={(value) => handleFormChange('coverImage', value)}
              helperText="Shown on listing cards and as the hero image for the blog post."
            />
            <ImageUpload
              label="blog image"
              value={formState.blogImage}
              onChange={(value) => handleFormChange('blogImage', value)}
              helperText="Used within the blog content. If omitted, the cover image will be reused."
            />
            <AppTextField
              label="Short description"
              placeholder="Write a short description for the blog post"
              value={formState.shortDescription}
              onChange={(event) => handleFormChange('shortDescription', event.target.value)}
              multiline
              minRows={4}
              maxRows={14}
              fullWidth
              required
            />
            <AppTextField
              label="Long description"
              placeholder="Summarize the key takeaway for readers"
              value={formState.longDescription}
              onChange={(event) => handleFormChange('longDescription', event.target.value)}
              multiline
              minRows={5}
              maxRows={16}
              fullWidth
              required
            />
            <AppTextField
              label="Conclusion"
              placeholder="Wrap up your post with a clear takeaway"
              value={formState.conclusion}
              onChange={(event) => handleFormChange('conclusion', event.target.value)}
              multiline
              minRows={3}
              maxRows={10}
              fullWidth
              required
            />

            {dialogError && (
              <Typography color="error" variant="body2">
                {dialogError}
              </Typography>
            )}
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleSubmit} variant="contained" disabled={savingBlog}>
            {dialogMode === 'edit' ? 'Save changes' : 'Save draft'}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* View details dialog */}
      <AppDialog
        open={Boolean(viewBlog)}
        onClose={closeViewDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>Blog details</AppDialogTitle>
        <AppDialogContent dividers>
          {viewBlog && (
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {viewBlog.title}
              </Typography>
                 <RichTextSection
                label="Long description"
                content={viewBlog.subtitle}
                emptyText="No long description added yet."
              />
              <Stack spacing={1}>
                {viewBlog.coverImage && (
                  <Box
                    component="img"
                    src={viewBlog.coverImage}
                    alt="Blog cover"
                    sx={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 1 }}
                  />
                )}
                {viewBlog.blogImage && viewBlog.blogImage !== viewBlog.coverImage && (
                  <Box
                    component="img"
                    src={viewBlog.blogImage}
                    alt="Blog visual"
                    sx={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 1 }}
                  />
                )}
              </Stack>
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
              <RichTextSection
                label="Short description"
                content={viewBlog.shortDescription}
                emptyText="No short description added yet."
              />
              <Divider />
              <RichTextSection
                label="Conclusion"
                content={viewBlog.conclusion}
                emptyText="No conclusion added yet."
              />
              <Divider />
              <RichTextSection
                label="Long description"
                content={viewBlog.longDescription}
                emptyText="No long description added yet."
              />
            </Stack>
          )}
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeViewDialog} color="inherit">
            Close
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Delete confirm dialog */}
      <AppDialog open={Boolean(deleteTarget)} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
        <AppDialogTitle>Delete blog</AppDialogTitle>
        <AppDialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeDeleteDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </AppButton>
        </AppDialogActions>
      </AppDialog>
    </Stack>
  );
};

export default AdminBlogsPage;

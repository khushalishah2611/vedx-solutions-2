import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
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

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SubdirectoryArrowRightRoundedIcon from '@mui/icons-material/SubdirectoryArrowRightRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

// ─────────────────────────────
// Initial data
// ─────────────────────────────
const initialCategories = [
  {
    id: 'web',
    label: 'Web',
    name: 'Web Development',
    description: 'Full-stack web solutions, CMS builds, and design systems.',
    createdOn: '2024-07-01',
    subcategories: [
      { id: 'frontend', name: 'Frontend', description: 'React, Next.js, and performant UI builds.' },
      { id: 'backend', name: 'Backend', description: 'Node.js, Python, and cloud-first APIs.' },
      { id: 'cms', name: 'CMS', description: 'Headless CMS and site replatforming.' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    name: 'Mobile Apps',
    description: 'Native and cross-platform mobile products.',
    createdOn: '2024-07-05',
    subcategories: [
      { id: 'ios', name: 'iOS', description: 'Swift / SwiftUI product delivery.' },
      { id: 'android', name: 'Android', description: 'Compose-first Android squads.' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    name: 'Data & AI',
    description: 'Analytics platforms, AI copilots, and automation.',
    createdOn: '2024-07-08',
    subcategories: [
      { id: 'analytics', name: 'Analytics', description: 'Dashboards, pipelines, and observability.' },
      { id: 'automation', name: 'Automation', description: 'Workflow orchestration and RPA.' },
    ],
  },
];

const initialHireCategories = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developers',
    description: 'React, Next.js, and modern UI specialists.',
    subcategories: [
      { id: 'react', title: 'React Developer' },
      { id: 'nextjs', title: 'Next.js Developer' },
    ],
  },
  {
    id: 'backend-dev',
    title: 'Backend Developers',
    description: 'Node.js, APIs, and microservices.',
    subcategories: [
      { id: 'node', title: 'Node.js Developer' },
      { id: 'python', title: 'Python Developer' },
    ],
  },
];

// ─────────────────────────────
// Component
// ─────────────────────────────
const AdminNavigationPage = () => {
  const rowsPerPage = 5;

  // ─────────────────────────
  // NAVIGATION CATEGORIES STATE
  // ─────────────────────────
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategories[0]?.id || null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryDialogMode, setCategoryDialogMode] = useState('create');
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    label: '',
    description: '',
  });
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [subDialogMode, setSubDialogMode] = useState('create');
  const [subForm, setSubForm] = useState({ id: '', name: '', description: '' });
  const [subToDelete, setSubToDelete] = useState(null);

  const [page, setPage] = useState(1);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  );

  const pagedSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const start = (page - 1) * rowsPerPage;
    return selectedCategory.subcategories.slice(start, start + rowsPerPage);
  }, [selectedCategory, page, rowsPerPage]);

  useEffect(() => {
    if (!selectedCategory) return;
    const maxPage = Math.max(1, Math.ceil(selectedCategory.subcategories.length / rowsPerPage));
    setPage((prev) => Math.min(prev, maxPage));
  }, [selectedCategory, rowsPerPage]);

  const resetPagination = () => setPage(1);

  const openCategoryDialog = (mode = 'create', category = null) => {
    setCategoryDialogMode(mode);
    setCategoryDialogOpen(true);
    if (category) {
      setCategoryForm({
        id: category.id,
        name: category.name || '',
        label: category.label || '',
        description: category.description || '',
      });
    } else {
      setCategoryForm({ id: '', name: '', label: '', description: '' });
    }
  };

  const closeCategoryDialog = () => setCategoryDialogOpen(false);

  const handleCategorySave = () => {
    if (!categoryForm.name.trim()) return;

    const normalizedLabel = categoryForm.label.trim() || categoryForm.name.trim();

    if (categoryDialogMode === 'edit' && categoryForm.id) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryForm.id
            ? { ...cat, ...categoryForm, label: normalizedLabel }
            : cat
        )
      );
    } else {
      const newCategory = {
        id:
          categoryForm.name.trim().toLowerCase().replace(/\s+/g, '-') ||
          `category-${Date.now()}`,
        name: categoryForm.name.trim(),
        label: normalizedLabel,
        description: categoryForm.description || '',
        createdOn: new Date().toISOString().split('T')[0],
        subcategories: [],
      };
      setCategories((prev) => [newCategory, ...prev]);
      setSelectedCategoryId(newCategory.id);
      resetPagination();
    }

    closeCategoryDialog();
  };

  const handleCategoryDelete = () => {
    if (!categoryToDelete) return;
    setCategories((prev) => {
      const updated = prev.filter((cat) => cat.id !== categoryToDelete.id);
      if (selectedCategoryId === categoryToDelete.id) {
        setSelectedCategoryId(updated[0]?.id || null);
        resetPagination();
      }
      return updated;
    });
    setCategoryToDelete(null);
  };

  const openSubDialog = (mode = 'create', subcategory = null) => {
    if (!selectedCategory) return;
    setSubDialogMode(mode);
    setSubDialogOpen(true);
    if (subcategory) {
      setSubForm({ ...subcategory });
    } else {
      setSubForm({ id: '', name: '', description: '' });
    }
  };

  const closeSubDialog = () => setSubDialogOpen(false);

  const handleSubSave = () => {
    if (!subForm.name.trim() || !selectedCategory) return;

    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== selectedCategory.id) return category;

        if (subDialogMode === 'edit' && subForm.id) {
          return {
            ...category,
            subcategories: category.subcategories.map((sub) =>
              sub.id === subForm.id ? { ...subForm } : sub
            ),
          };
        }

        const newSub = {
          ...subForm,
          id:
            subForm.name.trim().toLowerCase().replace(/\s+/g, '-') ||
            `sub-${Date.now()}`,
        };
        return { ...category, subcategories: [newSub, ...category.subcategories] };
      })
    );

    closeSubDialog();
  };

  const handleSubDelete = () => {
    if (!subToDelete || !selectedCategory) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              subcategories: category.subcategories.filter(
                (sub) => sub.id !== subToDelete.id
              ),
            }
          : category
      )
    );

    setSubToDelete(null);
  };

  // ─────────────────────────
  // HIRE DEVELOPERS STATE
  // ─────────────────────────
  const [hireCategories, setHireCategories] = useState(initialHireCategories);
  const [hireCategoryPage, setHireCategoryPage] = useState(1);

  const [hireCategoryDialogOpen, setHireCategoryDialogOpen] = useState(false);
  const [editingHireCategoryId, setEditingHireCategoryId] = useState(null);
  const [hireCategoryForm, setHireCategoryForm] = useState({
    title: '',
    description: '',
  });
  const [hireCategoryError, setHireCategoryError] = useState('');

  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [activeHireCategoryId, setActiveHireCategoryId] = useState(null);
  const activeHireCategory = useMemo(
    () => hireCategories.find((cat) => cat.id === activeHireCategoryId) || null,
    [hireCategories, activeHireCategoryId]
  );

  const [hireSubcategoryForm, setHireSubcategoryForm] = useState({ title: '' });
  const [editingHireSubcategoryId, setEditingHireSubcategoryId] = useState(null);
  const [hireSubcategoryError, setHireSubcategoryError] = useState('');

  // Hire category delete dialog state
  const [hireCategoryToDelete, setHireCategoryToDelete] = useState(null);
  // NEW: hire sub-category delete dialog state
  const [hireSubcategoryToDelete, setHireSubcategoryToDelete] = useState(null);

  const paginatedHireCategories = useMemo(() => {
    const start = (hireCategoryPage - 1) * rowsPerPage;
    return hireCategories.slice(start, start + rowsPerPage);
  }, [hireCategories, hireCategoryPage, rowsPerPage]);

  const openHireCategoryDialog = (category = null) => {
    if (category) {
      setEditingHireCategoryId(category.id);
      setHireCategoryForm({
        title: category.title || '',
        description: category.description || '',
      });
    } else {
      setEditingHireCategoryId(null);
      setHireCategoryForm({ title: '', description: '' });
    }
    setHireCategoryError('');
    setHireCategoryDialogOpen(true);
  };

  const closeHireCategoryDialog = () => {
    setHireCategoryDialogOpen(false);
    setHireCategoryError('');
  };

  const handleSaveHireCategory = () => {
    if (!hireCategoryForm.title.trim()) {
      setHireCategoryError('Category title is required.');
      return;
    }

    if (editingHireCategoryId) {
      setHireCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingHireCategoryId
            ? {
                ...cat,
                title: hireCategoryForm.title.trim(),
                description: hireCategoryForm.description || '',
              }
            : cat
        )
      );
    } else {
      const newCategory = {
        id:
          hireCategoryForm.title.trim().toLowerCase().replace(/\s+/g, '-') ||
          `hire-${Date.now()}`,
        title: hireCategoryForm.title.trim(),
        description: hireCategoryForm.description || '',
        subcategories: [],
      };
      setHireCategories((prev) => [newCategory, ...prev]);
      setHireCategoryPage(1);
    }

    closeHireCategoryDialog();
  };

  const handleConfirmDeleteHireCategory = () => {
    if (!hireCategoryToDelete) return;

    setHireCategories((prev) => {
      const updated = prev.filter((cat) => cat.id !== hireCategoryToDelete.id);

      // adjust page if needed
      const maxPage = Math.max(1, Math.ceil(updated.length / rowsPerPage));
      if (hireCategoryPage > maxPage) {
        setHireCategoryPage(maxPage);
      }

      return updated;
    });

    if (activeHireCategoryId === hireCategoryToDelete.id) {
      setActiveHireCategoryId(null);
    }

    setHireCategoryToDelete(null);
  };

  const openSubcategoryDialog = (category) => {
    setActiveHireCategoryId(category.id);
    setEditingHireSubcategoryId(null);
    setHireSubcategoryForm({ title: '' });
    setHireSubcategoryError('');
    setSubcategoryDialogOpen(true);
  };

  const closeSubcategoryDialog = () => {
    setSubcategoryDialogOpen(false);
    setHireSubcategoryError('');
    setEditingHireSubcategoryId(null);
  };

  const handleSaveHireSubcategory = () => {
    if (!hireSubcategoryForm.title.trim()) {
      setHireSubcategoryError('Sub-category title is required.');
      return;
    }
    if (!activeHireCategory) return;

    setHireCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== activeHireCategory.id) return cat;

        if (editingHireSubcategoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map((sub) =>
              sub.id === editingHireSubcategoryId
                ? { ...sub, title: hireSubcategoryForm.title.trim() }
                : sub
            ),
          };
        }

        const newSubcategory = {
          id:
            hireSubcategoryForm.title
              .trim()
              .toLowerCase()
              .replace(/\s+/g, '-') || `hire-sub-${Date.now()}`,
          title: hireSubcategoryForm.title.trim(),
        };

        return {
          ...cat,
          subcategories: [newSubcategory, ...cat.subcategories],
        };
      })
    );

    setHireSubcategoryForm({ title: '' });
    setEditingHireSubcategoryId(null);
    setHireSubcategoryError('');
  };

  const handleEditHireSubcategory = (subcategory) => {
    setEditingHireSubcategoryId(subcategory.id);
    setHireSubcategoryForm({ title: subcategory.title || '' });
    setHireSubcategoryError('');
  };

  const handleDeleteHireSubcategory = (id) => {
    if (!activeHireCategory) return;

    setHireCategories((prev) =>
      prev.map((cat) =>
        cat.id === activeHireCategory.id
          ? {
              ...cat,
              subcategories: cat.subcategories.filter((sub) => sub.id !== id),
            }
          : cat
      )
    );
  };

  // ─────────────────────────
  // RENDER
  // ─────────────────────────
  return (
    <>
      {/* NAVIGATION CATEGORY + SUBCATEGORY MASTER */}
      <Grid container spacing={3}>
        {/* Left: categories */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 0.5,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardHeader
              title="Categories"
              subheader="Manage navigation categories"
              action={
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  variant="contained"
                  onClick={() => openCategoryDialog('create')}
                >
                  Add category
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List disablePadding>
                {categories.map((category) => {
                  const isSelected = category.id === selectedCategoryId;
                  return (
                    <ListItem key={category.id} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          resetPagination();
                        }}
                        sx={{ borderRadius: 1 }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <CategoryOutlinedIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="subtitle1" fontWeight={700}>
                                {category.name}
                              </Typography>
                              {category.label && (
                                <Chip
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  label={`Label: ${category.label}`}
                                />
                              )}
                              <Chip
                                size="small"
                                label={`${category.subcategories.length} sub-categories`}
                              />
                            </Stack>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {category.description}
                            </Typography>
                          }
                        />
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit category">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => openCategoryDialog('edit', category)}
                            >
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
                      </ListItemButton>
                    </ListItem>
                  );
                })}
                {categories.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    py={2}
                  >
                    No categories yet. Add your first one to get started.
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: subcategories for selected category */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 0.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardHeader
              title={selectedCategory ? selectedCategory.name : 'Select a category'}
              subheader={
                selectedCategory
                  ? 'Manage sub-categories that appear under the selected navigation section.'
                  : 'Choose a category to view and manage its sub-categories.'
              }
              action={
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  variant="outlined"
                  onClick={() => openSubDialog('create')}
                  disabled={!selectedCategory}
                >
                  Add sub-category
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {selectedCategory ? (
                <Stack spacing={2}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Category description
                    </Typography>
                    <Typography variant="body1">
                      {selectedCategory.description}
                    </Typography>
                    {selectedCategory.label && (
                      <Typography
                        variant="caption"
                        color="primary.main"
                        fontWeight={700}
                      >
                        Navigation label: {selectedCategory.label}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Created on {selectedCategory.createdOn}
                    </Typography>
                  </Stack>

                  <Divider />

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sub-category</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell width={120} align="right">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pagedSubcategories.map((subcategory) => (
                          <TableRow key={subcategory.id} hover>
                            <TableCell>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <SubdirectoryArrowRightRoundedIcon fontSize="small" />
                                <Typography variant="subtitle2" fontWeight={700}>
                                  {subcategory.name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                              >
                                {subcategory.description || 'No description'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="flex-end"
                              >
                                <Tooltip title="Edit sub-category">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      openSubDialog('edit', subcategory)
                                    }
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete sub-category">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setSubToDelete(subcategory)}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                        {selectedCategory.subcategories.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                              >
                                No sub-categories yet. Use "Add sub-category" to create
                                one.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Stack alignItems="flex-end">
                    <Pagination
                      count={Math.max(
                        1,
                        Math.ceil(
                          selectedCategory.subcategories.length / rowsPerPage
                        )
                      )}
                      page={page}
                      onChange={(event, value) => setPage(value)}
                      color="primary"
                    />
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select a category from the list to manage its entries.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ────────────────────────────── */}
      {/* HIRE DEVELOPERS MASTER TABLE  */}
      {/* ────────────────────────────── */}
      <Stack spacing={3} mt={3}>
        <Card
          sx={{
            borderRadius: 0.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardHeader
            title="Hire developers"
            subheader="Manage category and sub-category master data for hire developer cards."
            action={
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => openHireCategoryDialog()}
              >
                Add category
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Keep hire developer content organised and avoid duplicates by maintaining a
              clear category → sub-category structure.
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Sub-categories</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedHireCategories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{category.title}</TableCell>
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {category.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 360 }}>
                      {category.subcategories.length ? (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {category.subcategories.map((subcategory) => (
                            <Chip
                              key={subcategory.id}
                              label={subcategory.title}
                              size="small"
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          No sub-categories yet
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Manage sub-categories">
                          <IconButton
                            size="small"
                            onClick={() => openSubcategoryDialog(category)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => openHireCategoryDialog(category)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => setHireCategoryToDelete(category)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!hireCategories.length && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        No hire categories configured yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(hireCategories.length / rowsPerPage))}
                page={hireCategoryPage}
                onChange={(event, page) => setHireCategoryPage(page)}
                color="primary"
                size="small"
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* ────────────────────────────── */}
      {/* DIALOGS - NAVIGATION CATEGORIES */}
      {/* ────────────────────────────── */}
      <Dialog
        open={categoryDialogOpen}
        onClose={closeCategoryDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {categoryDialogMode === 'edit' ? 'Edit category' : 'Add category'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Category name"
              value={categoryForm.name}
              onChange={(event) =>
                setCategoryForm((prev) => ({ ...prev, name: event.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Navigation label"
              helperText="Short label shown in the main navigation"
              value={categoryForm.label}
              onChange={(event) =>
                setCategoryForm((prev) => ({ ...prev, label: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={categoryForm.description}
              onChange={(event) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCategoryDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleCategorySave} variant="contained">
            {categoryDialogMode === 'edit' ? 'Save changes' : 'Create category'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete category</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{categoryToDelete?.name}"? This will remove
            all of its sub-categories.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleCategoryDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={subDialogOpen}
        onClose={closeSubDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {subDialogMode === 'edit' ? 'Edit sub-category' : 'Add sub-category'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Sub-category name"
              value={subForm.name}
              onChange={(event) =>
                setSubForm((prev) => ({ ...prev, name: event.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={subForm.description}
              onChange={(event) =>
                setSubForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSubDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubSave} variant="contained">
            {subDialogMode === 'edit' ? 'Save changes' : 'Create sub-category'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(subToDelete)}
        onClose={() => setSubToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete sub-category</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Delete "{subToDelete?.name}" from {selectedCategory?.name}? This cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ────────────────────────────── */}
      {/* DIALOGS - HIRE DEVELOPERS      */}
      {/* ────────────────────────────── */}
      {/* Hire category dialog */}
      <Dialog
        open={hireCategoryDialogOpen}
        onClose={closeHireCategoryDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingHireCategoryId ? 'Edit hire category' : 'Add hire category'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Category title"
              required
              value={hireCategoryForm.title}
              onChange={(event) =>
                setHireCategoryForm((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              error={Boolean(hireCategoryError)}
              helperText={
                hireCategoryError ||
                'Create master categories for hire developer options.'
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={hireCategoryForm.description}
              onChange={(event) =>
                setHireCategoryForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              placeholder="Optional description for the category"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHireCategoryDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveHireCategory} variant="contained">
            {editingHireCategoryId ? 'Update category' : 'Add category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hire sub-category dialog */}
      <Dialog
        open={subcategoryDialogOpen}
        onClose={closeSubcategoryDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Manage sub-categories
          {activeHireCategory ? ` for "${activeHireCategory.title}"` : ''}
        </DialogTitle>
        <DialogContent dividers>
          {activeHireCategory ? (
            <Stack spacing={2} mt={1}>
              <TextField
                label="Sub-category title"
                required
                value={hireSubcategoryForm.title}
                onChange={(event) =>
                  setHireSubcategoryForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                error={Boolean(hireSubcategoryError)}
                helperText={
                  hireSubcategoryError ||
                  'Add the individual specialisations offered under this category.'
                }
                fullWidth
              />

              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={handleSaveHireSubcategory}>
                  {editingHireSubcategoryId
                    ? 'Update sub-category'
                    : 'Add sub-category'}
                </Button>
              </Stack>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeHireCategory.subcategories.map((subcategory) => (
                    <TableRow key={subcategory.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {subcategory.title}
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleEditHireSubcategory(subcategory)
                              }
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() =>
                                setHireSubcategoryToDelete(subcategory)
                              }
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!activeHireCategory.subcategories.length && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                        >
                          No sub-categories yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Select a hire category to manage its sub-categories.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSubcategoryDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Hire category delete dialog */}
      <Dialog
        open={Boolean(hireCategoryToDelete)}
        onClose={() => setHireCategoryToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete hire category</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "
            {hireCategoryToDelete?.title}"? This will remove all of its hire
            sub-categories from the master list.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHireCategoryToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteHireCategory}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* NEW: Hire sub-category delete dialog */}
      <Dialog
        open={Boolean(hireSubcategoryToDelete)}
        onClose={() => setHireSubcategoryToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete hire sub-category</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Delete "{hireSubcategoryToDelete?.title}" from "
            {activeHireCategory?.title}"? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHireSubcategoryToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (hireSubcategoryToDelete) {
                handleDeleteHireSubcategory(hireSubcategoryToDelete.id);
              }
              setHireSubcategoryToDelete(null);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminNavigationPage;

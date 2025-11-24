import { useEffect, useMemo, useState } from 'react';
import {
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
  Avatar,
  Chip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SubdirectoryArrowRightRoundedIcon from '@mui/icons-material/SubdirectoryArrowRightRounded';

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
      { id: 'cms', name: 'CMS', description: 'Headless CMS and site replatforming.' }
    ]
  },
  {
    id: 'mobile',
    label: 'Mobile',
    name: 'Mobile Apps',
    description: 'Native and cross-platform mobile products.',
    createdOn: '2024-07-05',
    subcategories: [
      { id: 'ios', name: 'iOS', description: 'Swift / SwiftUI product delivery.' },
      { id: 'android', name: 'Android', description: 'Compose-first Android squads.' }
    ]
  },
  {
    id: 'data',
    label: 'Data',
    name: 'Data & AI',
    description: 'Analytics platforms, AI copilots, and automation.',
    createdOn: '2024-07-08',
    subcategories: [
      { id: 'analytics', name: 'Analytics', description: 'Dashboards, pipelines, and observability.' },
      { id: 'automation', name: 'Automation', description: 'Workflow orchestration and RPA.' }
    ]
  }
];

const AdminNavigationPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategories[0]?.id || null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryDialogMode, setCategoryDialogMode] = useState('create');
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', label: '', description: '' });
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [subDialogMode, setSubDialogMode] = useState('create');
  const [subForm, setSubForm] = useState({ id: '', name: '', description: '' });
  const [subToDelete, setSubToDelete] = useState(null);

  const rowsPerPage = 5;
  const [page, setPage] = useState(1);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  );

  const pagedSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const start = (page - 1) * rowsPerPage;
    return selectedCategory.subcategories.slice(start, start + rowsPerPage);
  }, [selectedCategory, page]);

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
      setCategoryForm({ ...category });
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
        prev.map((cat) => (cat.id === categoryForm.id ? { ...cat, ...categoryForm, label: normalizedLabel } : cat))
      );
    } else {
      const newCategory = {
        ...categoryForm,
        id: categoryForm.name.trim().toLowerCase().replace(/\s+/g, '-') || `category-${Date.now()}`,
        label: normalizedLabel,
        createdOn: new Date().toISOString().split('T')[0],
        subcategories: []
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
            subcategories: category.subcategories.map((sub) => (sub.id === subForm.id ? { ...subForm } : sub))
          };
        }
        const newSub = {
          ...subForm,
          id: subForm.name.trim().toLowerCase().replace(/\s+/g, '-') || `sub-${Date.now()}`
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
          ? { ...category, subcategories: category.subcategories.filter((sub) => sub.id !== subToDelete.id) }
          : category
      )
    );

    setSubToDelete(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
          <CardHeader
            title="Categories"
            subheader="Manage navigation categories"
            action={
              <Button startIcon={<AddCircleOutlineIcon />} variant="contained" onClick={() => openCategoryDialog('create')}>
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
                            <Chip size="small" label={`${category.subcategories.length} sub-categories`} />
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
                          <IconButton size="small" color="primary" onClick={() => openCategoryDialog('edit', category)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete category">
                          <IconButton size="small" color="error" onClick={() => setCategoryToDelete(category)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </ListItemButton>
                  </ListItem>
                );
              })}
              {categories.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  No categories yet. Add your first one to get started.
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
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
                <Typography variant="body1">{selectedCategory.description}</Typography>
                {selectedCategory.label && (
                  <Typography variant="caption" color="primary.main" fontWeight={700}>
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
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {subcategory.description || 'No description'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit sub-category">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => openSubDialog('edit', subcategory)}
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete sub-category">
                                <IconButton size="small" color="error" onClick={() => setSubToDelete(subcategory)}>
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
                            <Typography variant="body2" color="text.secondary" align="center">
                              No sub-categories yet. Use "Add sub-category" to create one.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Stack alignItems="flex-end">
                  <Pagination
                    count={Math.max(1, Math.ceil(selectedCategory.subcategories.length / rowsPerPage))}
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

      <Dialog open={categoryDialogOpen} onClose={closeCategoryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{categoryDialogMode === 'edit' ? 'Edit category' : 'Add category'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Category name"
              value={categoryForm.name}
              onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Navigation label"
              helperText="Short label shown in the main navigation"
              value={categoryForm.label}
              onChange={(event) => setCategoryForm((prev) => ({ ...prev, label: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={categoryForm.description}
              onChange={(event) => setCategoryForm((prev) => ({ ...prev, description: event.target.value }))}
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

      <Dialog open={Boolean(categoryToDelete)} onClose={() => setCategoryToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete category</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{categoryToDelete?.name}"? This will remove all of its sub-categories.
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

      <Dialog open={subDialogOpen} onClose={closeSubDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{subDialogMode === 'edit' ? 'Edit sub-category' : 'Add sub-category'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Sub-category name"
              value={subForm.name}
              onChange={(event) => setSubForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={subForm.description}
              onChange={(event) => setSubForm((prev) => ({ ...prev, description: event.target.value }))}
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
          <Button onClick={handleSubSave} variant="contained" disabled={!selectedCategory}>
            {subDialogMode === 'edit' ? 'Save changes' : 'Create sub-category'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(subToDelete)} onClose={() => setSubToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete sub-category</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Delete "{subToDelete?.name}" from {selectedCategory?.name}? This cannot be undone.
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
    </Grid>
  );
};

export default AdminNavigationPage;

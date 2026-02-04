import { useEffect, useMemo, useState } from 'react';
import { Avatar, Card, CardContent, CardHeader, Chip, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { AppButton, AppCheckbox, AppDialog, AppDialogActions, AppDialogContent, AppDialogTitle, AppTextField } from '../shared/FormControls.jsx';


import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SubdirectoryArrowRightRoundedIcon from '@mui/icons-material/SubdirectoryArrowRightRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { apiUrl } from '../../utils/const.js';

const slugify = (value = '') =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatDate = (value) =>
  value ? String(value).split('T')[0] : new Date().toISOString().split('T')[0];

const normalizeServiceSubcategory = (sub = {}) => ({
  id: sub.id,
  name: sub.name || '',
  slug: sub.slug || '',
  description: sub.description || '',
  sortOrder: Number.isFinite(Number(sub.sortOrder)) ? Number(sub.sortOrder) : 0,
  isActive: sub.isActive ?? true,
  createdOn: formatDate(sub.createdAt),
});

const normalizeServiceCategory = (category = {}, fallbackSubcategories = []) => ({
  id: category.id,
  name: category.name || '',
  slug: category.slug || '',
  description: category.description || '',
  sortOrder: Number.isFinite(Number(category.sortOrder)) ? Number(category.sortOrder) : 0,
  isActive: category.isActive ?? true,
  createdOn: formatDate(category.createdAt),
  subcategories: Array.isArray(category.subCategories)
    ? category.subCategories.map((sub) => normalizeServiceSubcategory(sub))
    : fallbackSubcategories,
});

const normalizeHireSubcategory = (sub = {}) => ({
  id: sub.id,
  title: sub.title || '',
  slug: sub.slug || '',
  description: sub.description || '',
  sortOrder: Number.isFinite(Number(sub.sortOrder)) ? Number(sub.sortOrder) : 0,
  isActive: sub.isActive ?? true,
  createdOn: formatDate(sub.createdAt),
});

const normalizeHireCategory = (category = {}, fallbackSubcategories = []) => ({
  id: category.id,
  title: category.title || '',
  slug: category.slug || '',
  description: category.description || '',
  sortOrder: Number.isFinite(Number(category.sortOrder)) ? Number(category.sortOrder) : 0,
  isActive: category.isActive ?? true,
  createdOn: formatDate(category.createdAt),
  subcategories: Array.isArray(category.roles)
    ? category.roles.map((role) => normalizeHireSubcategory(role))
    : fallbackSubcategories,
});

const AdminNavigationPage = () => {
  const rowsPerPage = 5;

  // ─────────────────────────
  // NAVIGATION CATEGORIES STATE
  // ─────────────────────────
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryDialogMode, setCategoryDialogMode] = useState('create');
  const [categoryDialogError, setCategoryDialogError] = useState('');
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  });
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);

  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [subDialogMode, setSubDialogMode] = useState('create');
  const [subDialogError, setSubDialogError] = useState('');
  const [subForm, setSubForm] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  });
  const [subToDelete, setSubToDelete] = useState(null);
  const [savingSubcategory, setSavingSubcategory] = useState(false);

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

  const loadCategories = async () => {
    setLoadingCategories(true);
    setCategoriesError('');
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Your session expired. Please log in again.');
      }

      const response = await fetch(apiUrl('/api/admin/service-categories'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to load categories.');
      }

      const normalized = (payload.categories || []).map((category) =>
        normalizeServiceCategory(category, [])
      );
      setCategories(normalized);
      setSelectedCategoryId(normalized[0]?.id || null);
      resetPagination();
    } catch (error) {
      console.error('Load service categories failed', error);
      setCategoriesError(error?.message || 'Unable to load categories right now.');
      setCategories([]);
      setSelectedCategoryId(null);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCategoryDialog = (mode = 'create', category = null) => {
    setCategoryDialogMode(mode);
    setCategoryDialogError('');
    setCategoryDialogOpen(true);
    if (category) {
      setCategoryForm({
        id: category.id,
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        sortOrder: category.sortOrder ?? 0,
        isActive: category.isActive ?? true,
      });
    } else {
      setCategoryForm({
        id: '',
        name: '',
        slug: '',
        description: '',
        sortOrder: 0,
        isActive: true,
      });
    }
  };

  const closeCategoryDialog = () => setCategoryDialogOpen(false);

  const handleCategorySave = async () => {
    setCategoryDialogError('');
    const trimmedName = categoryForm.name.trim();
    const normalizedSlug = slugify(categoryForm.slug || trimmedName);
    const description = categoryForm.description.trim();
    const sortOrder = Number.isFinite(Number(categoryForm.sortOrder))
      ? Number(categoryForm.sortOrder)
      : 0;
    const isActive = Boolean(categoryForm.isActive);

    if (!trimmedName) {
      setCategoryDialogError('Name is required.');
      return;
    }

    if (!normalizedSlug) {
      setCategoryDialogError('Slug is required.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setCategoryDialogError('Your session expired. Please log in again.');
      return;
    }

    setSavingCategory(true);

    try {
      const response = await fetch(
        categoryDialogMode === 'edit'
          ? apiUrl(`/api/admin/service-categories/${categoryForm.id}`)
          : apiUrl('/api/admin/service-categories'),
        {
          method: categoryDialogMode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: trimmedName,
            description: description || null,
            slug: normalizedSlug,
            sortOrder,
            isActive,
          }),
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to save category.');
      }

      const updatedCategory = normalizeServiceCategory(
        payload.category,
        categoryDialogMode === 'edit'
          ? categories.find((cat) => cat.id === categoryForm.id)?.subcategories || []
          : []
      );

      setCategories((prev) =>
        categoryDialogMode === 'edit'
          ? prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
          : [updatedCategory, ...prev]
      );

      if (categoryDialogMode === 'create') {
        setSelectedCategoryId(updatedCategory.id);
        resetPagination();
      }

      closeCategoryDialog();
    } catch (error) {
      console.error('Save service category failed', error);
      setCategoryDialogError(error?.message || 'Unable to save category right now.');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleCategoryDelete = async () => {
    if (!categoryToDelete) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setCategoriesError('Your session expired. Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        apiUrl(`/api/admin/service-categories/${categoryToDelete.id}`),
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to delete category.');
      }

      setCategories((prev) => {
        const updated = prev.filter((cat) => cat.id !== categoryToDelete.id);
        if (selectedCategoryId === categoryToDelete.id) {
          setSelectedCategoryId(updated[0]?.id || null);
          resetPagination();
        }
        return updated;
      });
    } catch (error) {
      console.error('Delete service category failed', error);
      setCategoriesError(error?.message || 'Unable to delete category right now.');
    } finally {
      setCategoryToDelete(null);
    }
  };

  const openSubDialog = (mode = 'create', subcategory = null) => {
    if (!selectedCategory) return;
    setSubDialogMode(mode);
    setSubDialogError('');
    setSubDialogOpen(true);
    if (subcategory) {
      setSubForm({ ...subcategory });
    } else {
      setSubForm({
        id: '',
        name: '',
        slug: '',
        description: '',
        sortOrder: 0,
        isActive: true,
      });
    }
  };

  const closeSubDialog = () => setSubDialogOpen(false);

  const handleSubSave = async () => {
    if (!selectedCategory) return;
    setSubDialogError('');

    const trimmedName = subForm.name.trim();
    const normalizedSlug = slugify(subForm.slug || trimmedName);
    const description = subForm.description.trim();
    const sortOrder = Number.isFinite(Number(subForm.sortOrder)) ? Number(subForm.sortOrder) : 0;
    const isActive = Boolean(subForm.isActive);

    if (!trimmedName) {
      setSubDialogError('Sub-category name is required.');
      return;
    }

    if (!normalizedSlug) {
      setSubDialogError('Slug is required.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setSubDialogError('Your session expired. Please log in again.');
      return;
    }

    setSavingSubcategory(true);

    try {
      const response = await fetch(
        subDialogMode === 'edit'
          ? apiUrl(`/api/admin/service-subcategories/${subForm.id}`)
          : apiUrl('/api/admin/service-subcategories'),
        {
          method: subDialogMode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: trimmedName,
            description: description || null,
            slug: normalizedSlug,
            categoryId: selectedCategory.id,
            sortOrder,
            isActive,
          }),
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to save sub-category.');
      }

      const updatedSub = normalizeServiceSubcategory(payload.subCategory);

      setCategories((prev) =>
        prev.map((category) => {
          if (category.id !== selectedCategory.id) return category;

          if (subDialogMode === 'edit') {
            return {
              ...category,
              subcategories: category.subcategories.map((sub) =>
                sub.id === updatedSub.id ? updatedSub : sub
              ),
            };
          }

          return {
            ...category,
            subcategories: [updatedSub, ...category.subcategories],
          };
        })
      );

      closeSubDialog();
    } catch (error) {
      console.error('Save service subcategory failed', error);
      setSubDialogError(error?.message || 'Unable to save sub-category right now.');
    } finally {
      setSavingSubcategory(false);
    }
  };

  const handleSubDelete = async () => {
    if (!subToDelete || !selectedCategory) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setCategoriesError('Your session expired. Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        apiUrl(`/api/admin/service-subcategories/${subToDelete.id}`),
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to delete sub-category.');
      }

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
    } catch (error) {
      console.error('Delete service subcategory failed', error);
      setCategoriesError(error?.message || 'Unable to delete sub-category right now.');
    } finally {
      setSubToDelete(null);
    }
  };

  // ─────────────────────────
  // HIRE DEVELOPERS STATE
  // ─────────────────────────
  const [hireCategories, setHireCategories] = useState([]);
  const [hireCategoriesError, setHireCategoriesError] = useState('');
  const [loadingHireCategories, setLoadingHireCategories] = useState(false);
  const [hireCategoryPage, setHireCategoryPage] = useState(1);

  const [hireCategoryDialogOpen, setHireCategoryDialogOpen] = useState(false);
  const [editingHireCategoryId, setEditingHireCategoryId] = useState(null);
  const [hireCategoryForm, setHireCategoryForm] = useState({
    title: '',
    slug: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  });
  const [hireCategoryError, setHireCategoryError] = useState('');
  const [savingHireCategory, setSavingHireCategory] = useState(false);

  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [activeHireCategoryId, setActiveHireCategoryId] = useState(null);
  const activeHireCategory = useMemo(
    () => hireCategories.find((cat) => cat.id === activeHireCategoryId) || null,
    [hireCategories, activeHireCategoryId]
  );

  const [hireSubcategoryForm, setHireSubcategoryForm] = useState({
    title: '',
    slug: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  });
  const [editingHireSubcategoryId, setEditingHireSubcategoryId] = useState(null);
  const [hireSubcategoryError, setHireSubcategoryError] = useState('');
  const [savingHireSubcategory, setSavingHireSubcategory] = useState(false);

  // Hire category delete dialog state
  const [hireCategoryToDelete, setHireCategoryToDelete] = useState(null);
  // Hire sub-category delete dialog state
  const [hireSubcategoryToDelete, setHireSubcategoryToDelete] = useState(null);

  const paginatedHireCategories = useMemo(() => {
    const start = (hireCategoryPage - 1) * rowsPerPage;
    return hireCategories.slice(start, start + rowsPerPage);
  }, [hireCategories, hireCategoryPage, rowsPerPage]);

  const loadHireCategories = async () => {
    setLoadingHireCategories(true);
    setHireCategoriesError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Your session expired. Please log in again.');
      }

      const response = await fetch(apiUrl('/api/admin/hire-categories'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to load hire categories.');
      }

      const normalized = (payload.categories || []).map((category) =>
        normalizeHireCategory(category, [])
      );
      setHireCategories(normalized);
      setHireCategoryPage(1);
    } catch (error) {
      console.error('Load hire categories failed', error);
      setHireCategoriesError(error?.message || 'Unable to load hire categories right now.');
      setHireCategories([]);
    } finally {
      setLoadingHireCategories(false);
    }
  };

  useEffect(() => {
    loadHireCategories();
  }, []);

  const openHireCategoryDialog = (category = null) => {
    if (category) {
      setEditingHireCategoryId(category.id);
      setHireCategoryForm({
        title: category.title || '',
        slug: category.slug || '',
        description: category.description || '',
        sortOrder: category.sortOrder ?? 0,
        isActive: category.isActive ?? true,
      });
    } else {
      setEditingHireCategoryId(null);
      setHireCategoryForm({ title: '', slug: '', description: '', sortOrder: 0, isActive: true });
    }
    setHireCategoryError('');
    setHireCategoryDialogOpen(true);
  };

  const closeHireCategoryDialog = () => {
    setHireCategoryDialogOpen(false);
    setHireCategoryError('');
  };

  const handleSaveHireCategory = async () => {
    setHireCategoryError('');
    const trimmedTitle = hireCategoryForm.title.trim();
    const normalizedSlug = slugify(hireCategoryForm.slug || trimmedTitle);
    const description = hireCategoryForm.description.trim();
    const sortOrder = Number.isFinite(Number(hireCategoryForm.sortOrder))
      ? Number(hireCategoryForm.sortOrder)
      : 0;
    const isActive = Boolean(hireCategoryForm.isActive);

    if (!trimmedTitle) {
      setHireCategoryError('Category title is required.');
      return;
    }

    if (!normalizedSlug) {
      setHireCategoryError('Slug is required.');
      return;
    }

    const token = localStorage.getItem('adminToken');

    if (!token) {
      setHireCategoryError('Your session expired. Please log in again.');
      return;
    }

    setSavingHireCategory(true);

    try {
      const response = await fetch(
        editingHireCategoryId
          ? apiUrl(`/api/admin/hire-categories/${editingHireCategoryId}`)
          : apiUrl('/api/admin/hire-categories'),
        {
          method: editingHireCategoryId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: trimmedTitle,
            description: description || null,
            slug: normalizedSlug,
            sortOrder,
            isActive,
          }),
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to save hire category.');
      }

      const updatedCategory = normalizeHireCategory(
        payload.category,
        editingHireCategoryId
          ? hireCategories.find((cat) => cat.id === editingHireCategoryId)?.subcategories || []
          : []
      );

      setHireCategories((prev) =>
        editingHireCategoryId
          ? prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
          : [updatedCategory, ...prev]
      );

      setHireCategoryPage(1);
      closeHireCategoryDialog();
    } catch (error) {
      console.error('Save hire category failed', error);
      setHireCategoryError(error?.message || 'Unable to save hire category right now.');
    } finally {
      setSavingHireCategory(false);
    }
  };

  const handleConfirmDeleteHireCategory = async () => {
    if (!hireCategoryToDelete) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      setHireCategoriesError('Your session expired. Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        apiUrl(`/api/admin/hire-categories/${hireCategoryToDelete.id}`),
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to delete hire category.');
      }

      setHireCategories((prev) => {
        const updated = prev.filter((cat) => cat.id !== hireCategoryToDelete.id);

        const maxPage = Math.max(1, Math.ceil(updated.length / rowsPerPage));
        if (hireCategoryPage > maxPage) {
          setHireCategoryPage(maxPage);
        }

        return updated;
      });

      if (activeHireCategoryId === hireCategoryToDelete.id) {
        setActiveHireCategoryId(null);
      }
    } catch (error) {
      console.error('Delete hire category failed', error);
      setHireCategoriesError(error?.message || 'Unable to delete hire category right now.');
    } finally {
      setHireCategoryToDelete(null);
    }
  };

  const openSubcategoryDialog = (category) => {
    setActiveHireCategoryId(category.id);
    setEditingHireSubcategoryId(null);
    setHireSubcategoryForm({ title: '', slug: '', description: '', sortOrder: 0, isActive: true });
    setHireSubcategoryError('');
    setSubcategoryDialogOpen(true);
  };

  const closeSubcategoryDialog = () => {
    setSubcategoryDialogOpen(false);
    setHireSubcategoryError('');
    setEditingHireSubcategoryId(null);
  };

  const handleSaveHireSubcategory = async () => {
    setHireSubcategoryError('');
    const trimmedTitle = hireSubcategoryForm.title.trim();
    const normalizedSlug = slugify(hireSubcategoryForm.slug || trimmedTitle);
    const description = hireSubcategoryForm.description.trim();
    const sortOrder = Number.isFinite(Number(hireSubcategoryForm.sortOrder))
      ? Number(hireSubcategoryForm.sortOrder)
      : 0;
    const isActive = Boolean(hireSubcategoryForm.isActive);

    if (!trimmedTitle) {
      setHireSubcategoryError('Sub-category title is required.');
      return;
    }
    if (!normalizedSlug) {
      setHireSubcategoryError('Slug is required.');
      return;
    }
    if (!activeHireCategory) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      setHireSubcategoryError('Your session expired. Please log in again.');
      return;
    }

    setSavingHireSubcategory(true);

    try {
      const response = await fetch(
        editingHireSubcategoryId
          ? apiUrl(`/api/admin/hire-roles/${editingHireSubcategoryId}`)
          : apiUrl('/api/admin/hire-roles'),
        {
          method: editingHireSubcategoryId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: trimmedTitle,
            description: description || null,
            slug: normalizedSlug,
            hireCategoryId: activeHireCategory.id,
            sortOrder,
            isActive,
          }),
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to save hire sub-category.');
      }

      const updatedSubcategory = normalizeHireSubcategory(payload.role);

      setHireCategories((prev) =>
        prev.map((cat) => {
          if (cat.id !== activeHireCategory.id) return cat;

          if (editingHireSubcategoryId) {
            return {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === updatedSubcategory.id ? updatedSubcategory : sub
              ),
            };
          }

          return {
            ...cat,
            subcategories: [updatedSubcategory, ...cat.subcategories],
          };
        })
      );

      setHireSubcategoryForm({
        title: '',
        slug: '',
        description: '',
        sortOrder: 0,
        isActive: true,
      });
      setEditingHireSubcategoryId(null);
      setHireSubcategoryError('');
    } catch (error) {
      console.error('Save hire subcategory failed', error);
      setHireSubcategoryError(error?.message || 'Unable to save hire sub-category right now.');
    } finally {
      setSavingHireSubcategory(false);
    }
  };

  const handleEditHireSubcategory = (subcategory) => {
    setEditingHireSubcategoryId(subcategory.id);
    setHireSubcategoryForm({
      title: subcategory.title || '',
      slug: subcategory.slug || '',
      description: subcategory.description || '',
      sortOrder: subcategory.sortOrder ?? 0,
      isActive: subcategory.isActive ?? true,
    });
    setHireSubcategoryError('');
  };

  const handleDeleteHireSubcategory = async (id) => {
    if (!activeHireCategory) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      setHireCategoriesError('Your session expired. Please log in again.');
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/admin/hire-roles/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to delete hire sub-category.');
      }

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
    } catch (error) {
      console.error('Delete hire subcategory failed', error);
      setHireCategoriesError(error?.message || 'Unable to delete hire sub-category right now.');
    }
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
                <AppButton
                  startIcon={<AddCircleOutlineIcon />}
                  variant="contained"
                  onClick={() => openCategoryDialog('create')}
                >
                  Add category
                </AppButton>
              }
            />
            <Divider />
            <CardContent>
              {categoriesError && (
                <Typography color="error" variant="body2" mb={1}>
                  {categoriesError}
                </Typography>
              )}
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
                {!loadingCategories && categories.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    py={2}
                  >
                    No categories yet. Add your first one to get started.
                  </Typography>
                )}
                {loadingCategories && (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    Loading categories...
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
                <AppButton
                  startIcon={<AddCircleOutlineIcon />}
                  variant="outlined"
                  onClick={() => openSubDialog('create')}
                  disabled={!selectedCategory}
                >
                  Add sub-category
                </AppButton>
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
                      count={Math.max(
                        1,
                        Math.ceil(selectedCategory.subcategories.length / rowsPerPage)
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
              <AppButton
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => openHireCategoryDialog()}
              >
                Add category
              </AppButton>
            }
          />
          <Divider />
          <CardContent>
            {hireCategoriesError && (
              <Typography color="error" variant="body2" mb={2}>
                {hireCategoriesError}
              </Typography>
            )}
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
                    <TableCell sx={{ fontWeight: 700 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {category.title}
                        
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {category.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 360 }}>
                      {category.subcategories.length ? (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {category.subcategories.map((subcategory) => (
                            <Chip key={subcategory.id} label={subcategory.title} size="small" />
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No sub-categories yet
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Manage sub-categories">
                          <IconButton size="small" onClick={() => openSubcategoryDialog(category)}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openHireCategoryDialog(category)}>
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
                {!loadingHireCategories && !hireCategories.length && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        No hire categories configured yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {loadingHireCategories && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Loading hire categories...
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
      <AppDialog open={categoryDialogOpen} onClose={closeCategoryDialog} maxWidth="sm" fullWidth>
        <AppDialogTitle>
          {categoryDialogMode === 'edit' ? 'Edit category' : 'Add category'}
        </AppDialogTitle>
        <AppDialogContent dividers>
          <Stack spacing={2} mt={1}>
            <AppTextField
              label="Category name"
              value={categoryForm.name}
              onChange={(event) =>
                setCategoryForm((prev) => ({ ...prev, name: event.target.value }))
              }
              fullWidth
              required
            />
            <AppTextField
              label="Slug"
              helperText="Unique slug used for navigation"
              value={categoryForm.slug}
              onChange={(event) =>
                setCategoryForm((prev) => ({ ...prev, slug: event.target.value }))
              }
              fullWidth
            />
            <AppTextField
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
            <AppTextField
              label="Sort order"
              type="number"
              value={categoryForm.sortOrder}
              onChange={(event) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  sortOrder: event.target.value,
                }))
              }
              fullWidth
              inputProps={{ min: 0 }}
            />
            <FormControlLabel
              control={
                <AppCheckbox
                  checked={Boolean(categoryForm.isActive)}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                />
              }
              label="Active"
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

      <AppDialog
        open={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <AppDialogTitle>Delete category</AppDialogTitle>
        <AppDialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{categoryToDelete?.name}"? This will remove
            all of its sub-categories.
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

      <AppDialog open={subDialogOpen} onClose={closeSubDialog} maxWidth="sm" fullWidth>
        <AppDialogTitle>
          {subDialogMode === 'edit' ? 'Edit sub-category' : 'Add sub-category'}
        </AppDialogTitle>
        <AppDialogContent dividers>
          <Stack spacing={2} mt={1}>
            <AppTextField
              label="Sub-category name"
              value={subForm.name}
              onChange={(event) =>
                setSubForm((prev) => ({ ...prev, name: event.target.value }))
              }
              fullWidth
              required
            />
            <AppTextField
              label="Slug"
              value={subForm.slug}
              onChange={(event) =>
                setSubForm((prev) => ({ ...prev, slug: event.target.value }))
              }
              fullWidth
              helperText="Unique slug for this sub-category"
            />
            <AppTextField
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
            <AppTextField
              label="Sort order"
              type="number"
              value={subForm.sortOrder}
              onChange={(event) =>
                setSubForm((prev) => ({
                  ...prev,
                  sortOrder: event.target.value,
                }))
              }
              fullWidth
              inputProps={{ min: 0 }}
            />
            <FormControlLabel
              control={
                <AppCheckbox
                  checked={Boolean(subForm.isActive)}
                  onChange={(event) =>
                    setSubForm((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                />
              }
              label="Active"
            />
            {subDialogError && (
              <Typography color="error" variant="body2">
                {subDialogError}
              </Typography>
            )}
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeSubDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleSubSave} variant="contained" disabled={savingSubcategory}>
            {subDialogMode === 'edit' ? 'Save changes' : 'Create sub-category'}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      <AppDialog
        open={Boolean(subToDelete)}
        onClose={() => setSubToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <AppDialogTitle>Delete sub-category</AppDialogTitle>
        <AppDialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Delete "{subToDelete?.name}" from {selectedCategory?.name}? This cannot be
            undone.
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={() => setSubToDelete(null)} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleSubDelete} color="error" variant="contained">
            Delete
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* ────────────────────────────── */}
      {/* DIALOGS - HIRE DEVELOPERS      */}
      {/* ────────────────────────────── */}
      {/* Hire category dialog */}
      <AppDialog
        open={hireCategoryDialogOpen}
        onClose={closeHireCategoryDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>
          {editingHireCategoryId ? 'Edit hire category' : 'Add hire category'}
        </AppDialogTitle>
        <AppDialogContent>
          <Stack spacing={2} mt={1}>
            <AppTextField
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
                hireCategoryError || 'Create master categories for hire developer options.'
              }
              fullWidth
            />
            <AppTextField
              label="Slug"
              value={hireCategoryForm.slug}
              onChange={(event) =>
                setHireCategoryForm((prev) => ({ ...prev, slug: event.target.value }))
              }
              fullWidth
              helperText="Unique slug for this hire category"
            />
            <AppTextField
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
            <AppTextField
              label="Sort order"
              type="number"
              value={hireCategoryForm.sortOrder}
              onChange={(event) =>
                setHireCategoryForm((prev) => ({
                  ...prev,
                  sortOrder: event.target.value,
                }))
              }
              fullWidth
              inputProps={{ min: 0 }}
            />
            <FormControlLabel
              control={
                <AppCheckbox
                  checked={Boolean(hireCategoryForm.isActive)}
                  onChange={(event) =>
                    setHireCategoryForm((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeHireCategoryDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleSaveHireCategory} variant="contained" disabled={savingHireCategory}>
            {editingHireCategoryId ? 'Update category' : 'Add category'}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Hire sub-category dialog */}
      <AppDialog
        open={subcategoryDialogOpen}
        onClose={closeSubcategoryDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>
          Manage sub-categories
          {activeHireCategory ? ` for "${activeHireCategory.title}"` : ''}
        </AppDialogTitle>
        <AppDialogContent dividers>
          {activeHireCategory ? (
            <Stack spacing={2} mt={1}>
              <AppTextField
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

              <AppTextField
                label="Slug"
                value={hireSubcategoryForm.slug}
                onChange={(event) =>
                  setHireSubcategoryForm((prev) => ({ ...prev, slug: event.target.value }))
                }
                fullWidth
                helperText="Unique slug for this hire sub-category"
              />

              <AppTextField
                label="Description"
                value={hireSubcategoryForm.description}
                onChange={(event) =>
                  setHireSubcategoryForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                fullWidth
                multiline
                minRows={3}
                placeholder="Optional description"
              />
              <AppTextField
                label="Sort order"
                type="number"
                value={hireSubcategoryForm.sortOrder}
                onChange={(event) =>
                  setHireSubcategoryForm((prev) => ({
                    ...prev,
                    sortOrder: event.target.value,
                  }))
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
              <FormControlLabel
                control={
                  <AppCheckbox
                    checked={Boolean(hireSubcategoryForm.isActive)}
                    onChange={(event) =>
                      setHireSubcategoryForm((prev) => ({
                        ...prev,
                        isActive: event.target.checked,
                      }))
                    }
                  />
                }
                label="Active"
              />

              <Stack direction="row" justifyContent="flex-end">
                <AppButton
                  variant="contained"
                  onClick={handleSaveHireSubcategory}
                  disabled={savingHireSubcategory}
                >
                  {editingHireSubcategoryId ? 'Update sub-category' : 'Add sub-category'}
                </AppButton>
              </Stack>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeHireCategory.subcategories.map((subcategory) => (
                    <TableRow key={subcategory.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{subcategory.title}</TableCell>
                      <TableCell>{subcategory.slug}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {subcategory.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditHireSubcategory(subcategory)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => setHireSubcategoryToDelete(subcategory)}
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
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary" align="center">
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
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeSubcategoryDialog}>Close</AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Hire category delete dialog */}
      <AppDialog
        open={Boolean(hireCategoryToDelete)}
        onClose={() => setHireCategoryToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <AppDialogTitle>Delete hire category</AppDialogTitle>
        <AppDialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "
            {hireCategoryToDelete?.title}"? This will remove all of its hire
            sub-categories from the master list.
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={() => setHireCategoryToDelete(null)} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleConfirmDeleteHireCategory} color="error" variant="contained">
            Delete
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Hire sub-category delete dialog */}
      <AppDialog
        open={Boolean(hireSubcategoryToDelete)}
        onClose={() => setHireSubcategoryToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <AppDialogTitle>Delete hire sub-category</AppDialogTitle>
        <AppDialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Delete "{hireSubcategoryToDelete?.title}" from "
            {activeHireCategory?.title}"? This cannot be undone.
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={() => setHireSubcategoryToDelete(null)} color="inherit">
            Cancel
          </AppButton>
          <AppButton
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
          </AppButton>
        </AppDialogActions>
      </AppDialog>
    </>
  );
};

export default AdminNavigationPage;

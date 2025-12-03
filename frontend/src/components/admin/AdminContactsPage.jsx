import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
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
  Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { apiUrl } from '../../utils/const.js';

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

const defaultFilters = {
  name: '',
  email: '',
  phone: '',
  contactType: 'all',
  status: 'all',
  date: 'all',
  start: '',
  end: '',
};

const normalizeContactFromApi = (contact) => ({
  id: contact.id,
  name: contact.name || '',
  email: contact.email || '',
  phone: contact.phone || '',
  countryCode: contact.countryCode || '',
  projectType: contact.projectType || '',
  contactType: contact.contactType || 'General enquiry',
  description: contact.description || contact.message || '',
  status: contact.status || 'New',
  receivedOn:
    contact.receivedOn || (contact.createdAt ? String(contact.createdAt).split('T')[0] : ''),
  attachments: contact.attachments || [],
});

const AdminContactsPage = () => {
  const [contactList, setContactList] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');
  const [savingContact, setSavingContact] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const projectTypes = useMemo(
    () => ['Web Application', 'Mobile App', 'Product Design', 'Consulting', 'Other'],
    []
  );

  const contactTypes = useMemo(
    () => ['Sales', 'Support', 'Partnership', 'General enquiry'],
    []
  );

  const enquiryStatuses = useMemo(
    () => ['New', 'In progress', 'Replied', 'Closed'],
    []
  );

  const loadContacts = async () => {
    setLoading(true);
    setServerError('');

    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        throw new Error('Your session expired. Please log in again.');
      }

      const response = await fetch(apiUrl('/api/admin/contacts'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to load contacts.');
      }

      setContactList((payload.contacts || []).map(normalizeContactFromApi));
    } catch (error) {
      console.error('Load contacts failed', error);
      setServerError(error?.message || 'Unable to load contacts right now.');
    } finally {
      setLoading(false);
    }
  };

  const rowsPerPage = 5;
  const [filterDraft, setFilterDraft] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);

  const matchesQuery = (value, query) => value.toLowerCase().includes(query.trim().toLowerCase());

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = useMemo(
    () =>
      contactList.filter((contact) => {
        const nameMatch = !appliedFilters.name || matchesQuery(contact.name, appliedFilters.name);
        const emailMatch = !appliedFilters.email || matchesQuery(contact.email, appliedFilters.email);
        const phoneMatch =
          !appliedFilters.phone || matchesQuery(`${contact.countryCode} ${contact.phone}`, appliedFilters.phone);
        const contactTypeMatch =
          appliedFilters.contactType === 'all' || contact.contactType === appliedFilters.contactType;
        const statusMatch = appliedFilters.status === 'all' || contact.status === appliedFilters.status;
        const dateMatch = matchesDateFilter(contact.receivedOn, appliedFilters.date, appliedFilters);
        return nameMatch && emailMatch && phoneMatch && statusMatch && dateMatch && contactTypeMatch;
      }),
    [contactList, appliedFilters]
  );

  const pagedContacts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredContacts.slice(start, start + rowsPerPage);
  }, [filteredContacts, page, rowsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredContacts.length / rowsPerPage));
    setPage((prev) => Math.min(prev, maxPage));
  }, [filteredContacts.length, rowsPerPage]);

  const openEditDialog = (contact) => {
    setEditingContact(contact);
    setEditForm({ ...contact });
    setEditError('');
  };

  const closeEditDialog = () => {
    setEditingContact(null);
    setEditForm(null);
    setEditError('');
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editForm) return;

    const trimmedName = editForm.name.trim();
    const trimmedEmail = editForm.email.trim();
    const trimmedDescription = (editForm.description || '').trim();

    if (!trimmedName || !trimmedEmail || !trimmedDescription) {
      setEditError('Name, email, and description are required.');
      return;
    }

    const token = localStorage.getItem('adminToken');

    if (!token) {
      setEditError('Your session expired. Please log in again.');
      return;
    }

    setSavingContact(true);

    try {
      const response = await fetch(apiUrl(`/api/admin/contacts/${editForm.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: editForm.phone ? editForm.phone.trim() : '',
          countryCode: editForm.countryCode ? editForm.countryCode.trim() : '',
          contactType: editForm.contactType,
          projectType: editForm.projectType,
          description: trimmedDescription,
          status: editForm.status,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to update contact.');
      }

      setContactList((prev) =>
        prev.map((contact) =>
          contact.id === payload.contact.id ? normalizeContactFromApi(payload.contact) : contact
        )
      );
      closeEditDialog();
    } catch (error) {
      console.error('Update contact failed', error);
      setEditError(error?.message || 'Unable to update contact right now.');
    } finally {
      setSavingContact(false);
    }
  };

  const openDeleteDialog = (contact) => {
    setContactToDelete(contact);
    setServerError('');
  };

  const closeDeleteDialog = () => {
    setContactToDelete(null);
    setDeleteLoading(false);
  };

  const openViewDialog = (contact) => {
    setViewingContact(contact);
  };

  const closeViewDialog = () => {
    setViewingContact(null);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      setServerError('Your session expired. Please log in again.');
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch(apiUrl(`/api/admin/contacts/${contactToDelete.id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to delete contact.');
      }

      setContactList((prev) => prev.filter((contact) => contact.id !== contactToDelete.id));
      closeDeleteDialog();
    } catch (error) {
      console.error('Delete contact failed', error);
      setServerError(error?.message || 'Unable to delete contact right now.');
      setDeleteLoading(false);
    }
  };

  const applyFilters = () => {
    setAppliedFilters(filterDraft);
  };

  const clearFilters = () => {
    setFilterDraft(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const removeFilter = (key) => {
    const reset = { ...filterDraft, [key]: defaultFilters[key] };
    // when clearing date, also clear range
    if (key === 'date') {
      reset.start = '';
      reset.end = '';
    }
    setFilterDraft(reset);
    setAppliedFilters(reset);
  };

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (appliedFilters.name) chips.push({ key: 'name', label: `Name: ${appliedFilters.name}` });
    if (appliedFilters.email) chips.push({ key: 'email', label: `Email: ${appliedFilters.email}` });
    if (appliedFilters.phone) chips.push({ key: 'phone', label: `Mobile: ${appliedFilters.phone}` });
    if (appliedFilters.contactType !== 'all')
      chips.push({ key: 'contactType', label: `Type: ${appliedFilters.contactType}` });
    if (appliedFilters.status !== 'all') chips.push({ key: 'status', label: `Status: ${appliedFilters.status}` });
    if (appliedFilters.date !== 'all') {
      const rangeLabel =
        appliedFilters.date === 'custom'
          ? ` (${appliedFilters.start || 'any'} → ${appliedFilters.end || 'any'})`
          : '';
      chips.push({ key: 'date', label: `Date: ${appliedFilters.date}${rangeLabel}` });
    }
    return chips;
  }, [appliedFilters]);

  return (
    <>
      <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">Contact enquiries</Typography>
            <Typography variant="body2" color="text.secondary">
              Review the latest messages sent through the public website contact form. Follow up with the leads to keep the
              pipeline active.
            </Typography>
            {serverError && (
              <Typography variant="body2" color="error.main">
                {serverError}
              </Typography>
            )}
            <Divider sx={{ my: 1 }} />
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'flex-end' }}>
              <TextField
                label="Name"
                value={filterDraft.name}
                onChange={(event) => setFilterDraft((prev) => ({ ...prev, name: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Email"
                value={filterDraft.email}
                onChange={(event) => setFilterDraft((prev) => ({ ...prev, email: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Mobile"
                value={filterDraft.phone}
                onChange={(event) => setFilterDraft((prev) => ({ ...prev, phone: event.target.value }))}
                fullWidth
              />
              <TextField
                select
                label="Contact type"
                value={filterDraft.contactType}
                onChange={(event) => setFilterDraft((prev) => ({ ...prev, contactType: event.target.value }))}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All types</MenuItem>
                {contactTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Status"
                value={filterDraft.status}
                onChange={(event) => setFilterDraft((prev) => ({ ...prev, status: event.target.value }))}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All statuses</MenuItem>
                {enquiryStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'flex-end' }}>
              <TextField
                select
                label="Date filter"
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
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
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
                    <TableCell>Contact</TableCell>
                    <TableCell>Email &amp; Phone</TableCell>
                    <TableCell>Contact Type</TableCell>
                    <TableCell>Project Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Received</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading &&
                    pagedContacts.map((contact) => (
                      <TableRow key={contact.id || contact.email} hover>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar>{contact.name.charAt(0)}</Avatar>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {contact.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              {contact.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {contact.phone
                                ? `${contact.countryCode ? `${contact.countryCode} · ` : ''}${contact.phone}`
                                : '—'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.primary" fontWeight={600} noWrap>
                            {contact.contactType}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.primary" fontWeight={500}>
                            {contact.projectType || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 260 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {contact.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {contact.receivedOn || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={contact.status}
                            color={
                              contact.status === 'New'
                                ? 'primary'
                                : contact.status === 'Replied'
                                  ? 'success'
                                  : contact.status === 'Closed'
                                    ? 'secondary'
                                    : 'warning'
                            }
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="View details">
                              <IconButton
                                size="small"
                                color="inherit"
                                onClick={() => openViewDialog(contact)}
                              >
                                <VisibilityOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small" color="primary" onClick={() => openEditDialog(contact)}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => openDeleteDialog(contact)}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Loading contacts...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && filteredContacts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No enquiries yet. Everything new will show up here.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(filteredContacts.length / rowsPerPage))}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Dialog open={Boolean(editingContact)} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit enquiry</DialogTitle>
        <DialogContent dividers>
          {editForm && (
            <Stack spacing={2} mt={1}>
              {editError && (
                <Typography variant="body2" color="error.main">
                  {editError}
                </Typography>
              )}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Name"
                  fullWidth
                  value={editForm.name}
                  onChange={(event) => handleEditChange('name', event.target.value)}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={editForm.email}
                  onChange={(event) => handleEditChange('email', event.target.value)}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Country"
                  fullWidth
                  value={editForm.countryCode}
                  onChange={(event) => handleEditChange('countryCode', event.target.value.toUpperCase())}
                />
                <TextField
                  label="Mobile number"
                  fullWidth
                  value={editForm.phone}
                  onChange={(event) => handleEditChange('phone', event.target.value)}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  select
                  label="Contact type"
                  value={editForm.contactType}
                  onChange={(event) => handleEditChange('contactType', event.target.value)}
                  fullWidth
                >
                  {contactTypes.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Project type"
                  value={editForm.projectType}
                  onChange={(event) => handleEditChange('projectType', event.target.value)}
                  fullWidth
                >
                  {projectTypes.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <TextField
                label="Description"
                value={editForm.description}
                onChange={(event) => handleEditChange('description', event.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={editForm.status}
                onChange={(event) => handleEditChange('status', event.target.value)}
                fullWidth
              >
                {enquiryStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>

            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" disabled={savingContact}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(contactToDelete)} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete enquiry</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete the enquiry from{' '}
            <Typography component="span" variant="body2" color="text.primary" fontWeight={600}>
              {contactToDelete?.name}
            </Typography>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleteLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(viewingContact)} onClose={closeViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Enquiry details</DialogTitle>
        <DialogContent dividers>
          {viewingContact && (
            <Stack spacing={3} mt={1}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 56, height: 56 }}>{viewingContact.name.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {viewingContact.name}
                  </Typography>
                  <Chip
                    label={viewingContact.status}
                    color={
                      viewingContact.status === 'New'
                        ? 'primary'
                        : viewingContact.status === 'Replied'
                          ? 'success'
                          : viewingContact.status === 'Closed'
                            ? 'secondary'
                            : 'warning'
                    }
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact
                </Typography>
                <Typography variant="body1">{viewingContact.email}</Typography>
                <Typography variant="body1">
                  {viewingContact.phone
                    ? `${viewingContact.countryCode ? `${viewingContact.countryCode} · ` : ''}${viewingContact.phone}`
                    : '—'}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Project type
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {viewingContact.projectType || '—'}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact type
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {viewingContact.contactType || '—'}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {viewingContact.description}
                </Typography>
              </Stack>

              {viewingContact.attachments?.length > 0 && (
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Attachments
                  </Typography>
                  <ImageList cols={3} gap={8} sx={{ m: 0 }}>
                    {viewingContact.attachments.map((item) => (
                      <ImageListItem key={item.src}>
                        <img src={item.src} alt={item.title} loading="lazy" style={{ borderRadius: 8 }} />
                        <Typography variant="caption" display="block" mt={0.5} noWrap>
                          {item.title}
                        </Typography>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminContactsPage;

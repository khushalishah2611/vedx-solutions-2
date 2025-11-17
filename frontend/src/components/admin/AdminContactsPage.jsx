import { useMemo, useState } from 'react';
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

const initialContacts = [
  {
    name: 'Rahul Mehta',
    email: 'rahul@startuphub.in',
    phone: '+91 90210 12345',
    countryCode: 'IN',
    projectType: 'Web Application',
    description: 'Needs a responsive MVP to validate the new SaaS idea. Looking for a fast turnaround.',
    status: 'New',
    attachments: [
      { src: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=320&q=80', title: 'Brand moodboard' },
      { src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=320&q=80', title: 'Wireframe' }
    ]
  },
  {
    name: 'Sneha Iyer',
    email: 'sneha@designcraft.io',
    phone: '+91 99887 66554',
    countryCode: 'IN',
    projectType: 'Product Design',
    description: 'Interested in collaborating on UI/UX audit and brand refresh for premium clients.',
    status: 'In progress',
    attachments: [
      { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=320&q=80', title: 'Case study deck' }
    ]
  },
  {
    name: 'Arjun Rao',
    email: 'arjun@buildwave.co',
    phone: '+91 91234 55667',
    countryCode: 'IN',
    projectType: 'Mobile App',
    description: 'Requested an estimate for logistics tracking app with driver onboarding.',
    status: 'Replied',
    attachments: [
      { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=320&q=80', title: 'Process diagram' },
      { src: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=320&q=80', title: 'App concept' }
    ]
  }
];

const AdminContactsPage = () => {
  const [contactList, setContactList] = useState(initialContacts);
  const [editingContact, setEditingContact] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);

  const projectTypes = useMemo(
    () => ['Web Application', 'Mobile App', 'Product Design', 'Consulting', 'Other'],
    []
  );

  const enquiryStatuses = useMemo(
    () => ['New', 'In progress', 'Replied', 'Closed'],
    []
  );

  const openEditDialog = (contact) => {
    setEditingContact(contact);
    setEditForm({ ...contact });
  };

  const closeEditDialog = () => {
    setEditingContact(null);
    setEditForm(null);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = () => {
    if (!editForm) return;

    setContactList((prev) =>
      prev.map((contact) => (contact.email === editingContact.email ? { ...editForm } : contact))
    );
    closeEditDialog();
  };

  const openDeleteDialog = (contact) => {
    setContactToDelete(contact);
  };

  const closeDeleteDialog = () => {
    setContactToDelete(null);
  };

  const openViewDialog = (contact) => {
    setViewingContact(contact);
  };

  const closeViewDialog = () => {
    setViewingContact(null);
  };

  const handleConfirmDelete = () => {
    if (!contactToDelete) return;
    setContactList((prev) => prev.filter((contact) => contact.email !== contactToDelete.email));
    closeDeleteDialog();
  };

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
            <Divider sx={{ my: 1 }} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Contact</TableCell>
                    <TableCell>Email &amp; Phone</TableCell>
                    <TableCell>Project Type</TableCell>
                    <TableCell>Description</TableCell>

                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contactList.map((contact) => (
                    <TableRow key={contact.email} hover>
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
                            {`${contact.countryCode} · ${contact.phone}`}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.primary" fontWeight={500}>
                          {contact.projectType}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {contact.description}
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
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>
      <Dialog open={Boolean(editingContact)} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit enquiry</DialogTitle>
        <DialogContent dividers>
          {editForm && (
            <Stack spacing={2} mt={1}>
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
          <Button onClick={handleEditSave} variant="contained">
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
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
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
                <Typography variant="body1">{`${viewingContact.countryCode} · ${viewingContact.phone}`}</Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Project type
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {viewingContact.projectType}
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

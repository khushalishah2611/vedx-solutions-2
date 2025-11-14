import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const contacts = [
  {
    name: 'Rahul Mehta',
    email: 'rahul@startuphub.in',
    phone: '+91 90210 12345',
    status: 'New'
  },
  {
    name: 'Sneha Iyer',
    email: 'sneha@designcraft.io',
    phone: '+91 99887 66554',
    status: 'In progress'
  },
  {
    name: 'Arjun Rao',
    email: 'arjun@buildwave.co',
    phone: '+91 91234 55667',
    status: 'Replied'
  }
];

const AdminContactsPage = () => {
  return (
    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
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
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
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
                      <Typography variant="body2" color="text.secondary">
                        {contact.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {contact.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contact.status}
                        color={contact.status === 'New' ? 'primary' : contact.status === 'Replied' ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary">
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
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
  );
};

export default AdminContactsPage;

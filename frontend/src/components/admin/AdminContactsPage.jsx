import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';

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
          <List>
            {contacts.map((contact) => (
              <ListItem key={contact.email} alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar>{contact.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle1" fontWeight={600}>
                        {contact.name}
                      </Typography>
                      <Chip
                        label={contact.status}
                        color={contact.status === 'New' ? 'primary' : contact.status === 'Replied' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={0.5} mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        {contact.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {contact.phone}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminContactsPage;

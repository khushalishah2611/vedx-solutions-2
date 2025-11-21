import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { contactProjectTypes } from '../../data/servicesPage.js';

const ContactDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const handleApplicationSubmit = (event) => {
    event.preventDefault();

    // TODO: add your API call / logic here

    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0.5,
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ px: { xs: 3, sm: 4 }, pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ color: subtleText }}>
              Share your requirements and we&apos;ll get back within one business day.
            </Typography>
          </Stack>
          <IconButton onClick={onClose} aria-label="Close contact dialog">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers>
        <Stack
          spacing={2}
          mt={1}
          component="form"
          id="application-form"
          onSubmit={handleApplicationSubmit}
        >
          <TextField label="Name" required fullWidth />
          <TextField label="Email" type="email" required fullWidth />
          <TextField
            label="Mobile Number"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>🇮🇳</Box>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Project Type"
            fullWidth
            defaultValue={contactProjectTypes[0]}
          >
            {contactProjectTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Description" fullWidth multiline minRows={4} />
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: { xs: 3, sm: 4 }, pb: 3 }}>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Button
            form="application-form"
            type="submit"
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
              color: '#fff',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 5, md: 6 },
              py: { xs: 1.5, md: 1.75 },
              '&:hover': {
                background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)',
              },
            }}
          >
            Submit Now
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ContactDialog;

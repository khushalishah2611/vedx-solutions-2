import { forwardRef } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

const AppTextField = forwardRef(({ variant = 'outlined', size = 'medium', ...props }, ref) => (
  <TextField ref={ref} variant={variant} size={size} {...props} />
));

AppTextField.displayName = 'AppTextField';

const AppSelectField = forwardRef(
  (
    { variant = 'outlined', size = 'medium', displayEmpty, renderValue, SelectProps, ...props },
    ref
  ) => (
    <TextField
      ref={ref}
      select
      variant={variant}
      size={size}
      SelectProps={{ displayEmpty, renderValue, ...SelectProps }}
      {...props}
    />
  )
);

AppSelectField.displayName = 'AppSelectField';

const AppCheckbox = forwardRef((props, ref) => <Checkbox ref={ref} {...props} />);

AppCheckbox.displayName = 'AppCheckbox';

const AppButton = forwardRef(({ variant = 'contained', ...props }, ref) => (
  <Button ref={ref} variant={variant} {...props} />
));

AppButton.displayName = 'AppButton';

const AppDialog = (props) => <Dialog {...props} />;
const AppDialogTitle = (props) => <DialogTitle {...props} />;
const AppDialogContent = (props) => <DialogContent {...props} />;
const AppDialogContentText = (props) => <DialogContentText {...props} />;
const AppDialogActions = (props) => <DialogActions {...props} />;

export {
  AppButton,
  AppCheckbox,
  AppDialog,
  AppDialogActions,
  AppDialogContent,
  AppDialogContentText,
  AppDialogTitle,
  AppSelectField,
  AppTextField,
};

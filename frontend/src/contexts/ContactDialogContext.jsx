import { createContext, useContext } from 'react';

const noop = () => {};

export const ContactDialogContext = createContext({
  openDialog: noop,
  closeDialog: noop,
});

export const useContactDialog = () => useContext(ContactDialogContext);

export default ContactDialogContext;

import { IconButton, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SelectClearAdornment = ({ visible, onClear }) => {
  if (!visible) return null;

  return (
    <InputAdornment position="end" sx={{ mr: 0.5 }}>
      <IconButton
        size="small"
        aria-label="Clear selection"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </InputAdornment>
  );
};

export default SelectClearAdornment;

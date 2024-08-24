import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

interface OptionType {
  id: string;
  name: string;
  price: number;
  barcode: string;
  quantity: number;
  regularPrice: number;
  type: string;
  _id: string;
  _rev: string;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  dataOut: (search: OptionType | null) => void;
  options: OptionType[];
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onClose, dataOut, options }) => {
  const [searchTerm, setSearchTerm] = useState<OptionType | null>(null);

  const handleSearch = () => {
    dataOut(searchTerm);
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen fullWidth>
      <DialogTitle>Search</DialogTitle>
      <DialogContent>
        <Autocomplete
          freeSolo
          options={options}
          getOptionLabel={(option: any) => option.name} // Display name in the input field
          value={searchTerm}
          onChange={(event, newValue: any | null) => setSearchTerm(newValue)}
          renderOption={(props, option: OptionType) => (
            <MenuItem {...props}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Box>
                  <Typography fontSize="12px" variant="body2" mr={1} fontWeight={700}>
                    {option.name}
                  </Typography>
                  <Typography fontSize="12px" sx={{ color: 'gray' }} variant="body2" mr={1}>
                    {option.barcode}
                  </Typography>
                </Box>
                <Typography fontSize="12px" variant="body2" color="textSecondary"></Typography>
              </Box>
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField {...params} autoFocus margin="dense" label="Search" variant="outlined" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSearch} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchDialog;

import React from 'react';
import {
  Box,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  Button,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { formatCurrency } from '@/src/common/helpers';

interface QuantityAdjusterProps {
  open: boolean;
  handleClose: () => void;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  items: any;
}

const QuantityAdjuster: React.FC<QuantityAdjusterProps> = ({
  open,
  quantity,
  onIncrement,
  onDecrement,
  onChange,
  onConfirm,
  onCancel,
  items,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onChange(value);
    }
  };

  return (
    <Dialog open={open} aria-labelledby="quantity-adjuster-dialog" fullWidth>
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography fontWeight={700}>Adjust Quantity</Typography>
        <Typography sx={{ color: 'gray', fontSize: '12px' }}>{items?.name}</Typography>
      </Box>

      <DialogContent sx={{ padding: '20px', height: '200px' }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 2, width: '60%', margin: '0px auto' }}
        >
          <IconButton
            sx={{ background: '#f1cdcd' }}
            onClick={onDecrement}
            aria-label="decrease quantity"
          >
            <RemoveIcon style={{ color: 'red' }} />
          </IconButton>
          <TextField
            value={quantity}
            onChange={handleInputChange}
            type="number"
            inputProps={{ min: 1, style: { textAlign: 'center' } }}
            sx={{ mx: 1 }}
          />
          <IconButton
            sx={{ background: '#c2e6e4' }}
            onClick={onIncrement}
            aria-label="increase quantity"
            disabled={items.quantity <= quantity ? true : false}
          >
            <AddIcon style={{ color: '#0A736C' }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            width: '70%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            border: '1px solid #d9d9d9',
            margin: '10px auto',
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              background: '#cecece',
              borderRadius: 2,
              p: '10px',
              mr: '5px',
              fontSize: '12px',
            }}
          >
            Price
          </Typography>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ p: '10px', fontSize: '12px' }}>
              {formatCurrency(items.price)}
            </Typography>
            <Typography sx={{ p: '10px', color: '#cecece', fontSize: '12px' }}>PHP</Typography>
          </Box>
        </Box>
        <Typography sx={{ color: 'gray', textAlign: 'center' }}>
          {formatCurrency(items.price * quantity)}
        </Typography>
        <Typography
          sx={{
            color: items.quantity <= quantity ? 'error.main' : 'gray',
            textAlign: 'center',
            fontSize: '10px',
          }}
        >
          {items.quantity <= quantity ? 'Out Of Stocks' : `Stocks: ${items.quantity - quantity}`}
        </Typography>
      </DialogContent>

      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: '20px',
          gap: 1,
        }}
      >
        <Button onClick={onCancel} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};

export default QuantityAdjuster;

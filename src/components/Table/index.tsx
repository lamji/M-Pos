import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import 'react-date-range/dist/styles.css'; // Import the styles
import 'react-date-range/dist/theme/default.css'; // Import the theme
import { useSelector, useDispatch } from 'react-redux';
import { getData, setData } from '@/src/common/reducers/data';
import { formatCurrency } from '@/src/common/helpers';
import Swal from 'sweetalert2';

interface Item {
  _id: string;
  id: string;
  name: string;
  price: number;
  barcode: string;
  date: string;
  quantity: number;
  regularPrice: number;
}

const EditableTable: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Item>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [minDate, setMinDate] = useState<string>('');
  const [maxDate, setMaxDate] = useState<string>('');
  const state = useSelector(getData);
  const dispatch = useDispatch();

  const handleSave = async () => {
    if (editItem) {
      const updatedItems = items.map((item) => (item._id === editItem._id ? editItem : item));
      setItems(updatedItems);
      dispatch(setData(updatedItems as any)); // Update Redux store if needed
      setEditItem(null); // Clear edit item
      try {
        const endpoint = '/api/items2';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...editItem, type: 'none' }),
        });

        if (response.ok) {
          Swal.fire({
            title: 'Success!',
            text: 'Item updated successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update item',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: `${JSON.stringify(error)}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Item) => {
    if (editItem) {
      setEditItem({
        ...editItem,
        [field]: field === 'name' ? e.target.value : Number(e.target.value),
      });
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setItems(state);
  }, [state]);

  return (
    <Box sx={{ p: 1, m: 2, width: '100%', maxWidth: '1200px', mx: 'auto', mt: '-120px' }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2, mb: '10px' }}
          InputProps={{
            startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
          }}
          fullWidth
        />
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <TextField
            type="date"
            variant="outlined"
            size="small"
            value={minDate}
            onChange={(e) => setMinDate(e.target.value)}
            sx={{ mr: '2px', width: '48%' }}
          />
          <TextField
            type="date"
            variant="outlined"
            size="small"
            value={maxDate}
            onChange={(e) => setMaxDate(e.target.value)}
            sx={{ mr: '2px', width: '48%' }}
          />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FormControl variant="outlined" size="small" sx={{ mr: '2px', width: '48%' }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as keyof Item)}
              label="Sort By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="quantity">Quantity</MenuItem>
              <MenuItem value="regularPrice">Regular Price</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ mr: '2px', width: '48%' }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              label="Order"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {editItem && (
        <Box sx={{ mb: 2, border: '1px solid gray', p: 2, borderRadius: '4px' }}>
          <Typography variant="h6" gutterBottom>
            Edit Item
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            value={editItem.name}
            onChange={(e: any) => handleChange(e, 'name')}
            sx={{ mb: 2, mr: 2 }}
            fullWidth
          />
          <TextField
            type="number"
            label="Price"
            variant="outlined"
            size="small"
            value={editItem.price}
            onChange={(e: any) => handleChange(e, 'price')}
            sx={{ mb: 2, mr: 2 }}
            fullWidth
          />
          <TextField
            type="number"
            label="Quantity"
            variant="outlined"
            size="small"
            value={editItem.quantity}
            onChange={(e: any) => handleChange(e, 'quantity')}
            sx={{ mb: 2, mr: 2 }}
            fullWidth
          />
          <TextField
            type="number"
            label="Regular Price"
            variant="outlined"
            size="small"
            value={editItem.regularPrice}
            onChange={(e: any) => handleChange(e, 'regularPrice')}
            sx={{ mb: 2, mr: 2 }}
            fullWidth
          />
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ ml: 2 }}
              onClick={() => setEditItem(null)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
      <TableContainer
        component={Paper}
        sx={{ p: 3, border: '1px solid gray', width: '100%', height: '400px', overflow: 'auto' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Regular Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Typography sx={{ width: '170px', fontSize: '12px' }}>{item.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ width: '170px', fontSize: '12px' }}>
                    {formatCurrency(item.price)}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Typography sx={{ width: '70px', fontSize: '12px' }}>
                    {item.quantity || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ width: '170px', fontSize: '12px' }}>
                    {formatCurrency(item.regularPrice || 0)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button sx={{ textTransform: 'capitalize' }} onClick={() => setEditItem(item)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EditableTable;

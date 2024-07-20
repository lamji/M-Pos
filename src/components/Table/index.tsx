import React, { useState, ChangeEvent } from 'react';
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
} from '@mui/material';
// import { DateRange, DateRangePicker } from 'react-date-range';
// import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // Import the styles
import 'react-date-range/dist/theme/default.css'; // Import the theme

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

interface EditableTableProps {
  initialItems: Item[];
}

const EditableTable: React.FC<EditableTableProps> = ({ initialItems }) => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editIdx, setEditIdx] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Item>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [minDate, setMinDate] = useState<string>('');
  const [maxDate, setMaxDate] = useState<string>('');

  const handleSave = () => {
    setEditIdx(-1);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: keyof Item,
    index: number
  ) => {
    const { value } = e.target;
    const updatedItems = items.map((item, i) =>
      index === i ? { ...item, [name]: name === 'name' ? value : Number(value) } : item
    );
    setItems(updatedItems);
  };

  const startEditing = (index: number) => {
    setEditIdx(index);
  };

  // Log filtered items

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
      <TableContainer component={Paper} sx={{ p: 3, border: '1px solid gray', width: '100%' }}>
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
            {initialItems.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>
                  <TextField
                    size="small"
                    value={item.name}
                    onChange={(e) => handleChange(e, 'name', index)}
                    fullWidth
                    disabled={editIdx === index ? false : true}
                    sx={{ width: '170px' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={item.price}
                    sx={{ width: '60px' }}
                    onChange={(e) => handleChange(e, 'price', index)}
                    disabled={editIdx === index ? false : true}
                  />
                </TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <TextField
                    sx={{ width: '50px' }}
                    size="small"
                    type="number"
                    value={item.quantity || 0}
                    onChange={(e) => handleChange(e, 'quantity', index)}
                    disabled={editIdx === index ? false : true}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    sx={{ width: '50px' }}
                    size="small"
                    type="number"
                    value={item.regularPrice}
                    onChange={(e) => handleChange(e, 'regularPrice', index)}
                    disabled={editIdx === index ? false : true}
                  />
                </TableCell>
                <TableCell>
                  {editIdx === index ? (
                    <Button sx={{ textTransform: 'capitalize' }} onClick={handleSave}>
                      Save
                    </Button>
                  ) : (
                    <Button
                      sx={{ textTransform: 'capitalize' }}
                      onClick={() => startEditing(index)}
                    >
                      Edit
                    </Button>
                  )}
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

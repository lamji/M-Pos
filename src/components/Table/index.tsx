import React, { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogContent,
} from '@mui/material';
import 'react-date-range/dist/styles.css'; // Import the styles
import 'react-date-range/dist/theme/default.css'; // Import the theme
import { useSelector, useDispatch } from 'react-redux';
import { getData, setData } from '@/src/common/reducers/data';
import { formatCurrency } from '@/src/common/helpers';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Barcode from 'react-barcode';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import debounce from 'lodash/debounce';
import { getItemsByName, updateDocument } from '@/src/common/app/lib/pouchdbServiceItems';
// import { getItemsByName, postItemUpdate } from '@/src/common/api/testApi';

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

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
interface Props {
  handlePagination: (i: number) => void;
  isRefetch: (i: boolean) => void;
}
const EditableTable = ({ handlePagination, isRefetch }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [refetch, setRefetch] = useState(false);
  const [expanded, setExpanded] = React.useState<string | false>('');
  const [items, setItems] = useState<Item[]>([]);
  const [items2, setItems2] = useState<Item[]>([]);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const state = useSelector(getData);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const handleChangePages = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    handlePagination(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleSave = async () => {
    if (editItem) {
      const updatedItems = items.map((item) => (item._id === editItem._id ? editItem : item));

      try {
        await updateDocument(editItem);

        setItems(updatedItems);
        dispatch(setData(updatedItems as any)); // Update Redux store if needed
        setEditItem(null); // Clear edit item
        setRefetch(!refetch);
        isRefetch(!refetch);
        setOpen(false);
        Swal.fire({
          title: 'Success!',
          text: 'Item updated successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
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

  const fetchItems = async (searchTerm: string) => {
    try {
      const response = await getItemsByName(searchTerm);

      if (response) {
        const data = response;
        setItems2(data);
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch items',
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
  };

  const dataItem = searchTerm ? items2 : items;

  // Debounce the fetchItems function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchItems = useCallback(debounce(fetchItems, 500), [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    setSearchTerm(searchTerm);
    debouncedFetchItems(searchTerm);
  };
  // console.log(state);
  useEffect(() => {
    setItems(state);
  }, [state]);

  return (
    <Box sx={{ p: 1, m: 2, width: '100%', maxWidth: '1200px', mx: 'auto', marginTop: '80px' }}>
      <>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Item Look up"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e: any) => handleSearch(e)}
            sx={{ mr: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
            }}
            fullWidth
          />
        </Box>

        <TableContainer component={Paper} sx={{ width: '100%', paddingBottom: '100px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>All Items - {items?.length}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataItem?.map((item: any, idx: number) => {
                const barcode = item.id.replace('-id', '');
                return (
                  <>
                    <Accordion
                      expanded={expanded === `panel${idx}`}
                      onChange={handleChangeAccordion(`panel${idx}`)}
                    >
                      <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                        <Typography>{item.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Barcode value={barcode} />
                        <Typography sx={{ fontSize: '12px' }}>
                          <strong>Product Name: </strong>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: '12px' }}>
                          <strong>Price: </strong>
                          {formatCurrency(item.price)}
                        </Typography>
                        <Typography sx={{ fontSize: '12px' }}>
                          <strong>Stocks: </strong>
                          {item.quantity}
                        </Typography>
                        <Typography sx={{ fontSize: '12px' }}>
                          <strong>Regular Price: </strong>
                          {formatCurrency(item.regularPrice || 0)}
                        </Typography>
                        <Typography sx={{ fontSize: '12px' }}>
                          <strong>Interest: </strong>
                          {formatCurrency(item.price - item.regularPrice)}
                        </Typography>
                        {!editItem && (
                          <>
                            <Button
                              variant="contained"
                              sx={{ textTransform: 'capitalize', p: 0, color: 'white' }}
                              onClick={() => {
                                setOpen(true);
                                setEditItem(item);
                              }}
                            >
                              Edit
                            </Button>
                          </>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </>
                );
              })}
            </TableBody>
          </Table>
          <Box sx={{ py: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack spacing={2}>
              <Typography sx={{ textAlign: 'left' }}>Page: {page}</Typography>
              <Pagination
                count={state?.pagination?.totalPages || 0}
                page={page}
                onChange={handleChangePages}
              />
            </Stack>
          </Box>
        </TableContainer>

        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle> */}
          <DialogContent>
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
                  value={editItem.quantity || ''}
                  onChange={(e: any) => handleChange(e, 'quantity')}
                  sx={{ mb: 2, mr: 2 }}
                  fullWidth
                />
                <TextField
                  type="number"
                  label="Regular Price"
                  variant="outlined"
                  size="small"
                  value={editItem.regularPrice || ''}
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
                    onClick={() => {
                      handleClose();
                      setEditItem(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </>
    </Box>
  );
};

export default EditableTable;

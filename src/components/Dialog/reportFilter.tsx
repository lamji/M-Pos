import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Autocomplete,
  Popper,
  MenuItem,
  Menu,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DefinedRange } from 'react-date-range';
import moment from 'moment';
// import { fetchItems } from '@/src/common/api/testApi';
import { formatCurrency } from '@/src/common/helpers';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';
import { readAllDocuments } from '@/src/common/app/lib/pouchdbServiceItems';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleConfrim: (i: any) => void;
  type?: string;
}

const CustomPopper = (props: any) => {
  return <Popper {...props} sx={{ width: '100%' }} />;
};

const ReportFilter = ({ isOpen, handleClose, handleConfrim }: Props) => {
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>('lowStocks');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isDateEmpty, setIsDateEmpty] = React.useState(false);
  const [allItems, setAllItems] = React.useState<any>([]);
  const [displayedItems, setDisplayedItems] = React.useState([]);
  const [selectedtData, setSlectedData] = React.useState<any[]>([]);
  const [isFullDataLoaded, setIsFullDataLoaded] = React.useState(false);
  const [autocompleteValue, setAutocompleteValue] = React.useState(null);

  const handleAddItem = (event: any, value: any) => {
    if (value) {
      if (value.quantity <= 0) {
        Swal.fire({
          title: 'Error!',
          text: `Item ${value.name} is out of stock`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        setAutocompleteValue(null);

        // Update the selected data with the new item
        setSlectedData((prev: any) => [...prev, value]);

        // // Dispatch an action to add the item to the store
        // dispatch(addItem({ id: value.id, name: value.name, price: value.price, _id: value._id }));
      }
    }
  };
  const handleInputChange = async (event: any, value: any) => {
    if (!isFullDataLoaded && value) {
      setIsFullDataLoaded(true);
      setDisplayedItems(allItems);
    }
  };

  const open = Boolean(anchorEl);
  const [state, setState] = React.useState<any>([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  const fetItems = async () => {
    try {
      // const itemsData = await fetchItems();
      const docs = await readAllDocuments();
      setAllItems(docs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setIsDateEmpty(false);
  };

  const formikLowStock = useFormik({
    initialValues: {
      lowStockDays: '',
    },
    validationSchema: Yup.object().shape({
      lowStockDays: Yup.number().required('Required'),
    }),
    onSubmit: (values) => {
      handleClose();
      handleConfrim(values);
    },
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedFilter(name);
    } else {
      setSelectedFilter(null);
    }
  };

  const handleProceedClick = () => {
    if (selectedFilter === 'lowStocks') {
      formikLowStock.handleSubmit();
    } else if (selectedFilter === 'fastMoving') {
      if (state[0].endDate) {
        handleClose();
        handleConfrim(state[0]);
        setIsDateEmpty(false);
      } else {
        setIsDateEmpty(true);
      }
    } else {
      if (selectedtData.length > 0) {
        handleClose();
        setSlectedData([]);
        handleConfrim(selectedtData);
        setIsDateEmpty(false);
      } else {
        setIsDateEmpty(true);
      }
    }
  };

  React.useEffect(() => {
    fetItems();
  }, []);

  React.useEffect(() => {
    if (allItems) {
      setDisplayedItems(allItems.slice(0, 10));
    }
  }, [allItems]);

  return (
    <Dialog fullWidth maxWidth={'sm'} open={isOpen}>
      <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
        <Box display="flex" alignItems="center">
          <FilterListIcon sx={{ marginRight: 1 }} />
          <Typography fontWeight={700}>Filter</Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>
        {selectedFilter === 'custom' && <></>}

        <Box display="flex" gap={1}>
          <FormControlLabel
            control={
              <Checkbox
                name="lowStocks"
                checked={selectedFilter === 'lowStocks'}
                onChange={handleCheckboxChange}
              />
            }
            label={<Typography sx={{ fontSize: '11px' }}>Low Stocks</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="fastMoving"
                checked={selectedFilter === 'fastMoving'}
                onChange={handleCheckboxChange}
              />
            }
            label={<Typography sx={{ fontSize: '11px' }}>Fast Moving</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="custom"
                checked={selectedFilter === 'custom'}
                onChange={handleCheckboxChange}
              />
            }
            label={<Typography sx={{ fontSize: '11px' }}>Custom</Typography>}
          />
        </Box>
        {selectedFilter === 'custom' && (
          <>
            <Typography fontSize="11px" color="gray">
              Search and click to add the product to groceries list.
            </Typography>
            <Autocomplete
              disablePortal
              size="small"
              id="combo-box-demo"
              options={displayedItems}
              value={autocompleteValue}
              disabled={allItems.length === 0}
              getOptionLabel={(option: any) => option.name}
              sx={{
                width: '100%',
                my: 1,
                '& .MuiAutocomplete-endAdornment': {
                  display: 'none',
                },
                '& .MuiAutocomplete-inputRoot': {
                  padding: '10px !important',
                  borderRadius: '4px',
                  '&:hover': {
                    borderColor: '#888',
                  },
                },
              }}
              onInputChange={handleInputChange}
              onChange={handleAddItem}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Item"
                  size="small"
                  InputLabelProps={{
                    sx: { fontSize: '13px' }, // Adjust label font size here
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <InputAdornment position="end">
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
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
                      <Typography fontSize={'12px'} variant="body2" mr={1} fontWeight={700}>
                        {option.name}
                      </Typography>
                      <Typography
                        fontSize={'12px'}
                        sx={{ color: option.quantity > 0 ? 'green' : 'red' }}
                        variant="body2"
                        mr={1}
                      >
                        Stocks:{option.quantity}
                      </Typography>
                    </Box>
                    <Typography fontSize={'12px'} variant="body2" color="textSecondary">
                      {formatCurrency(option.price)}
                    </Typography>
                  </Box>
                </MenuItem>
              )}
            />
            {isDateEmpty && (
              <Typography fontSize="12px" color="error">
                Please add a product
              </Typography>
            )}
          </>
        )}
        {selectedFilter === 'fastMoving' && (
          <>
            <Typography fontSize="11px" color="gray">
              The generated items is based on the top 20 fast moving items within specific time
            </Typography>
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="outlined"
                sx={{
                  textTransform: 'capitalize',
                  my: '10px',
                  width: '100% !important',
                }}
              >
                Select date range
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                // onClose={handleCloseMenu}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <Box sx={{ width: '100%', p: 2 }}>
                  <DefinedRange onChange={(item) => setState([item.selection])} ranges={state} />
                  <Button
                    onClick={handleCloseMenu}
                    sx={{ color: 'white', width: '100% !important' }}
                    variant="contained"
                  >
                    Confirm
                  </Button>
                </Box>
              </Menu>
            </div>

            <Typography fontSize="12px" fontWeight={700}>
              Date Selected
            </Typography>
            <Box display="flex">
              <Typography fontSize="12px" mr={1}>
                {moment(state[0].startDate).format('LL')} -
              </Typography>
              <Typography fontSize="12px">
                {state[0].endDate ? moment(state[0].endDate).format('LL') : 'No selected'}
              </Typography>
            </Box>
            {isDateEmpty && (
              <Typography fontSize="12px" color="error">
                Please select a date
              </Typography>
            )}
          </>
        )}
        {selectedFilter === 'lowStocks' && (
          <>
            <Typography fontSize="11px" py={1} color="gray" mb={0}>
              Create Grocery list based on low stocks.
            </Typography>
            <Autocomplete
              options={Array.from({ length: 30 }, (_, i) => (i + 1).toString())}
              onChange={(event, value) => {
                formikLowStock.setFieldValue('lowStockDays', value ?? '');
              }}
              PopperComponent={CustomPopper}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Select number of stocks"
                  name="lowStockDays"
                  sx={{ width: '100%', fontSize: '11px' }}
                  InputLabelProps={{
                    sx: { fontSize: '13px' }, // Adjust label font size here
                  }}
                  error={
                    formikLowStock.touched.lowStockDays &&
                    Boolean(formikLowStock.errors.lowStockDays)
                  }
                  helperText={
                    formikLowStock.touched.lowStockDays && formikLowStock.errors.lowStockDays
                  }
                />
              )}
              renderOption={(props, option) => (
                <MenuItem
                  {...props}
                  sx={{ fontSize: '12px', height: '40px' }} // Adjust option font size and height here
                >
                  {option}
                </MenuItem>
              )}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleProceedClick} sx={{ color: 'white' }}>
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportFilter;

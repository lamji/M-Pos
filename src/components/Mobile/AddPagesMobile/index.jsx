import React from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import useViewModel from '../../AddPage/useViewModel';
// import Html5QrcodePlugin from '../../Scanner/index';

const Nav = dynamic(() => import('@/src/components/Nav'));
const BarcodeScannerComponent = dynamic(() => import('../../wt2Scanner'));

const AddItemFormMobile = () => {
  const model = useViewModel();

  alert(model.scannedBarcode);

  return (
    <>
      <Nav />
      <Box sx={model.styles.root}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{
              color: !model.checked ? 'primary.main' : 'gray',
              fontWeight: !model.checked ? 'bold' : 'normal',
            }}
          >
            Add
          </Typography>
          <Switch
            checked={model.checked}
            onChange={model.handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <Typography
            sx={{
              color: model.checked ? 'primary.main' : 'gray',
              fontWeight: model.checked ? 'bold' : 'normal',
            }}
          >
            Update
          </Typography>
        </Box>

        <form onSubmit={model.formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="id"
              label="ID"
              variant="outlined"
              size="small"
              fullWidth
              value={model.formik.values.id}
              error={model.formik.touched.id && Boolean(model.formik.errors.id)}
              helperText={model.formik.touched.id && model.formik.errors.id}
              onChange={model.formik.handleChange}
              disabled
            />
            <TextField
              size="small"
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              value={model.formik.values.name}
              error={model.formik.touched.name && Boolean(model.formik.errors.name)}
              helperText={model.formik.touched.name && model.formik.errors.name}
              onChange={model.formik.handleChange}
            />
            <TextField
              size="small"
              name="price"
              label="Price"
              type="number"
              variant="outlined"
              fullWidth
              value={model.formik.values.price}
              error={model.formik.touched.price && Boolean(model.formik.errors.price)}
              helperText={model.formik.touched.price && model.formik.errors.price}
              onChange={model.formik.handleChange}
            />
            <TextField
              name="barcode"
              size="small"
              label="Barcode"
              variant="outlined"
              fullWidth
              value={model.scannedBarcode}
              error={model.formik.touched.barcode && Boolean(model.formik.errors.barcode)}
              helperText={model.formik.touched.barcode && model.formik.errors.barcode}
              onChange={model.formik.handleChange}
              disabled
            />
            <TextField
              name="quantity"
              label="Quantity"
              size="small"
              type="number"
              variant="outlined"
              fullWidth
              value={model.formik.values.quantity || ''}
              error={model.formik.touched.quantity && Boolean(model.formik.errors.quantity)}
              helperText={model.formik.touched.quantity && model.formik.errors.quantity}
              onChange={model.formik.handleChange}
            />
            <TextField
              name="regularPrice"
              label="Regular Price"
              size="small"
              type="number"
              variant="outlined"
              fullWidth
              value={model.formik.values.regularPrice || ''}
              error={model.formik.touched.regularPrice && Boolean(model.formik.errors.regularPrice)}
              helperText={model.formik.touched.regularPrice && model.formik.errors.regularPrice}
              onChange={model.formik.handleChange}
            />
            {model.checked && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    label="Type"
                    size="small"
                    value={model.formik.values.type}
                    onChange={model.formik.handleChange}
                    error={model.formik.touched.type && Boolean(model.formik.errors.type)}
                    helperText={model.formik.touched.type && model.formik.errors.type}
                  >
                    <MenuItem value="Add">Add</MenuItem>
                    <MenuItem value="Adjustment">Adjustment</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            <Box
              sx={{
                mt: '40px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={(decodedText) => model.handleBarcodeScanUpdate(decodedText)}
              /> */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={model.formik.isSubmitting}
                sx={{ width: '400px', marginTop: '-60px' }}
              >
                {model.formik.isSubmitting ? 'Submitting...' : model.checked ? 'Update' : 'Submit'}
              </Button>

              <BarcodeScannerComponent
                dataOut={(data) => model.handleBarcodeScanUpdate(data)}
                size={50}
              />
            </Box>
            {!model.checked && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography fontSize={'12px'}>No Barcode?</Typography>
                  <Box
                    onClick={() => model.handleGenerateBarcode()}
                    sx={{
                      fontSize: '12px',
                      color: 'blue',
                      textDecoration: 'underline',
                      mx: '2px',
                    }}
                  >
                    Generate here
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </form>
        <ToastContainer />
      </Box>
    </>
  );
};

export default AddItemFormMobile;

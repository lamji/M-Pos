import React, { useState } from 'react';
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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BarcodeScannerComponent from '../../src/components/wt2Scanner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import Nav from '@/src/components/Nav';
import { generateRandomBarcode } from '@/src/common/helpers';
import { parse } from 'cookie';
// import Html5QrcodePlugin from '@/src/components/Scanner';
import { getCookie } from '@/src/common/app/cookie';
import axios from 'axios';

export const getServerSideProps = async (context) => {
  const { req } = context;
  const cookie = req.headers.cookie;

  const cookies = cookie ? parse(cookie) : undefined;
  const isAuthenticated = cookies?.t ? true : false;

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      fullMode: false,
    },
  };
};

// Validation Schema
const validationSchemaChecked = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string().required('Name is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  barcode: Yup.string().required('Barcode is required'),
  quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be at least 0'),
  regularPrice: Yup.number()
    .required('Regular price is required')
    .positive('Regular price must be positive'),
  type: Yup.string().required('Type is required'),
});

// Validation Schema when checked is false
const validationSchemaUnchecked = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string().required('Name is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  barcode: Yup.string().required('Barcode is required'),
  quantity: Yup.number().notRequired(),
  regularPrice: Yup.number().notRequired(),
  type: Yup.string().notRequired(),
});

const AddItemForm = () => {
  const token = getCookie('t');
  const url = '/api/items2'; // Replace with your actual URL
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [checked, setChecked] = useState(false);

  // Initial Values
  const initialValues = {
    id: '',
    name: '',
    price: '',
    barcode: '',
    quantity: checked ? '' : 0,
    regularPrice: checked ? '' : 0,
    type: checked ? '' : 'new',
  };

  const handleGenerateBarcode = () => {
    const generatedCode = generateRandomBarcode(12);
    setScannedBarcode(generatedCode);
    setGeneratedId(`${generatedCode}-id`);
  };

  // Formik hook
  const formik = useFormik({
    initialValues: { ...initialValues, barcode: scannedBarcode, id: generatedId },
    enableReinitialize: true,
    validationSchema: checked ? validationSchemaChecked : validationSchemaUnchecked,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const response = await axios.post(url, values, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: checked ? 'Item updated successfully' : 'Item added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          resetForm();
          setGeneratedId('');
          setScannedBarcode('');
        } else {
          Swal.fire({
            title: 'Error!',
            text: checked ? 'Failed to update item' : 'Failed to add item',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: `${error.response?.data?.message || error.error}`, // Handle error message from response
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleBarcodeScanUpdate = async (decodedText) => {
    setScannedBarcode(decodedText);
    if (!checked) {
      const randomId = `${decodedText}-${Math.floor(Math.random() * 1000)}`;
      setGeneratedId(randomId);
    } else {
      try {
        const response = await axios.get(`/api/items2?barcode=${decodedText}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        if (data.length > 0) {
          const matchedItem = data[0];
          formik.setValues({
            id: matchedItem.id,
            name: matchedItem.name,
            price: matchedItem.price,
            barcode: matchedItem.barcode,
            quantity: matchedItem.quantity,
            regularPrice: matchedItem.regularPrice,
            type: matchedItem.type || '', // Set type if available
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: `No item found with the scanned barcode ${decodedText}`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch item details',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return (
    <>
      <Nav />

      <Box
        sx={{
          maxWidth: 600,
          margin: 'auto',
          padding: 3,
          borderRadius: 10,
          marginTop: '-130px',
          background: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{
              color: !checked ? 'primary.main' : 'gray',
              fontWeight: !checked ? 'bold' : 'normal',
            }}
          >
            Add
          </Typography>
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <Typography
            sx={{
              color: checked ? 'primary.main' : 'gray',
              fontWeight: checked ? 'bold' : 'normal',
            }}
          >
            Update
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="id"
              label="ID"
              variant="outlined"
              size="small"
              fullWidth
              value={formik.values.id}
              error={formik.touched.id && Boolean(formik.errors.id)}
              helperText={formik.touched.id && formik.errors.id}
              onChange={formik.handleChange}
              disabled
            />
            <TextField
              size="small"
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              value={formik.values.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
            />
            <TextField
              size="small"
              name="price"
              label="Price"
              type="number"
              variant="outlined"
              fullWidth
              value={formik.values.price}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              onChange={formik.handleChange}
            />
            <TextField
              name="barcode"
              size="small"
              label="Barcode"
              variant="outlined"
              fullWidth
              value={scannedBarcode}
              error={formik.touched.barcode && Boolean(formik.errors.barcode)}
              helperText={formik.touched.barcode && formik.errors.barcode}
              onChange={formik.handleChange}
              disabled
            />
            <TextField
              name="quantity"
              label="Quantity"
              size="small"
              type="number"
              variant="outlined"
              fullWidth
              value={formik.values.quantity || ''}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
              onChange={formik.handleChange}
            />
            <TextField
              name="regularPrice"
              label="Regular Price"
              size="small"
              type="number"
              variant="outlined"
              fullWidth
              value={formik.values.regularPrice || ''}
              error={formik.touched.regularPrice && Boolean(formik.errors.regularPrice)}
              helperText={formik.touched.regularPrice && formik.errors.regularPrice}
              onChange={formik.handleChange}
            />
            {checked && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    label="Type"
                    size="small"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    helperText={formik.touched.type && formik.errors.type}
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
                // marginBottom: '200px',
              }}
            >
              {/* <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={(decodedText) => handleBarcodeScanUpdate(decodedText)}
              /> */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                sx={{ width: '400px', marginTop: '-60px' }}
              >
                {formik.isSubmitting ? 'Submitting...' : checked ? 'Update' : 'Submit'}
              </Button>

              <BarcodeScannerComponent
                dataOut={(data) => handleBarcodeScanUpdate(data)}
                size={50}
              />
            </Box>
            {!checked && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography fontSize={'12px'}>No Barcode?</Typography>
                  <Box
                    onClick={() => handleGenerateBarcode()}
                    sx={{ fontSize: '12px', color: 'blue', textDecoration: 'underline', mx: '2px' }}
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

export default AddItemForm;

// components/AddItemForm.js

import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Switch } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import BarcodeScannerComponent from '../../src/components/wt2Scanner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import Nav from '@/src/components/Nav';

// Validation Schema
const validationSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string().required('Name is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  barcode: Yup.string().required('Barcode is required'),
});

// Initial Values
const initialValues = {
  id: '',
  name: '',
  price: '',
  barcode: '',
};

const AddItemForm = () => {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  // Form Submit Handler
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const response = await fetch('/api/items2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Item added successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        resetForm();
        setGeneratedId('');
        setScannedBarcode('');
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add item',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while adding the item',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Barcode Scanning Handlers
  const handleBarcodeScan = (decodedText) => {
    setScannedBarcode(decodedText);
    const randomId = `${decodedText}-${Math.floor(Math.random() * 1000)}`;
    setGeneratedId(randomId);
  };

  return (
    <>
      <Nav></Nav>
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

        {checked ? (
          <>for update</>
        ) : (
          <>
            <Formik
              initialValues={{ ...initialValues, barcode: scannedBarcode, id: generatedId }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched, setFieldValue }) => (
                <Form>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Field
                      name="id"
                      as={TextField}
                      label="ID"
                      variant="outlined"
                      fullWidth
                      value={generatedId}
                      error={touched.id && Boolean(errors.id)}
                      helperText={touched.id && errors.id}
                      disabled
                    />
                    <Field
                      name="name"
                      as={TextField}
                      label="Name"
                      variant="outlined"
                      fullWidth
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                    <Field
                      name="price"
                      as={TextField}
                      label="Price"
                      type="number"
                      variant="outlined"
                      fullWidth
                      error={touched.price && Boolean(errors.price)}
                      helperText={touched.price && errors.price}
                    />
                    <Field
                      name="barcode"
                      as={TextField}
                      label="Barcode"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={scannedBarcode}
                      error={touched.barcode && Boolean(errors.barcode)}
                      helperText={touched.barcode && errors.barcode}
                      onChange={(event) => setFieldValue('barcode', event.target.value)}
                    />
                    <Box sx={{ mt: '40px' }}>
                      <BarcodeScannerComponent
                        dataOut={(data) => handleBarcodeScan(data)}
                        size={100}
                      />
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </>
        )}

        <ToastContainer />
      </Box>
    </>
  );
};

export default AddItemForm;

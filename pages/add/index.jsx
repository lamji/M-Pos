// components/AddItemForm.js

import React, { useState } from 'react';
import { Button, TextField, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Html5QrcodePlugin from '../../src/components/Scanner';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { ToastContainer } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [stopScanning, setStopScanning] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

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
        const data = await response.json();
        console.log('Item added:', data);
        setApiResponse(data); // Set the API response state
        resetForm();
        setGeneratedId('');
        setScannedBarcode('');
      } else {
        console.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Barcode Scanning Handlers
  const handleBarcodeScan = (decodedText) => {
    setScannedBarcode(decodedText);
    const randomId = `${decodedText}-${Math.floor(Math.random() * 1000)}`;
    setGeneratedId(randomId);
    setIsScanning(false);
    setStopScanning(true);
  };

  const handleScanClick = () => {
    setIsScanning(!isScanning);
    setStopScanning(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <IconButton onClick={() => router.push('/')}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h5" gutterBottom>
        Add New Item
      </Typography>
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
                value={scannedBarcode}
                error={touched.barcode && Boolean(errors.barcode)}
                helperText={touched.barcode && errors.barcode}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleScanClick}>
                        <QrCodeScannerIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => setFieldValue('barcode', event.target.value)}
              />
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
            {isScanning && (
              <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={handleBarcodeScan}
                stopScanning={stopScanning}
              />
            )}
          </Form>
        )}
      </Formik>
      <ToastContainer />
      {apiResponse && (
        <Box mt={4}>
          <Typography variant="h6">API Response</Typography>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default AddItemForm;

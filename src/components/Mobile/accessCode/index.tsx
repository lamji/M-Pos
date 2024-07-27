import React, { useState } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { TextField, Container, Typography, Box, Button, Paper } from '@mui/material';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequestCodeModal from '../DeleteModal/requestCodeModal';
import { saveCookie } from '@/src/common/app/cookie';
import { useRouter } from 'next/router';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import { useDispatch } from 'react-redux';
import SimpleDialogDemo from '../../Loader/backdrop';

// Define TypeScript types for form values
interface FormValues {
  code: string;
  email: string;
}

// Define the validation schema using Yup
const validationSchema = Yup.object({
  code: Yup.string().required('Access Code is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const MobileBankingLoginComponent: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // const requestCode = getCookie('rc');

  // Initialize Formik with TypeScript types
  const formik = useFormik<FormValues>({
    initialValues: {
      code: '',
      email: '',
    },
    validationSchema,
    onSubmit: async (
      values: FormValues,
      { resetForm, setSubmitting }: FormikHelpers<FormValues>
    ) => {
      dispatch(setIsBackDropOpen(true));
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.success) {
          saveCookie('t', data.token); // Store the token if the code matches
          toast.success('Login successful!', {
            position: 'top-center',
          });
          setTimeout(() => router.push('/'), 1);
          resetForm();
          dispatch(setIsBackDropOpen(false));
        } else {
          toast.error(data.message || 'Login failed. Please try again.', {
            position: 'top-center',
          });
          dispatch(setIsBackDropOpen(false));
        }
      } catch (error) {
        console.error('Error during form submission:', error); // Debugging line
        toast.error('An error occurred. Please try again.', {
          position: 'top-center',
        });
        dispatch(setIsBackDropOpen(false));
      } finally {
        setSubmitting(false);
        dispatch(setIsBackDropOpen(false));
      }
    },
  });

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        padding: 2,
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1533149527490-1fd54d9b3da6")', // Background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          padding: 0,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly more opaque for readability
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <Image
            src="/logov2.png" // Placeholder logo URL
            alt="Bank Logo"
            width={200}
            height={200}
          />
        </Box>
        <Typography
          variant="body1"
          component="div"
          align="center"
          sx={{ marginBottom: 2, color: '#ef783e' }}
        >
          Welcome! Please enter your email and access code to login.
        </Typography>
        <Box sx={{ width: '100%' }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              name="email"
              label="Email"
              type="email"
              size="medium"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Access Code"
              name="code"
              size="medium"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.code}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
              sx={{ marginBottom: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ backgroundColor: '#ef783e', '&:hover': { backgroundColor: '#ef783e' } }}
            >
              Login
            </Button>
          </form>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            marginTop: '10px',
            fontSize: '12px',
            color: 'blue',
            textDecoration: 'underline',
          }}
          onClick={() => setOpen(true)}
        >
          Request Access Code
        </Box>
      </Paper>
      <RequestCodeModal open={open} handleClose={(i: boolean) => setOpen(i)} />
      <ToastContainer />
      <SimpleDialogDemo />
    </Container>
  );
};

export default MobileBankingLoginComponent;

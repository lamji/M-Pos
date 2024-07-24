import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { TextField, Container, Typography, Box, Button, Paper } from '@mui/material';
import Image from 'next/image';
import { saveCookie } from '@/src/common/app/cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

// Define TypeScript types for form values
interface FormValues {
  access: string;
}

// Define the validation schema using Yup
const validationSchema = Yup.object({
  access: Yup.string().required('Access Code is required'),
});

// Hardcoded username
const HARD_CODED_USERNAME = 'admin';

// Mock API function with username matching
const mockApiCall = async (username: string) => {
  return new Promise<{ code: number; token: string }>((resolve, reject) => {
    setTimeout(() => {
      if (username === HARD_CODED_USERNAME) {
        const randomCode = Math.floor(Math.random() * 10000); // Generate a random 4-digit code
        const mockToken = 'sampleToken123456'; // Mock token
        resolve({ code: randomCode, token: mockToken });
      } else {
        reject(new Error('Invalid access code'));
      }
    }, 1000); // Simulate a network delay
  });
};

const MobileBankingLoginComponent: React.FC = () => {
  const navigate = useRouter();
  // Initialize Formik with TypeScript types
  const formik = useFormik<FormValues>({
    initialValues: {
      access: '',
    },
    validationSchema,
    onSubmit: async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
      try {
        // Simulate API call
        const response = await mockApiCall(values.access);

        if (response.code) {
          saveCookie('t', response.token); // Store the token if the code matches
          toast.success('Login successful!', {
            position: 'top-center',
          });
          setTimeout(() => navigate.push('/pos'), 2000); // Redirect after a short delay to show the toast
        } else {
          toast.error('Invalid code. Please try again.', {
            position: 'top-center',
          });
        }
        resetForm(); // Optionally reset the form after submission
      } catch (error) {
        console.error('API call failed:', error);
        toast.error(`${error}. Please try again.`, {
          position: 'top-center',
        });
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
        height: '100vh',
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
            src="/mposlogo.png" // Placeholder logo URL
            alt="Bank Logo"
            width={200}
            height={200}
          />
        </Box>
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          align="center"
          sx={{ color: '#0A736C' }}
        >
          M-Pos
        </Typography>
        <Typography
          variant="body1"
          component="div"
          align="center"
          sx={{ marginBottom: 2, color: '#0A736C' }}
        >
          Welcome back! Please enter your username to access your account.
        </Typography>
        <Box sx={{ width: '100%' }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Access Code"
              name="access"
              size="medium"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.access}
              error={formik.touched.access && Boolean(formik.errors.access)}
              helperText={formik.touched.access && formik.errors.access}
              sx={{ marginBottom: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ backgroundColor: '#0A736C', '&:hover': { backgroundColor: '#0A736C' } }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default MobileBankingLoginComponent;

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Nav from '@/src/components/Nav';
import Swal from 'sweetalert2';
import { addPaymentToUtang } from '@/src/common/api/testApi';
import { formatCurrency } from '@/src/common/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { clearPayment, getPayment } from '@/src/common/reducers/utangData';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import { useRouter } from 'next/router';

const AmountForm = () => {
  const stateData = useSelector(getPayment);
  const dispatch = useDispatch();
  const router = useRouter();

  const validationSchema = Yup.object({
    amount: Yup.number()
      .required('Amount is required')
      .min(0, 'Amount must be greater than or equal to 0')
      .test(
        'is-valid-amount',
        'Amount must be less than or equal to the amount to pay for partial payment, or equal or greater for full payment',
        function (value) {
          const { isFullPayment } = this.parent;
          const totalAmount = stateData.amount; // Example total amount to pay
          if (isFullPayment) {
            return value >= totalAmount;
          }
          return value <= totalAmount;
        }
      ),
    isFullPayment: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      isFullPayment: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      dispatch(setIsBackDropOpen(true));
      const args = {
        id: stateData?.id,
        payment: {
          amount: parseFloat(values?.amount), // Ensure amount is a number
        },
      };
      try {
        const data = await addPaymentToUtang(args.id, args.payment);
        if (data) {
          Swal.fire({
            title: 'Success!',
            text: 'Payment added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          resetForm();
          dispatch(setIsBackDropOpen(false));
          dispatch(clearPayment());
          router.push('/utang');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add payment',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        dispatch(setIsBackDropOpen(false));
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Nav />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          mt: 8,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          Payor: {stateData.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Amount to Pay: {formatCurrency(stateData.amount)}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="amount"
            name="amount"
            label="Enter Amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Checkbox
                id="isFullPayment"
                name="isFullPayment"
                checked={formik.values.isFullPayment}
                onChange={formik.handleChange}
              />
            }
            label="Full Payment"
            sx={{ mb: 2 }}
          />
          <Button
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
          >
            Pay
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AmountForm;

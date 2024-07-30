import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Field, Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Alert } from '@mui/material';
import { useState } from 'react';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-input': {
    fontSize: '1.1rem',
  },
  '& .MuiFormLabel-root': {
    fontSize: '1.1rem',
  },
}));

const validationSchema = yup.object({
  code: yup.string().required('Code is required').min(6, 'Code must be at least 6 characters long'),
  email: yup.string().email('Invalid email address').required('Email is required'),
});

interface Props {
  open: boolean;
  handleClose: (i: boolean) => void;
}

export default function RequestCodeModal({ open, handleClose }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleCancel = () => {
    handleClose(false);
  };

  const handleSubmitForm = async (values: { code: string; email: string }) => {
    try {
      const response = await fetch('/api/request-activation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        setAlertMessage('Code activated successfully. You have 7 days of trial access.');
      } else {
        setAlertMessage(result.message || 'An error occurred.');
      }
    } catch (error) {
      setAlertMessage('An error occurred.');
    }
  };

  return (
    <React.Fragment>
      <Dialog fullScreen={fullScreen} open={open} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          <Alert severity="info">
            After requesting a code, the code will be activated and grant 7 days of trial access to
            the service. This feature ensures that users can experience the full functionality of
            the service before committing to a subscription.
          </Alert>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <DialogContentText>Enter your desired code and email</DialogContentText>
          <Formik
            initialValues={{ code: '', email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitForm}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  as={StyledTextField}
                  name="email"
                  type="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  onChange={handleChange}
                  value={values.email}
                  error={touched.email && Boolean(errors.email)}
                  helperText={<ErrorMessage name="email" />}
                />
                <Field
                  as={StyledTextField}
                  name="code"
                  type="text"
                  label="Code"
                  fullWidth
                  variant="outlined"
                  onChange={handleChange}
                  value={values.code}
                  error={touched.code && Boolean(errors.code)}
                  helperText={<ErrorMessage name="code" />}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
                {alertMessage && (
                  <Alert severity={alertMessage.includes('error') ? 'error' : 'success'}>
                    {alertMessage}
                  </Alert>
                )}
              </form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

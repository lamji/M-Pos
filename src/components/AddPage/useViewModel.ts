import { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { generateRandomBarcode } from '@/src/common/helpers';
import { getCookie } from '@/src/common/app/cookie';
import useStyles from './useStyles';
import { useDispatch } from 'react-redux';
import { setIsBackDropOpen } from '@/src/common/reducers/items';

// import Html5QrcodePlugin from '@/src/components/Scanner';

export default function useViewModel() {
  const dispatch = useDispatch();
  const styles = useStyles();
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

  const token = getCookie('t');
  const url = '/api/items2'; // Replace with your actual URL
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [checked, setChecked] = useState(false);
  const [searchedVal, setSearchVal] = useState<any>();

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
      } catch (error: any) {
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

  const handleChange = (event: any) => {
    setChecked(event.target.checked);
    setScannedBarcode('');
  };

  const handleBarcodeScanUpdate = async (decodedText: string) => {
    if (!checked) {
      setScannedBarcode(decodedText);
      const randomId = `${decodedText}-${Math.floor(Math.random() * 1000)}`;
      setGeneratedId(randomId);
      setSearchVal({
        id: randomId,
        name: '',
        price: '',
        barcode: decodedText,
        quantity: '',
        regularPrice: '',
        type: '', // Set type if available
      });
    } else {
      try {
        dispatch(setIsBackDropOpen(true));
        const response = await axios.get(`/api/items2?barcode=${decodedText}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        if (data.length > 0) {
          const matchedItem = data[0];
          setScannedBarcode(matchedItem.barcode);
          formik.setValues({
            id: matchedItem.id,
            name: matchedItem.name,
            price: matchedItem.price,
            barcode: matchedItem.barcode,
            quantity: matchedItem.quantity,
            regularPrice: matchedItem.regularPrice,
            type: matchedItem.type || '', // Set type if available
          });
          setSearchVal({
            id: matchedItem.id,
            name: matchedItem.name,
            price: matchedItem.price,
            barcode: matchedItem.barcode,
            quantity: matchedItem.quantity,
            regularPrice: matchedItem.regularPrice,
            type: matchedItem.type || '', // Set type if available
          });
          dispatch(setIsBackDropOpen(false));
        } else {
          setScannedBarcode('');
          dispatch(setIsBackDropOpen(false));
          Swal.fire({
            title: 'Error!',
            text: `No item found with the scanned barcode ${decodedText}`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        setScannedBarcode('');
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch item details',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return {
    validationSchemaChecked,
    validationSchemaUnchecked,
    handleGenerateBarcode,
    handleBarcodeScanUpdate,
    handleChange,
    checked,
    formik,
    styles,
    scannedBarcode,
    searchedVal,
  };
}

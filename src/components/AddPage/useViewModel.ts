import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { generateRandomBarcode } from '@/src/common/helpers';
import useStyles from './useStyles';
import { useDispatch } from 'react-redux';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import {
  createDocument,
  queryDocumentsByBarcode,
  readAllDocuments,
  updateDocument,
} from '@/src/common/app/lib/pouchdbServiceItems';
import { createDocumentHistory } from '@/src/common/app/lib/PouchDbHistory';
import { v4 as uuidv4 } from 'uuid';

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
    quantity: Yup.number().required('Quantity is required'),
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
    quantity: Yup.number().required(),
    regularPrice: Yup.number().required(),
    type: Yup.string().notRequired(),
  });

  // const url = '/api/items2'; // Replace with your actual URL
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [checked, setChecked] = useState(false);
  const [searchedVal, setSearchVal] = useState<any>();
  const [openDialog, setOpenDiog] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [type, setType] = useState('');

  const isHowSearch = type === '' || type === 'New' ? false : true;

  // Initial Values
  const initialValues = {
    id: '',
    name: '',
    price: '',
    barcode: '',
    quantity: '',
    regularPrice: '',
    type: 'New',
    // _id: uuidv4(),
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
        // Construct the document based on form values
        const document = {
          _id: values.id || new Date().toISOString(),
          createdAt: new Date(), // Use provided ID or generate a new one
          ...values,
        };

        const documentHistory = {
          _id: uuidv4(),
          createdAt: new Date(), // Use provided ID or generate a new one
          ...values,
        };

        // Add or update the document in PouchDB
        if (type != 'New') {
          await updateDocument(document as any);
          await createDocumentHistory(documentHistory as any);
        } else {
          await createDocument(document as any);
          // await createDocumentHistory(document as any);
        }

        Swal.fire({
          title: 'Success!',
          text: checked ? 'Item updated successfully' : 'Item added successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Reset form fields and state
        resetForm();
        setGeneratedId(''); // Assuming these are defined elsewhere
        setScannedBarcode(''); // Assuming these are defined elsewhere
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: `An error occurred: ${error}`, // Display error message
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
    setScannedBarcode(decodedText);
    if (type === 'New') {
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
        const data = await queryDocumentsByBarcode(decodedText);

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
            type: type, // Set type if available
          });
          setSearchVal({
            id: matchedItem.id,
            name: matchedItem.name,
            price: matchedItem.price,
            barcode: matchedItem.barcode,
            quantity: matchedItem.quantity,
            regularPrice: matchedItem.regularPrice,
            type: type, // Set type if available
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

  const handleDataOutSearch = (search: any) => {
    console.log(search);
    setOpenDiog(false);
    formik.setValues({
      id: search.id,
      name: search.name,
      price: search.price,
      barcode: search.barcode,
      quantity: search.quantity,
      regularPrice: search.regularPrice,
      type: type, // Set type if available
    });
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await readAllDocuments();
        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching documents', err);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    console.log(formik);
    if (formik.values.type) {
      setType(formik.values.type);
    }
  }, [formik]);

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
    openDialog,
    setOpenDiog,
    handleDataOutSearch,
    documents,
    type,
    isHowSearch,
  };
}

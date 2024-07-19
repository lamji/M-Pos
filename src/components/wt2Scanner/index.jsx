import React from 'react';
import { Format, BarcodeScan } from 'webtonative/barcode';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { IconButton } from '@mui/material';

const BarcodeScannerComponent = ({ dataOut, size }) => {
  const handleScan = () => {
    BarcodeScan({
      formats: Format.QR_CODE, // optional
      onBarcodeSearch: (value) => {
        dataOut(value);
      },
    });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '-50px' }}>
      <IconButton onClick={handleScan}>
        <DocumentScannerIcon style={{ fontSize: size }} />
      </IconButton>
    </div>
  );
};

export default BarcodeScannerComponent;

import React from 'react';
import { Format, BarcodeScan } from 'webtonative/barcode';
import { Box } from '@mui/material';
// import Image from 'next/image';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

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
      <Box sx={{ width: '100%', textAlign: 'center' }} onClick={handleScan}>
        <DocumentScannerIcon style={{ fontSize: size }} />
        {/* <Image src="/barcode.png" width={size} height={size} alt="Picture of the author" /> */}
      </Box>
    </div>
  );
};

export default BarcodeScannerComponent;

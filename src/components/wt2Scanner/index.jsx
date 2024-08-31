import React from 'react';
import { Format, BarcodeScan } from 'webtonative/barcode';
import { Box } from '@mui/material';
import { IoMdQrScanner } from 'react-icons/io';
// import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

const BarcodeScannerComponent = ({ dataOut, size, color }) => {
  const handleScan = () => {
    BarcodeScan({
      formats: Format.QR_CODE, // optional
      onBarcodeSearch: (value) => {
        dataOut(value);
      },
    });
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center', height: size, mx: 1 }} onClick={handleScan}>
      <IoMdQrScanner style={{ fontSize: size, color: color ? color : 'white' }} />
      {/* <Image src="/scan.png" width={size} height={size} alt="Picture of the author" /> */}
    </Box>
  );
};

export default BarcodeScannerComponent;

import React from 'react';
import { BarcodeScan } from 'webtonative/barcode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { IconButton } from '@mui/material';

const BarcodeScannerComponent = ({ handleScan }) => {
  const handleClick = () => {
    BarcodeScan({
      onBarcodeSearch: (value) => {
        alert(value);
        handleScan(value);
      },
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <IconButton onClick={handleClick}>
        <QrCodeScannerIcon
          style={{
            fontSize: '100px',
            marginTop: '-50px',
          }}
        />
      </IconButton>
    </div>
  );
};

export default BarcodeScannerComponent;

import React from 'react';
import { Format, BarcodeScan } from 'webtonative/barcode';

const BarcodeScannerComponent = () => {
  const handleScan = () => {
    BarcodeScan({
      formats: Format.QR_CODE, // optional
      onBarcodeSearch: (value) => {
        alert(value);
      },
    });
  };

  return (
    <div>
      <h1>Scan your barcode</h1>
      <p>Please scan your barcode using the camera.</p>
      <button onClick={handleScan}>Open Scanner</button>
    </div>
  );
};

export default BarcodeScannerComponent;

import React, { useEffect } from 'react';
import { Format, BarcodeScan } from 'webtonative/barcode';

const BarcodeScanner = () => {
  useEffect(() => {
    // Initialize barcode scanner
    BarcodeScan({
      formats: [Format.QR_CODE], // you can specify multiple formats if needed
      onBarcodeSearch: (value) => {
        console.log(value);
        alert(JSON.stringify(value, null, 2)); // Alert the scanned value as a formatted JSON string
      },
    });
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <button
        onClick={() =>
          BarcodeScan({
            formats: [Format.QR_CODE],
            onBarcodeSearch: (value) => {
              console.log(value);
              alert(JSON.stringify(value, null, 2)); // Alert the scanned value as a formatted JSON string
            },
          })
        }
      >
        Scan Barcode
      </button>
    </div>
  );
};

export default BarcodeScanner;

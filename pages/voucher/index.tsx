import Nav from '@/src/components/Nav';
import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

// Define the types for the items data structure
interface Item {
  _id: any;
  'Voucher Code': string;
  Price: number;
  Status: string;
}

const PriceSelectAndQRCode: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]); // State to hold items
  const [selectedPrice, setSelectedPrice] = useState<number | string>(''); // Selected price
  const [qrCode, setQrCode] = useState<string>(''); // QR code image source
  const [data, setData] = useState<any>({}); // Data from QR code
  const [voucherCode, setVoucherCode] = useState<string>(''); // Voucher code of the first unused item
  const [refetch, setRefetch] = useState<boolean>(false); // Refetch data from MongoDB Realm

  useEffect(() => {
    // Fetch data from MongoDB Realm HTTP Trigger
    fetch(
      'https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-fkpmy/endpoint/getAllVouchers'
    )
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        // console.log('Items:', data);
      })
      .catch((error) => console.error('Error fetching items:', error));
  }, [refetch]);

  const handlePriceSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const price = event.target.value;
    setSelectedPrice(price);
    generateQRCodeForFirstItem(price);
  };

  const generateQRCodeForFirstItem = (price: string | number) => {
    const filteredItems = items.filter((item) => item.Price === Number(price));
    if (filteredItems.length > 0) {
      const firstItem = filteredItems[0];
      setData(firstItem);
      console.log('First unused item:', firstItem);
      const codeWithId = `${firstItem['Voucher Code']}-${firstItem['_id']}`;
      updateQRCode(codeWithId);

      const qrData = {
        voucherCode: firstItem['Voucher Code'],
        _id: firstItem['_id'],
      };
      setVoucherCode(qrData.voucherCode);
      console.log('QR Code Data (JSON):', JSON.stringify(qrData));
    } else {
      setQrCode(''); // Hide the QR code if no unused items found
    }
  };

  const updateQRCode = (code: string) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      code
    )}&size=100x100`;
    setQrCode(qrCodeUrl); // Update QR code source
  };

  // Function to update the item status to 'used' in MongoDB Realm
  function updateItemStatus(code: string) {
    console.log('Voucher Code', code);
    fetch(
      'https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-fkpmy/endpoint/updateCode',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code }), // Send _id to identify the item
      }
    )
      .then((response) => response.json())
      .then((updatedItem) => {
        console.log('Item status updated:', updatedItem);
        setSelectedPrice(''); // Reset the price select
        setQrCode(''); // Hide the QR code
        setData({}); // Reset the data
        setVoucherCode(''); // Reset the voucher code
        setRefetch(!refetch); // Refetch data from MongoDB Realm
        // Optionally update the frontend to reflect the change
        const itemIndex = items.findIndex((item) => item['Voucher Code'] === code);
        if (itemIndex !== -1) {
          items[itemIndex].Status = 'USED'; // Update status locally
        }
      })
      .catch((error) => console.error('Error updating item status:', error));
  }

  const prices = Array.from(new Set(items.map((item) => item.Price))); // Get unique prices

  return (
    <>
      <Nav />
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Price Select and QR Code Generator</h1>
        <label htmlFor="priceSelect">Select Price: </label>
        <select id="priceSelect" value={selectedPrice} onChange={handlePriceSelectChange}>
          <option value="" disabled>
            Select a Price
          </option>
          {prices.map((price, index) => (
            <option key={index} value={price}>
              {`Price ${price}`}
            </option>
          ))}
        </select>
        <div id="qrcode">{voucherCode && <p>Voucher Code: {voucherCode}</p>}</div>
        {data.Price && <p>Price: {data.Price}</p>}
        {data.Time && <p>Time: {data.Time}</p>}
        {qrCode && (
          <div style={{ height: 'auto', margin: '0 auto', maxWidth: 104, width: '100%' }}>
            <QRCode
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={qrCode}
              viewBox={`0 0 256 256`}
            />
            <Button
              variant="contained"
              sx={{ color: 'white' }}
              onClick={() => updateItemStatus(data['Voucher Code'])}
            >
              Done
            </Button>
          </div>
        )}
        <div id="reader" style={{ display: 'none' }}></div> {/* QR scanner display area */}
      </div>
    </>
  );
};

export default PriceSelectAndQRCode;

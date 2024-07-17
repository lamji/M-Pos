// pages/api/items.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

// Define TypeScript interfaces for your data
interface Item {
  id: string;
  name: string;
  price: number;
  barcode: string; // Add barcode field
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Item[]>) {
  const { query } = req;
  const filePath = path.join(process.cwd(), 'public', 'items.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const items: Item[] = JSON.parse(jsonData);

  // Handle filtering by barcode
  if (query.barcode) {
    const barcode = (query.barcode as string).toLowerCase();
    const filteredItems = items.filter((item) => item.barcode.toLowerCase() === barcode);
    return res.status(200).json(filteredItems);
  }

  // Example: Filtering by `name` query parameter
  if (query.name) {
    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes((query.name as string).toLowerCase())
    );
    return res.status(200).json(filteredItems);
  }

  res.status(200).json(items);
}

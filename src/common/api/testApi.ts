import axios from 'axios';
import instance from '../app/axios';
import { TObjectAny } from '../types/common';

export const getClearBatchReports = async (params?: TObjectAny) => {
  return instance.get('/api/reports/clear-batch', { params });
};
export const getItemByBarcode = async (barcode: string) => {
  try {
    const response = await instance.get('/api/items2', {
      params: { barcode },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch item', error);
    throw error;
  }
};
export const postTransaction = async (params?: TObjectAny) => {
  return axios.post('/api/transactions', params);
};

export const getSalesData = async () => {
  try {
    const response = await axios.get('/api/transactions', {
      params: {
        sales: true,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch sales data: ' + error);
  }
};

export const fetchItemsWithPagination = async (page: any, limit: any, filters = {}) => {
  try {
    const response = await axios.get('/items', {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch items with pagination');
  }
};

export const getTransactionsByType = async (transactionType: string) => {
  const response = await axios.get('/api/transactions', {
    params: { transactionType },
  });
  return response.data;
};

// Fetch all utang records
export const getAllUtang = async () => {
  try {
    const response = await axios.get('/api/utang');
    return response.data;
  } catch (error) {
    console.error('Error fetching all utang records:', error);
    throw new Error('Failed to fetch all utang records');
  }
};

// Fetch a specific utang record by its ID
export const getUtangById = async (id: string) => {
  try {
    const response = await axios.get(`/api/utang`, {
      params: { _id: id },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching utang by ID:', error);
    throw new Error('Failed to fetch utang by ID');
  }
};

// Create a new utang record
export const createUtang = async (utangData: {
  items: any[];
  name: string;
  total: number;
  remainingBalance: number;
  transactions: { date: string; amount: number }[];
}) => {
  try {
    const response = await axios.post('/api/utang', utangData);
    return response.data;
  } catch (error) {
    console.error('Error creating utang record:', error);
    throw new Error('Failed to create utang record');
  }
};

// Add a payment to an existing utang record
export const addPaymentToUtang = async (id: string, payment: { amount: number }) => {
  console.log(id, payment);
  try {
    const response = await axios.post(`/api/utang`, {
      _id: id,
      payment: {
        amount: payment.amount,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding payment to utang:', error);
    throw new Error('Failed to add payment to utang');
  }
};

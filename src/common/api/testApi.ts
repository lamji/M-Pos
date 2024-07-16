import axios from 'axios';
import instance from '../app/axios';
import { TObjectAny } from '../types/common';

export const getClearBatchReports = async (params?: TObjectAny) => {
  return instance.get('/api/reports/clear-batch', { params });
};

export const postTransaction = async (params?: TObjectAny) => {
  return axios.post('/api/transactions', params);
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
  try {
    const response = await axios.post(`/api/utang`, {
      _id: id,
      payment,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding payment to utang:', error);
    throw new Error('Failed to add payment to utang');
  }
};

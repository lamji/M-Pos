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

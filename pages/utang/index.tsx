import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { getTransactionsByType } from '@/src/common/api/testApi';
import {
  Box,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatCurrency } from '@/src/common/helpers';

// types.ts
export interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface Transaction {
  _id: string;
  items: Item[];
  date: string; // Date string to be parsed with moment
  personName: string;
  cash: number;
  total: number;
  remainingBalance?: number;
  partialAmount?: number;
  transactionType: string;
}

const UtangTransactions: React.FC = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Transaction | null>(null);

  const handleOpen = (row: Transaction) => {
    setSelectedData(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactionsByType('utang');
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const rows: GridRowsProp = transactions.map((transaction) => ({
    id: transaction._id,
    personName: transaction.personName,
    total: transaction.total,
    transaction,
  }));

  const columns: GridColDef[] = [
    { field: 'personName', headerName: 'Name', width: 150 },
    { field: 'total', headerName: 'Total', width: 120 },
    {
      field: 'view',
      headerName: 'View',
      width: 100,
      renderCell: (params: any) => (
        <Button
          sx={{ textTransform: 'capitalize' }}
          variant="text"
          color="primary"
          onClick={() => handleOpen(params.row.transaction)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '10px' }}>
      <IconButton onClick={() => router.push('/')}>
        <ArrowBackIcon />
      </IconButton>
      <h1>Utang Transactions</h1>

      <Box component={Paper} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
        />
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Transaction Receipt</DialogTitle>
        <DialogContent>
          <Box>
            <Typography gutterBottom>{selectedData?.personName}</Typography>
            <Box sx={{ marginTop: '10px', height: '50vh', overflow: 'scroll' }}>
              {selectedData?.items.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '5px',
                  }}
                >
                  <Box>
                    <Typography fontSize={'12px'} fontWeight={700}>
                      {item.name}
                    </Typography>
                    <Typography fontSize={'12px'}>
                      {`Quantity: ${item.quantity} x ${formatCurrency(item.price)}`}
                    </Typography>
                    <Typography fontSize={'12px'}>Date:</Typography>
                  </Box>

                  <Box>
                    <Typography fontSize={'12px'}>
                      {formatCurrency(item.quantity * item.price)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography variant="h6" align="right" sx={{ mt: 2 }}>
              <strong>Total: {formatCurrency(selectedData?.total as number)}</strong>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert('Implement Pay functionality')}
          >
            Pay
          </Button>
          <Button variant="contained" color="error" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UtangTransactions;

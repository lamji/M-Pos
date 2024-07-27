import MobileBankingLoginComponent from '@/src/components/Mobile/accessCode';
import { Box } from '@mui/material';
import React from 'react';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookie = req.headers.cookie;

  const cookies = cookie ? parse(cookie) : undefined;
  const isAuthenticated = cookies?.t ? true : false;

  if (isAuthenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      fullMode: true,
    },
  };
};

export default function Login() {
  return (
    <div>
      <Box
        sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <MobileBankingLoginComponent />
      </Box>
    </div>
  );
}

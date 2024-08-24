import { Box } from '@mui/material';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import dynamic from 'next/dynamic';

import ScanItems from '@/src/components/Mobile/ScanItems';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookie = req.headers.cookie;

  const cookies = cookie ? parse(cookie) : undefined;
  const isAuthenticated = cookies?.t ? true : false;

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      fullMode: false,
    },
  };
};

const Nav = dynamic(() => import('@/src/components/Nav'));

export default function Home() {
  // useEffect(() => {
  //   const fetchDocuments = async () => {
  //     try {
  //       const docs = await readAllDocuments();
  //       const history = await readAllDocumentsHistory();
  //       const utang = await readAllDocumentsUtang();
  //       const transactions = await readAllDocumentTransaction();
  //       console.log('docs', docs);
  //       console.log('history', history);
  //       console.log('utang', utang);
  //       console.log('transactions', transactions);
  //     } catch (err) {
  //       console.error('Error fetching documents', err);
  //     }
  //   };

  //   fetchDocuments();
  // }, []);

  return (
    <>
      <Head>
        <title>POS</title>
      </Head>
      <main>
        <Nav />
        <Box>
          <ScanItems />
        </Box>
      </main>
    </>
  );
}

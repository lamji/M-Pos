import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';

import ScanItems from '@/src/components/Mobile/ScanItems';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { readAllDocuments } from '@/src/common/app/lib/pouchdbServiceItems';
import { readAllDocumentsHistory } from '@/src/common/app/lib/PouchDbHistory';
import { readAllDocumentsUtang } from '@/src/common/app/lib/pouchDbUtang';
import { readAllDocumentTransaction } from '@/src/common/app/lib/pouchDbTransaction';

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
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await readAllDocuments();
        const history = await readAllDocumentsHistory();
        const utang = await readAllDocumentsUtang();
        const transactions = await readAllDocumentTransaction();
        console.log('items', docs);
        console.log('history', history);
        console.log('utang', utang);
        console.log('transactions', transactions);
      } catch (err) {
        console.error('Error fetching documents', err);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <>
      <Head>
        <title>POS</title>
      </Head>
      <main>
        <Nav />
        <ScanItems />
      </main>
    </>
  );
}

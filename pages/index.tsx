// import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';

// import ScanItems from '@/src/components/Mobile/ScanItems';
// import dynamic from 'next/dynamic';
// import { useEffect } from 'react';
// import { readAllDocuments } from '@/src/common/app/lib/pouchdbServiceItems';
// import { readAllDocumentsHistory } from '@/src/common/app/lib/PouchDbHistory';
// import { readAllDocumentsUtang } from '@/src/common/app/lib/pouchDbUtang';
// import { readAllDocumentTransaction } from '@/src/common/app/lib/pouchDbTransaction';
// import { useDeviceType } from '@/src/common/helpers';
// import LaptopScanItems from '@/src/components/Laptop/Pos';
import HomeV2 from '@/src/presentation/v2/homepages';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookie = req.headers.cookie;

  /**
   * Parse cookies to check authentication
   * This is just a placeholder for actual authentication logic
   */
  const cookies = cookie ? parse(cookie) : undefined;
  const isAuthenticated = true;

  console.log(cookies)

  /**
   * Redirect to login if not authenticated
   * This is just a placeholder for actual authentication logic
   */
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  /**
   * Pre-fetch data from PouchDB databases
   * This is just a placeholder for actual data fetching logic
   */
  return {
    props: {
      fullMode: false,
    },
  };
};


export default function Home() {
  return (
    <HomeV2 />
  );
}

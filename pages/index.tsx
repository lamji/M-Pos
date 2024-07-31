import { Box } from '@mui/material';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import dynamic from 'next/dynamic';

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

const ScanItems = dynamic(() => import('@/src/components/Mobile/ScanItems'));
const Nav = dynamic(() => import('@/src/components/Nav'));

export default function Home() {
  return (
    <>
      <Head>
        <title>POS</title>
      </Head>
      <main>
        <Nav />
        <Box sx={{}}>
          <>
            <Box>
              <ScanItems />
            </Box>
          </>
        </Box>
      </main>
    </>
  );
}

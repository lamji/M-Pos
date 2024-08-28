import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import HomePages from '@/src/components/HomePages';

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

export default function Home() {
  return (
    <>
      <Head>
        <title>POS</title>
      </Head>
      <HomePages />
    </>
  );
}

import { setData } from '@/src/common/reducers/data';
import Nav from '@/src/components/Nav';
import EditableTable from '@/src/components/Table';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import { readAllDocuments } from '@/src/common/app/lib/pouchdbServiceItems';
// import { getAllItem } from '@/src/common/api/testApi';

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

export default function Admin() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // You can change this as per your requirement
  const [refetch, setRefetch] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await getAllItem(page, limit);
        const docs = await readAllDocuments();
        // console,log()
        dispatch(setData(docs));
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    fetchData();
  }, [page, limit, dispatch, refetch]);

  const handlePagination = (i: number) => {
    setPage(i);
  };

  return (
    <div>
      <Nav />
      <EditableTable
        handlePagination={handlePagination}
        isRefetch={(i: boolean) => setRefetch(i)}
      />
    </div>
  );
}

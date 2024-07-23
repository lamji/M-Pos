import { setData } from '@/src/common/reducers/data';
import Nav from '@/src/components/Nav';
import EditableTable from '@/src/components/Table';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function Admin() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // You can change this as per your requirement
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/items2?page=${page}&limit=${limit}`);
        const data = await response.json();
        dispatch(setData(data));
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    fetchData();
  }, [page, limit, dispatch]);

  const handlePagination = (i: number) => {
    setPage(i);
  };

  return (
    <div>
      <Nav />
      <EditableTable handlePagination={handlePagination} />
    </div>
  );
}

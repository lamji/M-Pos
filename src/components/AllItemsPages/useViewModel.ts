import { getAllItem } from '@/src/common/api/testApi';
import { setData } from '@/src/common/reducers/data';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useViewModel() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // You can change this as per your requirement
  const [refetch, setRefetch] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllItem(page, limit);
        dispatch(setData(response));
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    fetchData();
  }, [page, limit, dispatch, refetch]);

  const handlePagination = (i: number) => {
    setPage(i);
  };
  return {
    handlePagination,
    setRefetch,
  };
}

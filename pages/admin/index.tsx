import { setData } from '@/src/common/reducers/data';
import Nav from '@/src/components/Nav';
import EditableTable from '@/src/components/Table';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Admin() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('/api/items2')
      .then((response) => response.json())
      .then((data) => {
        // setAllItems(data);
        dispatch(setData(data));
      })
      .catch((error) => console.error('Error fetching JSON data:', error));
  }, []);

  return (
    <div>
      <Nav />
      <EditableTable />
    </div>
  );
}

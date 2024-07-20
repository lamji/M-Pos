import { getData, setData } from '@/src/common/reducers/data';
import Nav from '@/src/components/Nav';
import EditableTable from '@/src/components/Table';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Admin() {
  const dispatch = useDispatch();
  const state = useSelector(getData);
  const [allItems, setAllItems] = useState([]);
  useEffect(() => {
    fetch('/api/items2')
      .then((response) => response.json())
      .then((data) => {
        // setAllItems(data);
        dispatch(setData(data));
      })
      .catch((error) => console.error('Error fetching JSON data:', error));
  }, []);

  useEffect(() => {
    setAllItems(state);
  }, [state]);

  return (
    <div>
      <Nav />
      <EditableTable initialItems={allItems} />
    </div>
  );
}

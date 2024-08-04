import React from 'react';
import Nav from '@/src/components/Nav';
import EditableTable from '@/src/components/Table';
import useViewModel from '../../AllItemsPages/useViewModel';

export default function AllItemsMobile() {
  const model = useViewModel();
  return (
    <div>
      <Nav />
      <EditableTable
        handlePagination={model.handlePagination}
        isRefetch={(i: boolean) => model.setRefetch(i)}
      />
    </div>
  );
}

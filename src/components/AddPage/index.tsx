import React from 'react';
import { useDeviceType } from '@/src/common/helpers';
import AddItemFormMobile from '../Mobile/AddPagesMobile';

export default function AddPages() {
  const { isMobile } = useDeviceType();
  return <>{isMobile && <AddItemFormMobile />}</>;
}

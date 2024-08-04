import React from 'react';
import AllItemsMobile from '../Mobile/AllItemsMobile';
import { useDeviceType } from '@/src/common/helpers';

export default function AllItemsPages() {
  const { isMobile } = useDeviceType();
  return <>{isMobile && <AllItemsMobile />}</>;
}

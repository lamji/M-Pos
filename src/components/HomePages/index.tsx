/* eslint-disable react-hooks/rules-of-hooks */
import dynamic from 'next/dynamic';
import React from 'react';
import { useDeviceType } from '@/src/common/helpers';

const ScanItems = dynamic(() => import('@/src/components/Mobile/ScanItems'));
const Nav = dynamic(() => import('@/src/components/Nav'));
export default function homePages() {
  const { isMobile, isLaptop, isPC } = useDeviceType();

  const isLarge = isLaptop || isPC;
  return (
    <div>
      {isMobile && (
        <>
          <Nav />
          <ScanItems />
        </>
      )}
      {isLarge && <></>}
    </div>
  );
}

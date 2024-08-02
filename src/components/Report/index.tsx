import { useDeviceType } from '@/src/common/helpers';
import React from 'react';
import ReportMobile from '../Mobile/Report';

export default function ReportComponents() {
  const { isMobile } = useDeviceType();
  return <div>{isMobile && <ReportMobile />}</div>;
}

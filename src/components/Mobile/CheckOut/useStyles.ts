import { CSSProperties } from 'react';

export const useStyles = () => {
  return {
    root: {
      padding: '10px',
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as CSSProperties,
    button: {
      fontWeight: 700,
    } as CSSProperties,
    button2: {
      fontWeight: 700,
      width: '100%',
    } as CSSProperties,
    footerButton: {
      textAlign: 'center',
      width: '100% !important',
      padding: '30px',
    } as CSSProperties,
    receiptsWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as CSSProperties,
    receiptsText: {
      marginBottom: 0,
    } as CSSProperties,
  };
};

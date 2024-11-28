import { CSSProperties } from 'react';

export default function useStyles() {
  return {
    root: {
      borderRadius: '5px',
      marginBottom: '10px',
      marginTop: '50px',
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
    } as CSSProperties,
    receiptsWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as CSSProperties,
    receiptsText: {
      marginBottom: 0,
    },
  };
}

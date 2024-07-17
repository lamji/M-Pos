import { AnyObject } from '@/src/common/types/common';

export const useStyles = ({ backgroundColor, designs }: AnyObject) => ({
  root: {
    py: '20px',
    px: {
      xs: '10px',
      md: '60px',
    },
    minHeight: '200px',
    backgroundColor: backgroundColor,
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    cursor: 'pointer',
    height: '100%',
    ...designs,
  },
  header: {
    fontSize: { xs: 16, md: 32 },
    fontWeight: { xs: 600, md: 700 },
    color: 'white',
  },
  subHeader: {
    fontSize: { xs: 12, md: 16 },
    color: 'white',
    margin: '10px 0',
  },
  button: {
    display: {
      xs: 'none',
      md: 'block',
    },
    width: '168px',
    height: '60px',
    backgroundColor: 'white',
    color: backgroundColor,
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'white',
      color: backgroundColor,
    },
  },
  logoStyles: {},

  imageContainer: {
    position: 'absolute',
    top: {
      xs: '0px',
      md: '18px',
    },
    left: 0,
    right: '-18px',

    display: 'flex',
    justifyContent: {
      xs: 'center',
      md: 'end',
    },
    transform: {
      xs: 'scale(0.6)',
      md: 'unset',
    },

    mr: {
      xs: 0,
      md: -10,
    },
    bottom: {
      xs: -350,
      md: 0,
    },
  },
});

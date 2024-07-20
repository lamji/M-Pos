// BottomNav.js
import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GridViewIcon from '@mui/icons-material/GridView';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useRouter } from 'next/router';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const BottomNav = () => {
  const router = useRouter();
  const pathname = router.pathname;

  // Determine the current value based on the pathname
  const getCurrentValue = () => {
    switch (pathname) {
      case '/':
        return 0;
      case '/dashboard':
        return 1;
      case '/pos':
        return 2;
      case '/add':
        return 3;
      case '/utang':
        return 4;
      default:
        return 0;
    }
  };

  const [value, setValue] = React.useState(getCurrentValue);

  // Update the value when pathname changes
  React.useEffect(() => {
    setValue(getCurrentValue);
  }, [pathname]);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
    // Navigate to the corresponding route based on the index
    const routes = ['/', '/dashboard', '/pos', '/add', '/utang'];
    router.push(routes[newValue]);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 9,
      }}
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        sx={{ typography: 'body2', fontSize: '0.75rem' }} // Adjust font size here
      />
      <BottomNavigationAction
        label="Dashboard"
        icon={<GridViewIcon />}
        sx={{ typography: 'body2', fontSize: '0.75rem' }} // Adjust font size here
      />
      <BottomNavigationAction
        label="POS"
        icon={<PointOfSaleIcon />}
        sx={{ typography: 'body2', fontSize: '0.75rem' }} // Adjust font size here
      />
      <BottomNavigationAction
        label="Add Item"
        icon={<PostAddIcon />}
        sx={{
          '& .Mui-selected': {
            fontSize: '0.85rem',
          },
        }} // Adjust font size here
      />
      <BottomNavigationAction
        label="Listahan"
        icon={<FormatListNumberedIcon />}
        sx={{ typography: 'body2', fontSize: '0.75rem' }} // Adjust font size here
      />
    </BottomNavigation>
  );
};

export default BottomNav;
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PaymentsIcon from '@mui/icons-material/Payments';
import InventoryIcon from '@mui/icons-material/Inventory';
import { clearCookie } from '@/src/common/app/cookie';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Typography } from '@mui/material';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import useFetchDocumentsBackup from '@/src/common/hooks/useFetchDocuments';

interface PropsDrawer {
  status: boolean;
  setStatus: (i: boolean) => void;
}

export default function MobileDrawer({ status, setStatus }: PropsDrawer) {
  const router = useRouter();
  const { fetchDocuments } = useFetchDocumentsBackup();
  const toggleDrawer = (newOpen: boolean) => () => {
    setStatus(newOpen);
  };
  const handleSignout = async () => {
    try {
      console.log('Starting document backup...');
      await fetchDocuments(); // Perform backup
      console.log('Backup completed successfully.');
    } catch (error) {
      console.error('Error during backup:', error);
      // Optionally, add user feedback here
    } finally {
      console.log('Clearing cookies and signing out...');
      clearCookie(); // Ensure this properly clears the session cookies
      await router.push('/'); // Redirect to the home page
    }
  };

  // React.useEffect(() => {
  //   if (!loading) {
  //     router.push('/');
  //   }
  // }, [loading, router]);

  const DrawerList = (
    <Box
      sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}
      role="presentation"
    >
      <Box onClick={toggleDrawer(false)} sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            background: '#ef783e',
            alignItems: 'center',
            padding: '10px',
          }}
        >
          <Image
            src="/logov3.png" // Placeholder logo URL
            alt="Bank Logo"
            width={40}
            height={40}
            priority
          />
          <Typography
            fontWeight={700}
            mx={2}
            variant="h6"
            textAlign={'center'}
            sx={{ color: 'white' }}
          >
            M-POS v.1.0
          </Typography>
        </Box>

        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/admin')}>
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary={'All Items'} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/report')}>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary={'Create Report'} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/inventory')}>
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary={'Create Inventory'} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/backup')}>
              <ListItemIcon>
                <CloudSyncIcon />
              </ListItemIcon>
              <ListItemText primary={'Backup/Restore'} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/subscription')}>
              <ListItemIcon>
                <PaymentsIcon />
              </ListItemIcon>
              <ListItemText primary={'Subscription'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box sx={{ padding: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <div>
      <Drawer open={status} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}

import ScanItems from '@/src/components/Mobile/ScanItems';
import { Box } from '@mui/material';
import Nav from '../../src/components/Nav';

export default function Home() {
  return (
    <>
      <main>
        <Nav />
        <Box>
          <ScanItems />
        </Box>
        {/* <div className={styles.footer}>
          <Checkout />
        </div> */}
      </main>
    </>
  );
}

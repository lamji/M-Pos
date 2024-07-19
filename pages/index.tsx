import { Box, Button } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Nav from '@/src/components/Nav';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>POS</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Nav>
          {/* <Typography variant="h6" fontWeight={700} className={styles.title}>
            AKHIRO POS
          </Typography> */}
        </Nav>

        <Box
          sx={{
            marginTop: '-110px',
            background: 'white',
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh', // Full viewport height
            padding: '0 20px', // Optional: Add some horizontal padding
            gap: '10px', // Space between the buttons
          }}
        >
          <Button
            variant="contained"
            onClick={() => router.push('/pos')}
            sx={{
              padding: '50px 30px',
              border: '1px solid gray',
              borderRadius: '20px',
              textAlign: 'center',
              width: '100%',
              maxWidth: '400px', // Optional: Set a maximum width for the button
            }}
          >
            POS
          </Button>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Button
              variant="contained"
              onClick={() => router.push('/utang')}
              sx={{
                border: '1px solid gray',
                borderRadius: '20px',
                height: '100px',
                textAlign: 'center',
                width: '48%',
              }}
            >
              LISTAHAN
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push('/add')}
              sx={{
                border: '1px solid gray',
                borderRadius: '20px',
                height: '100px',
                textAlign: 'center',
                width: '48%',
              }}
            >
              ADD ITEM
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={() => router.push('/dashboard')}
            sx={{
              padding: '50px 30px',
              border: '1px solid gray',
              borderRadius: '20px',
              textAlign: 'center',
              width: '100%',
              maxWidth: '400px', // Optional: Set a maximum width for the button
            }}
          >
            DASHBOARD
          </Button>
        </Box>
      </main>
    </>
  );
}

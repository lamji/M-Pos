import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import CardButton from '@/src/components/Mobile/CardButton';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import { useDispatch } from 'react-redux';
import { restoreDocument } from '@/src/common/app/lib/pouchdbServiceItems';
import { restoreUtangDocument } from '@/src/common/app/lib/pouchDbUtang';
import { restoreTransactionDocs } from '@/src/common/app/lib/pouchDbTransaction';
import apiClient from '@/src/common/app/axios';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookie = req.headers.cookie;

  const cookies = cookie ? parse(cookie) : undefined;
  const isAuthenticated = cookies?.t ? true : false;

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      fullMode: false,
    },
  };
};

const Nav = dynamic(() => import('@/src/components/Nav'));

export default function Backup() {
  const dispatch = useDispatch();

  const fetItems = async () => {
    dispatch(setIsBackDropOpen(true));
    try {
      const response = await apiClient.get('/restore');
      const data = response.data;
      const userData = data.users[0];
      console.log('data=============>', userData);
      if (data.success) {
        // Create an array of promises for restoring 'items' documents
        const restoreItemPromises = userData.items.map(async (data: any) => {
          await restoreDocument(data);
        });

        // Create an array of promises for restoring 'utang' documents
        const restoreUtangPromises = userData.utangs.map(async (data: any) => {
          await restoreUtangDocument(data);
        });

        const restoreTransactionsPromises = userData.transactions.map(async (data: any) => {
          await restoreTransactionDocs(data);
        });

        // Wait for all restore operations to complete
        await Promise.all([
          ...restoreItemPromises,
          ...restoreUtangPromises,
          ...restoreTransactionsPromises,
        ]);

        // Optionally handle any other actions or state updates here
      }
    } catch (error) {
      console.error(error);
      alert(JSON.stringify(error));
    } finally {
      // Ensure the backdrop is closed after all operations complete or if an error occurs
      dispatch(setIsBackDropOpen(false));
    }
  };

  return (
    <>
      <main>
        <Nav />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CardButton
            images="/cloud-backup.png"
            height={80}
            width={80}
            header="Backup"
            onClick={() => console.log('test')}
          />
          <CardButton
            images="/restore.png"
            height={80}
            width={80}
            header="Restore"
            onClick={() => fetItems()}
          />
        </Box>
        ;
      </main>
    </>
  );
}

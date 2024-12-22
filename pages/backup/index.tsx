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
import { deleteDatabase } from '@/src/common/app/lib/PouchDbHistory';
import useFetchDocumentsBackup from '@/src/common/hooks/useFetchDocuments';

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
  const { fetchDocuments } = useFetchDocumentsBackup();

  const clearDB = async () => {
    try {
      dispatch(setIsBackDropOpen(true));
      await deleteDatabase();
    } catch (error) {
      dispatch(setIsBackDropOpen(false));
      console.log(error);
    } finally {
      dispatch(setIsBackDropOpen(false));
    }
  };

  const fetItems = async () => {
    dispatch(setIsBackDropOpen(true));
    try {
      const response = await apiClient.get('/restore');
      // console.log('response', response);
      const data = response.data;
      const userData = data.users[0] || {};

      const itemsData = userData.items || [];
      const utangsData = userData.utangs || [];
      const transactionsData = userData.transactions || [];

      if (data.success) {
        // Create an array of promises for restoring 'items' documents
        const restoreItemPromises = itemsData.map(async ({ _rev, ...cleanedData }: any) => {
          await restoreDocument(cleanedData);
        });

        // Create an array of promises for restoring 'utang' documents
        const restoreUtangPromises = utangsData.map(async (data: any) => {
          await restoreUtangDocument(data);
        });

        const restoreTransactionsPromises = transactionsData.map(
          async ({ _rev, ...cleanedData }: any) => {
            await restoreTransactionDocs(cleanedData);
          }
        );

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
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <CardButton
            images="/cloud-backup.png"
            height={50}
            width={50}
            header="Backup"
            onClick={async () => {
              await fetchDocuments();
            }}
          />
          <CardButton
            images="/restore.png"
            height={50}
            width={50}
            header="Restore"
            onClick={() => fetItems()}
          />
          <CardButton
            images="/restore.png"
            height={50}
            width={50}
            header="Clear DB"
            onClick={() => clearDB()}
          />
        </Box>
      </main>
    </>
  );
}

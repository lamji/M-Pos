import { useEffect } from 'react';
import { useAppDispatch } from '@/src/common/hooks/useRedux';
import { setUserDetails } from '@/src/common/reducers/auth';
import { getClearBatchReports } from '@/src/common/api/testApi';
import { useMutation } from 'react-query';

function useViewModel() {
  const dispatch = useAppDispatch();
  const getClearBatchMutation: any = useMutation(getClearBatchReports);

  useEffect(() => {
    const data = {
      email: 'string',
    };
    getClearBatchMutation.mutate();
    dispatch(setUserDetails(data));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getClearBatchMutation.status === 'success') {
      const tableRows = getClearBatchMutation?.data?.data?.data?.items || [];
      console.log('Test Api', tableRows);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getClearBatchMutation.status]);

  return {
    test: 'Test',
  };
}

export default useViewModel;

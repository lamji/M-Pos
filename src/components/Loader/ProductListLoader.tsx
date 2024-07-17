import { Stack, Grid, Skeleton, Box, useMediaQuery } from '@mui/material';

const ProductListLoader = ({ type }: { type: 'eats' | 'market' }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sm = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const column = new Array(sm ? 2 : 7).fill(null);
  const isEats = type == 'eats';

  return (
    <Grid container sx={{ gap: 2 }}>
      {column.map((_, id) => {
        return (
          <Box key={id} sx={{ width: 160, overflowX: 'hidden', whiteSpace: 'nowrap' }}>
            <Skeleton height={160} />
            <Skeleton height={15} />
            <Skeleton height={15} />
            {isEats ? (
              <Skeleton height={40} />
            ) : (
              <Stack flexDirection="row" justifyContent="space-between">
                <Skeleton height={40} width="55%" />
                <Skeleton height={40} width="40%" />
              </Stack>
            )}
          </Box>
        );
      })}
    </Grid>
  );
};

export default ProductListLoader;

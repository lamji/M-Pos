import { Stack, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';

const ProductLoader = () => {
  return (
    <Grid container gap={2} sx={{ alignItems: 'center' }}>
      <Grid item xs={5}>
        <Skeleton height={150} />
      </Grid>
      <Grid item>
        <Skeleton height={20} width={200} />
        <Skeleton height={20} width={200} />

        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Skeleton height={20} width={50} />
          <Skeleton height={50} width={100} sx={{ borderRadius: '100px' }} />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ProductLoader;

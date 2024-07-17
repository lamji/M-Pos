import { Grid, Skeleton } from '@mui/material';

const SearchAddressLoader = ({ type }: { type: 'delivery' | 'pickup' }) => {
  return (
    <Grid container flexDirection="row" alignItems="center" sx={{ p: 1 }}>
      {type === 'delivery' ? (
        <>
          <Grid item xs={12}>
            <Skeleton height={30} width={120} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton height={70} />
          </Grid>
          <Grid item xs={12} justifyContent="center" display="flex">
            <Skeleton height={80} width={250} sx={{ borderRadius: 80 }} />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <Skeleton height={30} width={120} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton height={70} />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Skeleton height={30} width={120} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton height={70} />
          </Grid>
          <Grid item xs={12} justifyContent="center" display="flex">
            <Skeleton height={80} width={250} sx={{ borderRadius: 80 }} />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default SearchAddressLoader;

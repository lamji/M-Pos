import { Grid, Skeleton, useMediaQuery } from '@mui/material';

const CategoriesLoader = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sm = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const column = new Array(sm ? 3 : 7).fill(null);

  return (
    <Grid container flexDirection="row" alignItems="center">
      <Grid item sx={{ mr: { xs: 'auto', md: 6 } }}>
        <Skeleton height={30} width={120} sx={{ mr: 2 }} />
      </Grid>
      <Grid item>
        <Grid container sx={{ gap: 2 }}>
          {column.map((_, id) => {
            return <Skeleton key={id} height={50} width={70} />;
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategoriesLoader;

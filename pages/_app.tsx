import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { theme } from '@/src/common/app/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Layout from '@/src/components/Layout';
import { persistor, store } from '@/src/common/app/store';
import { PersistGate } from 'redux-persist/integration/react';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 3,
      // 5 minutes
      staleTime: 5 * (60 * 1000),
      // 10 minutes
      cacheTime: 10 * (60 * 1000),
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </Layout>
  );
}

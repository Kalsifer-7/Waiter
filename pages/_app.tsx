import React from 'react';
import PropTypes from 'prop-types';
import type { AppProps /*, AppContext */ } from 'next/app'
import Head from 'next/head';
import { ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import theme from '../styles/Theme';

export default function App({ Component, pageProps }: AppProps) {
  if(process.env.NODE_ENV === 'development'){
    React.useEffect(() => {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentElement) {
        jssStyles.parentElement.removeChild(jssStyles);
      }
    }, []);
  }

  return (
    <React.Fragment>
      <Head>
      </Head>
      <ThemeProvider theme={responsiveFontSizes(theme)}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
import { Provider } from "react-redux";
import store from "@/Redux/Store";
import Head from "next/head";
import Layout from "@/Layout";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import {
  StylesProvider,
  ThemeProvider as StylesThemeProvider,
} from "@mui/styles";
import { lightTheme } from "@/theme";

import AppCommonActionsWrapper from "@/Components/Common/appCommonActionsWrapper";
import { CssBaseline } from "@mui/material";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/Assets/images/svg/Logo.svg" />
      </Head>
      <Provider store={store}>
        <AppCommonActionsWrapper />
        <StylesProvider injectFirst>
          <StylesThemeProvider theme={lightTheme}>
            <MuiThemeProvider theme={lightTheme}>
              <CssBaseline />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </MuiThemeProvider>
          </StylesThemeProvider>
        </StylesProvider>
      </Provider>
    </>
  );
}

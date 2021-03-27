import App from "next/app";
import "../styles/globals.css";
import { AppProps, AppContext } from "next/app"; // 타입 임포트
import { Header, Footer } from "../components";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
// import apolloClient from "../lib/apolloClient";

const GlobalStyle = createGlobalStyle`
  ${reset}
`;

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <>
      <Header />
      <GlobalStyle />
      <ApolloProvider client={apolloClient}>
        {/* <ApolloProvider client={apolloClient}> */}
        <Component {...pageProps} />
      </ApolloProvider>
      <Footer />
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps };
// };

export default MyApp;

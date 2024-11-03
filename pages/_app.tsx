// pages/_app.tsx
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import '../styles/main.css';
import '../styles/aboutus.css';
import '../styles/dedicated1.css';
import '../styles/dedicated2.css';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();


  const isLoginPage = router.pathname === '/Login';

  return (
    <MeshProvider>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </MeshProvider>
  );
}

export default MyApp;

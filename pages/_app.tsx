import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import "../styles/main.css";
import "../styles/aboutus.css";
import "../styles/dedicated1.css";
import "../styles/user.css";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { TransactionProvider } from "../context/TransactionContext";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/Login";

  return (
    <MeshProvider>
      <TransactionProvider>
        {isLoginPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </TransactionProvider>
    </MeshProvider>
  );
}

export default MyApp;

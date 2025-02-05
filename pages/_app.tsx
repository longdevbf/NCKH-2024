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
import { UserProvider } from "../context/UserContext"; // Import UserProvider

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/Login";

  return (
    <MeshProvider>
      <TransactionProvider>
        <UserProvider> {/* Bọc toàn bộ app với UserProvider */}
          {isLoginPage ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </UserProvider>
      </TransactionProvider>
    </MeshProvider>
  );
}

export default MyApp;

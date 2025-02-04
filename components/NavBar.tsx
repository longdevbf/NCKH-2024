import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@meshsdk/react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const NavBar = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { pathname } = useRouter();
  const { wallet, connect, disconnect } = useWallet();
  const router = useRouter();
  useEffect(() => {
    const fetchWalletData = async () => {
      if (wallet) {
        try {
          const address = await wallet.getChangeAddress();
          setWalletAddress(address);

          const utxos = await wallet.getUtxos();
          const totalLovelace = utxos.reduce(
            (sum, utxo) => sum + BigInt(utxo.output.amount.find(a => a.unit === "lovelace")?.quantity || 0),
            BigInt(0)
          );
          setBalance((Number(totalLovelace) / 1_000_000).toFixed(3) + " ADA");

          setIsWalletConnected(true);
          router.push("/user");
        } catch (error) {
          console.error("Error fetching wallet data:", error);
        }
      }
    };

    fetchWalletData();
  }, [wallet]);

  const handleConnect = async (walletType: string) => {
    await connect(walletType);
    setShowWalletModal(false);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="header__navbar">
        <img src="/logox.png" alt="logo" className="header__navbar-logo-image" />
        <div className="header__navbar-navigate">
          <Link href="/" className={`header__navbar-navigate--page ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
          <Link href="/dedicated" className={`header__navbar-navigate--page ${pathname === "/dedicated" ? "active" : ""}`} onClick={(e) => {
            if (!isWalletConnected) {
              e.preventDefault();
              toast.warning(" Vui lòng kết nối ví trước khi truy cập Dedicated!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
                style: {
                  fontSize: '1.5rem',
                  width: '45rem',
                  height: '5rem',
                },
              });
            }
          }}>
            Dedicated
          </Link>
          <Link href="/user" className={`header__navbar-navigate--page ${pathname === "/user" ? "active" : ""}`} onClick={(e) => {
          if (!isWalletConnected) {
            e.preventDefault();
            toast.warning(" Vui lòng kết nối ví trước khi truy cập User!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
              style: {
                fontSize: '1.5rem',
                width: '45rem',
                height: '5rem',
              },
            });
          }
        }}>
            User
          </Link>
          <Link href="/about" className={`header__navbar-navigate--page ${pathname === "/about" ? "active" : ""}`}>
            About Us
          </Link>
        </div>
        {isWalletConnected && walletAddress ? (
          <div className="wallet-info">
            <span className="wallet-balance">{balance}</span>
            <span className="wallet-address">{walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}</span>
            <button className="header__navbar-logout" onClick={() => { router.push("/"); disconnect(); setIsWalletConnected(false); }}>
              Disconnect
            </button>
          </div>
        ) : (
          <button className="header__navbar-login" onClick={() => setShowWalletModal(true)}>
            Connect Wallet
          </button>
        )}
      </div>

      {showWalletModal && !isWalletConnected && (
        <div className="connect-wallet-container">
          <div className="overlay" onClick={() => setShowWalletModal(false)}></div>
          <div className="connect-wallet-modal">
            <button className="close-button" onClick={() => setShowWalletModal(false)}>X</button>
            <h3 className="select-wallet">Select Wallet</h3>
            <button className="wallet-option" onClick={() => handleConnect("eternl")}>
              <img src="https://play-lh.googleusercontent.com/BzpWa8LHTBzJq3bxOUjl-Bp7ixh2VOV_5zk6hZjrk57wRp7sc_kvrf3HCrjdKHL_BtbG" alt="Eternl" className="wallet-logo" />
              <p className="connect-text">Connect with Eternl</p>
            </button>
            <button className="wallet-option" onClick={() => handleConnect("yoroi")}>
              <img style={{ width: '28px', height: '28px', marginRight: '15px' }} src="https://play-lh.googleusercontent.com/UlhGKCVtUuXjDDF_fFdDQaF7mdUpMpsKvfQNNQHuwzbNEvvN-sYRNLk308wpWmLQkR4" alt="Yoroi" className="wallet-logo" />
              <p className="connect-text">Connect with Yoroi</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;

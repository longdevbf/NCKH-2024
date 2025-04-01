import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@meshsdk/react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../context/UserContext";

const NavBar = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false); // State cho modal thông tin ví
  const { userInfo, updateUserInfo, clearUserInfo } = useUser();
  const { pathname } = useRouter();
  const { wallet, connect, disconnect } = useWallet();
  const router = useRouter();

  useEffect(() => {  
    const fetchWalletData1 = async () => {
    if (wallet) {
      try {
        // Log available methods
        console.log("Available wallet methods:", Object.keys(wallet));
        console.log("Available wallet prototype methods:", 
          Object.getOwnPropertyNames(Object.getPrototypeOf(wallet)));
        
        // Try a different method based on the API
        let address = '';
        
        // Try different methods until one works
        if (typeof wallet.getUsedAddresses === 'function') {
          const addresses = (await wallet.getUsedAddresses())[0];
          address = addresses.length > 0 ? addresses[0] : '';
        } else if (typeof wallet.getRewardAddresses === 'function') {
          const addresses = await wallet.getRewardAddresses();
          address = addresses[0] || '';
        } else if (typeof wallet.getChangeAddress() === 'function') {
          address = await wallet.getChangeAddress();
        }
        
        // Rest of your code
        const utxos = await wallet.getUtxos();
        // ...
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }
  };  const fetchWalletData = async () => {
    if (wallet) {
      try {
        // Log available methods
        console.log("Available wallet methods:", Object.keys(wallet));
        console.log("Available wallet prototype methods:", 
          Object.getOwnPropertyNames(Object.getPrototypeOf(wallet)));
        
        // Try a different method based on the API
        let address = '';
        
        // Try different methods until one works
        if (typeof wallet.getUsedAddresses === 'function') {
          const addresses = await wallet.getUsedAddresses();
          address = addresses.length > 0 ? addresses[0] : '';
        }
        // } else if (typeof wallet.getRewardAddresses === 'function') {
        //   const addresses = await wallet.getRewardAddresses();
        //   address = addresses[0] || '';
        // } else if (typeof wallet.getChangeAddress() === 'function') {
        //   address = await wallet.getChangeAddress();
        // }
        
        // Rest of your code
       // const utxos = await wallet.getUtxos();
        // ...
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }
  };
    if (wallet) {
      fetchWalletData();
    }
  }, [wallet]);

  const fetchWalletData = async () => {
    if (wallet) {
      try {
        const address =  await wallet.getChangeAddress();
        const utxos = await wallet.getUtxos();
        const totalLovelace = utxos.reduce(
          (sum, utxo) => sum + BigInt(utxo.output.amount.find(a => a.unit === "lovelace")?.quantity || 0),
          BigInt(0)
        );
        const balance = (Number(totalLovelace) / 1_000_000).toFixed(3) + " ADA";

        updateUserInfo({ address, balance } as any);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }
  };

  const handleConnect = async (walletType: string) => {
    await connect(walletType);
    setShowWalletModal(false);
  };

  const handleDisconnect = () => {
    disconnect();
    clearUserInfo();
    setShowWalletInfo(false); // Đóng form khi đăng xuất
    router.push("/");
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="header__navbar">
        <img src="/logox.png" alt="logo" className="header__navbar-logo-image" />
        <div className="header__navbar-navigate">
          <Link href="/" className={`header__navbar-navigate--page ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
          <Link href="/dedicated" className={`header__navbar-navigate--page ${pathname === "/dedicated" ? "active" : ""}`} onClick={(e) => {
            if (!userInfo.address) {
              e.preventDefault();
              toast.warning("Vui lòng kết nối ví trước khi truy cập Dedicated!");
            }
          }}>
            Dedicated
          </Link>
          <Link href="/MintNFT" className={`header__navbar-navigate--page ${pathname === "/mintnft" ? "active" : ""}`} onClick={(e) => {
            if (!userInfo.address) {
              e.preventDefault();
              toast.warning("Vui lòng kết nối ví trước khi truy cập Mint NFT!");
            }
          }}>
            Mint NFT
          </Link>
          <Link href="/user" className={`header__navbar-navigate--page ${pathname === "/user" ? "active" : ""}`} onClick={(e) => {
            if (!userInfo.address) {
              e.preventDefault();
              toast.warning("Vui lòng kết nối ví trước khi truy cập User!");
            }
          }}>User</Link>
          <Link href="/about" className={`header__navbar-navigate--page ${pathname === "/about" ? "active" : ""}`}>About Us</Link>
        </div>

        {userInfo.address ? (
          <button className="wallet-info" onClick={() => setShowWalletInfo(true)}>

            <span className="wallet-address">{userInfo.address.slice(0, 6)}...{userInfo.address.slice(-8)}</span>
            <span className="wallet-balance">{userInfo.balance}</span>

          </button>
        ) : (
          <button className="header__navbar-login" onClick={() => setShowWalletModal(true)}>
            Connect Wallet
          </button>
        )}
      </div>

      {/* Modal kết nối ví */}
      {showWalletModal && !userInfo.address && (
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

      {/* Modal hiển thị thông tin ví */}
      {showWalletInfo && (
        <div className="wallet-info-modal">
          <div className="wallet-info-content">
            <button className="close-button" onClick={() => setShowWalletInfo(false)}>X</button>
            <h3>Wallet Information</h3>
            <p><strong>Address:</strong> {userInfo.address}</p>
            <p><strong>Balance:</strong> {userInfo.balance}</p>
            <button className="disconnect-button" onClick={handleDisconnect}>Disconnect</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;

import React, { useState, useEffect } from "react";
import { useWallet } from "@meshsdk/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTransaction } from "../context/TransactionContext";

const Dashboard = () => {
  const { transactions } = useTransaction();
  const { wallet, connected } = useWallet();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0 ADA");
  const [stakingAddress, setStakingAddress] = useState("");

  useEffect(() => {
    const fetchWalletData = async () => {
      if (connected && wallet) {
        try {
          const addr = await wallet.getChangeAddress();
          setAddress(addr);

          const utxos = await wallet.getUtxos();
          const totalLovelace = utxos.reduce(
            (sum, utxo) => sum + BigInt(utxo.output.amount.find(a => a.unit === "lovelace")?.quantity || 0),
            BigInt(0)
          );
          setBalance((Number(totalLovelace) / 1_000_000).toFixed(5) + " ADA");
          const stakeAddrs = await wallet.getRewardAddresses();
          setStakingAddress(stakeAddrs.length > 0 ? stakeAddrs[0] : "N/A");
        } catch (error) {
          console.error("Error fetching wallet data:", error);
        }
      }
    };

    fetchWalletData();
  }, [wallet, connected]);

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__avatar">
          <img
            className="dashboard__avatar-link"
            src="https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
            alt="User"
          />
        </div>
        <div className="dashboard__actions">
          <button className="dashboard__button">Lock</button>
          <button className="dashboard__button">Unlock</button>
          <button className="dashboard__button">Refund</button>
          <button className="dashboard__button">Recently</button>
        </div>
      </div>
      <div className="dashboard__info">
        <p className="dashboard__info-item">
          Address: {address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "N/A"}{" "}
          <button className="dashboard__copy-btn" onClick={() => copyToClipboard(address)}>📋</button>
        </p>
        <p className="dashboard__info-item">
          Staking: {stakingAddress ? `${stakingAddress.slice(0, 6)}...${stakingAddress.slice(-6)}` : "N/A"}{" "}
          <button className="dashboard__copy-btn" onClick={() => copyToClipboard(stakingAddress)}>📋</button>
        </p>
        <p className="dashboard__info-item">Asset: {balance}</p>
        <p className="dashboard__info-item">Transaction: {transactions}</p>
      </div>
    </div>
  );
};

export default Dashboard;

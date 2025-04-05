import React, { useState, useEffect } from "react";
import { useWallet } from "@meshsdk/react";
import { useTransaction } from "../context/TransactionContext";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { transactions } = useTransaction();
  const { wallet, connected } = useWallet();
  const { userInfo } = useUser();

  const [address, setAddress] = useState(userInfo.address || "");
  const [balance, setBalance] = useState(userInfo.balance || "0 ADA");
  const [stakingAddress, setStakingAddress] = useState(userInfo.stakingAddress || "");
  const [activities, setActivities] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!connected) return;

    const fetchWalletData = async () => {
      try {
        const addr = await wallet.getChangeAddress();
        setAddress(addr);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ví:", error);
      }
    };

    fetchWalletData();
  }, [wallet, connected, transactions]);

  useEffect(() => {
    if (!address) return;

    const storedActivities = localStorage.getItem("activities");
    if (!storedActivities) {
      setActivities([]);
      return;
    }

    try {
      const parsedActivities = JSON.parse(storedActivities);
      const filteredActivities = parsedActivities.filter((activity: any) =>
        activity.walletAddress === address ||
        activity.getAddress === address ||
        activity.getAdress === address
      );

      setActivities(filteredActivities);
    } catch (error) {
      console.error("Lỗi khi parse activities:", error);
      setActivities([]);
    }
  }, [address]);

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
        <div className="dashboard__info">
          <p className="dashboard__info-item">
            Address: {address || "N/A"}{" "}
            <button className="dashboard__copy-btn" onClick={() => copyToClipboard(address)}>📋</button>
          </p>

          <p className="dashboard__info-item">
            Staking: {stakingAddress || "N/A"}{" "}
            <button className="dashboard__copy-btn" onClick={() => copyToClipboard(stakingAddress)}>📋</button>
          </p>

          <p className="dashboard__info-item">Asset: {balance}</p>
          <p className="dashboard__info-item">Transaction: {transactions}</p>
        </div>
      </div>

      {/* Hiển thị danh sách giao dịch */}
      {activities.length > 0 && (
        <div className="dashboard__activities">
          <h3 className="dashboard__activities-title">Hoạt động gần đây</h3>
          <ul className="dashboard__activities-list">
            {activities.map((activity, index) => (
              <li key={index} className="dashboard__activities-item">
                <div className="dashboard__activity-summary">
                  <p><strong>Hành động:</strong> {activity.type.toUpperCase()}</p>
                  <p><strong>Thời gian:</strong> {new Date(activity.timestamp).toLocaleString()}</p>
                  <button className="dashboard__toggle-btn" onClick={() => toggleExpand(index)}>
                    {expandedIndex === index ? "Thu gọn" : "Xem chi tiết"}
                  </button>
                </div>

                {expandedIndex === index && (
                  <div className="dashboard__activity-details">
                    <p><strong>Thời gian lock:</strong> {new Date(activity.timeLock).toLocaleString()}</p>
                    <p><strong>Ví gửi:</strong> {activity.walletAddress}</p>
                    <p><strong>Ví nhận:</strong> {activity.getAddress}</p>
                    <p><strong>Mã Hash:</strong> {activity.txHash}</p>
                 
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

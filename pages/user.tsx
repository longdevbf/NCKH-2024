import React, { useState, useEffect } from "react";
import { useWallet } from "@meshsdk/react";
import { useTransaction } from "../context/TransactionContext";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { transactions } = useTransaction();
  const { wallet, connected } = useWallet();
  const { userInfo, updateUserInfo } = useUser();

  const [address, setAddress] = useState(userInfo.address || "");
  const [balance, setBalance] = useState(userInfo.balance || "0 ADA");
  const [stakingAddress, setStakingAddress] = useState(userInfo.stakingAddress || "");

  const [activities, setActivities] = useState<any[]>([]);
  const [showActivities, setShowActivities] = useState(false); // ✅ Mặc định ẩn

  // Thêm useEffect để xử lý sự kiện beforeunload
  // useEffect(() => {
  //   // Hàm xử lý khi người dùng sắp rời khỏi trang
  //   const handleBeforeUnload = () => {
  //     // Chỉ xóa key "userBalance" cụ thể khi thoát trang
  //     localStorage.removeItem("userBalance");
      
  //     // Nếu muốn xóa nhiều key cụ thể, bạn có thể thêm vào đây
  //      localStorage.removeItem("userStakingAddress");
  //     localStorage.removeItem("activities");
  //     localStorage.removeItem("userInfo");
  //   };

  //   // Thêm event listener
  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   // Cleanup function để tránh memory leak
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    console.log("🔄 useEffect đang chạy, kiểm tra kết nối...");
  
    if (!connected) {
      console.log("🚫 Không có kết nối ví, không cập nhật dữ liệu.");
      return;
    }
  
    const fetchWalletData = async () => {
      console.log("🔍 Fetching dữ liệu ví...");
      try {
        const addr = await wallet.getChangeAddress();
        console.log("✅ Địa chỉ ví:", addr);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu ví:", error);
      }
    };
  
    fetchWalletData();
  }, [wallet, connected, transactions]);
  

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const handleDisconnect = () => {
  
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userBalance");
    localStorage.removeItem("userStakingAddress");
    sessionStorage.clear();
  
    setAddress("");
    setBalance("0 ADA");
    setStakingAddress("");
  
    updateUserInfo({
      address: "",
      balance: "0 ADA",
      stakingAddress: "",
      transactions: 0,
    });
  
  };
  
  useEffect(() => {
    console.log("🔄 useEffect đang chạy, kiểm tra kết nối...");
  
    if (!connected) {
      console.log("🚫 Không có kết nối ví, không cập nhật dữ liệu.");
      return;
    }
  
    const fetchWalletData = async () => {
      console.log("🔍 Fetching dữ liệu ví...");
      try {
        const addr = await wallet.getChangeAddress();
        console.log("✅ Địa chỉ ví:", addr);
        setAddress(addr); // ✅ Cập nhật địa chỉ ví vào state
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu ví:", error);
      }
    };
  
    fetchWalletData();
  }, [wallet, connected, transactions]);
  
  const handleShowActivities = () => {
    if (!address) {
      toast.warning("Bạn cần kết nối ví trước!");
      return;
    }
  
    setShowActivities((prev) => {
      const newShow = !prev;
  
      if (newShow) {
        const storedActivities = localStorage.getItem("activities");
  
        if (!storedActivities) {
          toast.info("Không có hoạt động nào!");
          setActivities([]);
          return true;
        }
  
        try {
          const parsedActivities = JSON.parse(storedActivities);
  
          console.log("📌 Tất cả activities:", parsedActivities);
          console.log("🟢 Địa chỉ ví đang kết nối:", address);
  
          // ✅ Lọc activities theo địa chỉ ví
          const filteredActivities = parsedActivities.filter((activity: any) => {
            console.log("🔍 Kiểm tra activity:", activity);
            return  activity.walletAddress === address ||
            activity.getAddress === address || 
            activity.getAdress === address // ✅

          });
  
          console.log("🔍 Activities tìm thấy:", filteredActivities);
  
          if (filteredActivities.length === 0) {
            toast.info("Chưa có hoạt động nào cho ví này!");
          }
  
          setActivities(filteredActivities);
  
        } catch (error) {
          console.error("Lỗi khi parse activities:", error);
          toast.error("Dữ liệu activities bị lỗi!");
          setActivities([]);
        }
      }
  
      return newShow;
    });
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
          Address: {address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "N/A"}{" "}
          <button className="dashboard__copy-btn" onClick={() => copyToClipboard(address)}>
            📋
          </button>
        </p>

        <p className="dashboard__info-item">
          Staking: {stakingAddress ? `${stakingAddress.slice(0, 6)}...${stakingAddress.slice(-6)}` : "N/A"}{" "}
          <button className="dashboard__copy-btn" onClick={() => copyToClipboard(stakingAddress)}>
            📋
          </button>
        </p>

        <p className="dashboard__info-item">Asset: {balance}</p>
        <p className="dashboard__info-item">Transaction: {transactions}</p>
      </div>

        
      </div>

      
      <div className="dashboard__actions">
          <button className="dashboard__button">Refund</button>

          {/* ✅ Bấm để show activities */}
          <button className="dashboard__button" onClick={handleShowActivities}>
            Recently
          </button>
        </div>

      {/* ✅ Chỉ hiện activities khi showActivities là true */}
      {showActivities && (
        <div className="dashboard__activities">
          <h3 className="dashboard__activities-title">Hoạt động gần đây</h3>

          {/* Nếu rỗng thì thông báo */}
          {activities.length === 0 ? (
            <p>Không có hoạt động nào!</p>
          ) : (
            <ul className="dashboard__activities-list">
              {activities.map((activity, index) => (
                <li key={index} className="dashboard__activities-item">
                  <p><strong>Hành động:</strong> {activity.type.toUpperCase()}</p>
                  <p><strong>Thời gian:</strong> {new Date(activity.timestamp).toLocaleString()}</p>
                  <p><strong>Ví:</strong> {activity.walletAddress.slice(0, 8)}...{activity.walletAddress.slice(-6)}</p>
                  <p><strong>Mã Hash:</strong> {activity.txHash}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
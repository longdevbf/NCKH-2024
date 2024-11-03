import React, { useState } from 'react';

const ManageAssets = () => {
  const [user] = useState({ name: 'John Doe' });
  const [transactions, setTransactions] = useState([
    { id: 1, status: 'Completed', asset: '100 ADA', selected: false },
    { id: 2, status: 'Pending', asset: '1 NFT', selected: false },
    { id: 3, status: 'Completed', asset: '50 USDT', selected: false },
    { id: 4, status: 'Pending', asset: '200 ADA', selected: false }
  ]);

  const toggleSelect = (id: number) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === id ? { ...transaction, selected: !transaction.selected } : transaction
    ));
  };

  const claimAssets = () => {
    const claimedTransactions = transactions.filter(transaction => transaction.selected && transaction.status === 'Completed');
    alert(`Claiming assets for transactions: ${claimedTransactions.map(t => t.id).join(', ')}`);
  };

  return (
    <div className="manage-assets">
      <h1>Manage Assets</h1>
      <p>User: {user.name}</p>
      <div className="transaction-list">
        {transactions.map(transaction => (
          <div key={transaction.id} className="transaction">
            <label>
              <input 
                type="checkbox" 
                checked={transaction.selected} 
                onChange={() => toggleSelect(transaction.id)} 
                disabled={transaction.status === 'Pending'}
              />
              Transaction ID: {transaction.id} - Status: {transaction.status} - {transaction.asset}
            </label>
          </div>
        ))}
      </div>
      <button onClick={claimAssets} disabled={!transactions.some(t => t.selected)} >Claim</button>
    </div>
  );
};

export default ManageAssets;

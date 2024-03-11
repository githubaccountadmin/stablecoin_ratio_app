import React from 'react';

const WalletConnect = ({ onConnect, account }) => {
  return (
    <div>
      <button onClick={onConnect}>
        {account ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      {account && <p>Connected Account: {account}</p>}
    </div>
  );
};

export default WalletConnect;


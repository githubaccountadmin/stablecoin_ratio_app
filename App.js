import React, { useState, useEffect } from 'react';
import './App.css';
import PWeb3 from 'pweb3';
import WalletConnect from './WalletConnect';
import ConversionModule from './ConversionModule';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isPulseChain, setIsPulseChain] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setIsPulseChain(chainId === '0x171');
        console.log(`Current chain ID: ${chainId}`);
      }
    };
    checkNetwork();
    window.ethereum.on('chainChanged', checkNetwork);
    return () => {
      window.ethereum.removeListener('chainChanged', checkNetwork);
    };
  }, []);
  
  const connectWalletHandler = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          // Define PulseChain network details
          const pulseChainData = {
            chainId: '0x171',
            chainName: 'PulseChain',
            nativeCurrency: {
              name: 'PLS',
              symbol: 'PLS',
              decimals: 18
            },
            rpcUrls: ['https://rpc-pulsechain.g4mm4.io'],
            blockExplorerUrls: ['https://explorer.pulsechain.com']
          };

          // Check if the current network is PulseChain
          const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (currentChainId !== pulseChainData.chainId) {
            // Request to switch to PulseChain network
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [pulseChainData]
            });
          }

          // Continue with account connection
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
          console.log(`Connected account: ${accounts[0]}`);

          // Initialize web3 with PulseChain RPC URL if on PulseChain
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (chainId === '0x171') {
            const pulseChainWeb3 = new PWeb3('https://rpc-pulsechain.g4mm4.io');
            setWeb3(pulseChainWeb3);
            console.log('pweb3 initialized with PulseChain RPC URL');
          }
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };
    
  console.log(`Web3: ${web3}, Account: ${account}, Is on PulseChain: ${isPulseChain}`);

  return (
    <div className="App">
      <header className="App-header">
        <h1>The pUSDC/pDAI Ratio App</h1>
        <button 
          style={{ backgroundColor: isPulseChain ? 'green' : 'red' }}
          disabled
        >
          {isPulseChain ? 'Connected to PulseChain' : 'Not on PulseChain'}
        </button>
        <WalletConnect onConnect={connectWalletHandler} account={account} />
        {web3 && account && <ConversionModule web3={web3} account={account} />}
      </header>
    </div>
  );
}

export default App;

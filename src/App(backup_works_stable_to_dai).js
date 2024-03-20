import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import WalletConnect from './WalletConnect';
import ConversionModule from './ConversionModule';
import usdcABI from './abis/usdcABI';
import usdpABI from './abis/usdpABI';
import gusdABI from './abis/gusdABI';
import psmUsdcABI from './abis/psmUsdcABI';
import psmUsdpABI from './abis/psmUsdpABI';
import psmGusdABI from './abis/psmGusdABI';

// Define the PSM contract addresses
const PSM_CONTRACT_ADDRESSES = {
  USDC: '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A',
  USDP: '0x961Ae24a1Ceba861D1FDf723794f6024Dc5485Cf',
  GUSD: '0x204659B2Fd2aD5723975c362Ce2230Fba11d3900',
};

// Define the joinGem contract addresses for each stablecoin
const JOIN_GEM_CONTRACT_ADDRESSES = {
  USDC: '0x0A59649758aa4d66E25f08Dd01271e891fe52199',
  USDP: '0x7bbd8cA5e413bCa521C2c80D8d1908616894Cf21',
  GUSD: '0x79A0FA989fb7ADf1F8e80C93ee605Ebb94F7c6A5',
};

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [selectedStablecoin, setSelectedStablecoin] = useState('usdc'); // Default selected stablecoin
  const [amountToSwap, setAmountToSwap] = useState(''); // Amount to swap

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0]);
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          console.log(`Connected account: ${accounts[0]}`);
        })
        .catch(error => {
          console.error("Error connecting to MetaMask", error);
        });

      window.ethereum.on('accountsChanged', accounts => {
        setAccount(accounts[0]);
      });

      window.ethereum.on('chainChanged', networkId => {
        console.log(`Network changed to: ${networkId}`);
      });
    } else {
      console.log('Please install MetaMask!');
    }
  }, []);

  const approveAndSwap = async (stablecoin, amount) => {
    if (!web3 || !account) return;

    // Determine the correct ABI and addresses based on the selected stablecoin
    const stablecoinData = {
      'usdc': { abi: usdcABI, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', psmAbi: psmUsdcABI, joinGemAddress: JOIN_GEM_CONTRACT_ADDRESSES.USDC },
      'usdp': { abi: usdpABI, address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1', psmAbi: psmUsdpABI, joinGemAddress: JOIN_GEM_CONTRACT_ADDRESSES.USDP },
      'gusd': { abi: gusdABI, address: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd', psmAbi: psmGusdABI, joinGemAddress: JOIN_GEM_CONTRACT_ADDRESSES.GUSD }
    }[stablecoin];

    const psmContractAddress = PSM_CONTRACT_ADDRESSES[stablecoin.toUpperCase()];
    const stablecoinContract = new web3.eth.Contract(stablecoinData.abi, stablecoinData.address);
    const psmContract = new web3.eth.Contract(stablecoinData.psmAbi, psmContractAddress);

    try {
      // Approve the joinGem contract to spend stablecoins
      const approvalReceipt = await stablecoinContract.methods.approve(stablecoinData.joinGemAddress, amount).send({ from: account });
      console.log(`${stablecoin.toUpperCase()} allowance updated.`, approvalReceipt);

      // Check if the approval was successful before proceeding
      if (approvalReceipt.status) {
        console.log('Approval successful, now calling sellGem...');
        // Call the sellGem function on the PSM contract
        const sellGemReceipt = await psmContract.methods.sellGem(account, amount).send({ from: account });
        console.log(`Swapped ${stablecoin.toUpperCase()} for DAI.`, sellGemReceipt);
      } else {
        console.error('Approval transaction failed.');
      }
    } catch (error) {
      console.error('Error during approve and swap process:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>The Stablecoin to DAI Ratio App</h1>
        <WalletConnect onConnect={() => {/* Connect wallet functionality */}} account={account} />
        {/* Dropdown for selecting stablecoin */}
        <select value={selectedStablecoin} onChange={(e) => setSelectedStablecoin(e.target.value)}>
          <option value="usdc">USDC</option>
          <option value="usdp">USDP</option>
          <option value="gusd">GUSD</option>
        </select>
        {/* Pass amountToSwap, setAmountToSwap, and approveAndSwap to ConversionModule */}
        {web3 && account && (
          <ConversionModule 
            amount={amountToSwap} 
            setAmount={setAmountToSwap} 
            onConvert={() => approveAndSwap(selectedStablecoin, amountToSwap)} 
          />
        )}
      </header>
    </div>
  );
}

export default App;


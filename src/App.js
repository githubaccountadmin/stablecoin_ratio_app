import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import WalletConnect from './WalletConnect';
import usdcABI from './abis/usdcABI.js';
import usdpABI from './abis/usdpABI.js';
import gusdABI from './abis/gusdABI.js';
import daiABI from './abis/daiABI.js';
import psmUsdcABI from './abis/psmUsdcABI.js';
import psmUsdpABI from './abis/psmUsdpABI.js';
import psmGusdABI from './abis/psmGusdABI.js';
import vatABI from './abis/vatABI.js';

// Define the contract addresses
const CONTRACT_ADDRESSES = {
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDP: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
  GUSD: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  VAT: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
};

// PSM contract addresses for swapping DAI to stablecoins and vice versa
const PSM_CONTRACT_ADDRESSES = {
  USDC: '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A',
  USDP: '0x961Ae24a1Ceba861D1FDf723794f6024Dc5485Cf',
  GUSD: '0x204659B2Fd2aD5723975c362Ce2230Fba11d3900',
};

// JoinGem contract addresses for each stablecoin
const JOIN_GEM_CONTRACT_ADDRESSES = {
  USDC: '0x0A59649758aa4d66E25f08Dd01271e891fe52199',
  USDP: '0x7bbd8cA5e413bCa521C2c80D8d1908616894Cf21',
  GUSD: '0x79A0FA989fb7ADf1F8e80C93ee605Ebb94F7c6A5',
};

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [selectedStablecoin, setSelectedStablecoin] = useState('USDC');
  const [amountToSwap, setAmountToSwap] = useState('');
  const [swapDirection, setSwapDirection] = useState('sell'); // "sell" for stablecoin to DAI, "buy" for DAI to stablecoin
  const [ilkData, setIlkData] = useState({ USDC: {}, USDP: {}, GUSD: {} });

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        setAccount(accounts[0]);
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        console.log(`Connected account: ${accounts[0]}`);
        fetchIlkData(web3Instance); // Fetch ilk data right after setting the web3 instance
      }).catch(error => {
        console.error("Error connecting to MetaMask", error);
      });

      window.ethereum.on('accountsChanged', accounts => {
        setAccount(accounts[0]);
      });

      window.ethereum.on('chainChanged', () => window.location.reload());
    } else {
      console.log('Please install MetaMask!');
    }
  }, []);

  const fetchIlkData = async (web3Instance) => {
    const vatContract = new web3Instance.eth.Contract(vatABI, CONTRACT_ADDRESSES.VAT);
    const psmContracts = {
      USDC: new web3Instance.eth.Contract(psmUsdcABI, PSM_CONTRACT_ADDRESSES.USDC),
      USDP: new web3Instance.eth.Contract(psmUsdpABI, PSM_CONTRACT_ADDRESSES.USDP),
      GUSD: new web3Instance.eth.Contract(psmGusdABI, PSM_CONTRACT_ADDRESSES.GUSD),
    };

    Object.entries(psmContracts).forEach(async ([key, contract]) => {
      const ilkCode = await contract.methods.ilk().call();
      const ilkData = await vatContract.methods.ilks(ilkCode).call();
      const minted = web3Instance.utils.fromWei(ilkData.Art, 'ether');
      const debtCeiling = web3Instance.utils.fromWei(ilkData.line, 'ether');
    
      setIlkData(prevData => ({
        ...prevData,
        [key]: { minted, debtCeiling }
      }));
    });
  };

  const approveAndSwap = async () => {
    if (!web3 || !account) return;

    let tokenContractABI, tokenContractAddress, psmContractABI, psmContractAddress, approvalAddress;

    switch(swapDirection) {
      case 'sell':
        tokenContractABI = CONTRACT_ADDRESSES[selectedStablecoin] === CONTRACT_ADDRESSES.USDC ? usdcABI : selectedStablecoin === 'USDP' ? usdpABI : gusdABI;
        tokenContractAddress = CONTRACT_ADDRESSES[selectedStablecoin];
        psmContractABI = PSM_CONTRACT_ADDRESSES[selectedStablecoin] === PSM_CONTRACT_ADDRESSES.USDC ? psmUsdcABI : selectedStablecoin === 'USDP' ? psmUsdpABI : psmGusdABI;
        psmContractAddress = PSM_CONTRACT_ADDRESSES[selectedStablecoin];
        approvalAddress = JOIN_GEM_CONTRACT_ADDRESSES[selectedStablecoin];
        break;
      case 'buy':
        tokenContractABI = daiABI;
        tokenContractAddress = CONTRACT_ADDRESSES.DAI;
        psmContractABI = selectedStablecoin === 'USDC' ? psmUsdcABI : selectedStablecoin === 'USDP' ? psmUsdpABI : psmGusdABI;
        psmContractAddress = PSM_CONTRACT_ADDRESSES[selectedStablecoin];
        approvalAddress = psmContractAddress;
        break;
      default:
        console.error("Invalid swap direction");
        return;
    }

    const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);
    const psmContract = new web3.eth.Contract(psmContractABI, psmContractAddress);
    const amountInWei = web3.utils.toWei(amountToSwap, 'ether');

    // Approve the PSM contract or JoinGem contract to spend tokens
    await tokenContract.methods.approve(approvalAddress, amountInWei).send({ from: account });

    // Execute swap
    if (swapDirection === 'sell') {
      await psmContract.methods.sellGem(account, amountInWei).send({ from: account });
    } else {
      await psmContract.methods.buyGem(account, amountInWei).send({ from: account });
    }
    console.log(`Swap completed: ${amountToSwap} ${swapDirection === 'sell' ? selectedStablecoin : 'DAI'} to ${swapDirection === 'sell' ? 'DAI' : selectedStablecoin}.`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stablecoin Ratio App</h1>
        <WalletConnect onConnect={() => console.log('Wallet connected')} account={account} />
        <div className="dashboard"> {/* Use the .dashboard class for layout */}
          {Object.entries(ilkData).map(([key, { minted, debtCeiling }]) => (
            <div key={key} className="coin-data"> {/* Use the .coin-data class for styling */}
              <h3>{key}</h3>
              <p>Minted: {minted}</p>
              <p>Debt Ceiling: {debtCeiling}</p>
            </div>
          ))}
        </div>
        <div>
          <label>Swap Direction:</label>
          <select value={swapDirection} onChange={e => setSwapDirection(e.target.value)}>
            <option value="sell">Stablecoin to DAI</option>
            <option value="buy">DAI to Stablecoin</option>
          </select>
        </div>
        <div>
          <label>Choose Stablecoin:</label>
          <select value={selectedStablecoin} onChange={e => setSelectedStablecoin(e.target.value)}>
            <option value="USDC">USDC</option>
            <option value="USDP">USDP</option>
            <option value="GUSD">GUSD</option>
          </select>
        </div>
        <div>
          <label>Amount:</label>
          <input type="text" value={amountToSwap} onChange={e => setAmountToSwap(e.target.value)} />
        </div>
        <button onClick={approveAndSwap}>Swap</button>
      </header>
    </div>
  );
}

export default App;

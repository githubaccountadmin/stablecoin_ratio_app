// Import necessary modules
import Web3 from 'web3';
import usdcABI from './usdcABI.js';
import usdpABI from './usdpABI.js';
import gusdABI from './gusdABI.js';
import daiABI from './daiABI.js';
import psmUsdcABI from './psmUsdcABI.js';
import psmUsdpABI from './psmUsdpABI.js';
import psmGusdABI from './psmGusdABI.js';
import vatABI from './vatABI.js';
import PWeb3 from 'pweb3';
import ConversionModule from './ConversionModule'; // Import the ConversionModule component
import { Buffer } from 'buffer';
import ReactDOM from 'react-dom'; // Import ReactDOM for rendering without React components

// Polyfill Buffer for browser environment
window.Buffer = Buffer;

// Define contract addresses
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

// Initialize Web3
const web3 = new Web3();

// WalletConnect component
const WalletConnect = ({ onConnect, account }) => {
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
        console.log(`Connected account: ${accounts[0]}`);

        // Initialize web3 with PulseChain RPC URL if on PulseChain
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId === '0x171') {
          const pulseChainWeb3 = new PWeb3('https://rpc-pulsechain.g4mm4.io');
          console.log('web3 initialized with PulseChain RPC URL');
        }
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  return `
    <div>
      <button id="connectWalletBtn" onclick="${connectWalletHandler}">
        ${account ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      ${account ? `<p>Connected Account: ${account}</p>` : ''}
    </div>
  `;
};

// Swap handler
const swapHandler = () => {
  // Implement swap logic here
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Connect Wallet button click event
  document.getElementById('connectWalletBtn').addEventListener('click', connectWalletHandler);

  // Swap button click event
  document.getElementById('swapBtn').addEventListener('click', swapHandler);
});

// Render ConversionModule
document.addEventListener('DOMContentLoaded', () => {
  const appHeader = document.querySelector('.App-header');
  const conversionModuleContainer = document.createElement('div');
  conversionModuleContainer.id = 'conversionModuleContainer';
  appHeader.appendChild(conversionModuleContainer);

  const renderConversionModule = () => {
    ConversionModule(web3, account);
  };

  renderConversionModule();
});

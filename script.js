import usdcABI from './usdcABI.js';
import usdpABI from './usdpABI.js';
import gusdABI from './gusdABI.js';
import daiABI from './daiABI.js';
import psmUsdcABI from './psmUsdcABI.js';
import psmUsdpABI from './psmUsdpABI.js';
import psmGusdABI from './psmGusdABI.js';
import vatABI from './vatABI.js';

let web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
let account; // Define the account variable globally
let amount = '';

const CONTRACT_ADDRESSES = {
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDP: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
  GUSD: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  VAT: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
};

const PSM_CONTRACT_ADDRESSES = {
  USDC: '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A',
  USDP: '0x961Ae24a1Ceba861D1FDf723794f6024Dc5485Cf',
  GUSD: '0x204659B2Fd2aD5723975c362Ce2230Fba11d3900',
};

const JOIN_GEM_CONTRACT_ADDRESSES = {
  USDC: '0x0A59649758aa4d66E25f08Dd01271e891fe52199',
  USDP: '0x7bbd8cA5e413bCa521C2c80D8d1908616894Cf21',
  GUSD: '0x79A0FA989fb7ADf1F8e80C93ee605Ebb94F7c6A5',
};

const handleDisconnect = () => {
    console.log('MetaMask disconnected');
};

const connectWalletHandler = async () => {
    console.log('Connect Wallet button clicked');
    try {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            throw new Error('MetaMask not detected.');
        }

        const pulseChainData = {
            chainId: '0x171',
            chainName: 'PulseChain',
            nativeCurrency: {
                name: 'PLS',
                symbol: 'PLS',
                decimals: 18
            },
            rpcUrls: ['https://rpc.pulsechain.com'],
        };

        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (currentChainId !== pulseChainData.chainId) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [pulseChainData]
            });
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        account = accounts[0]; // Assign the connected account to the global variable
        console.log(`Connected account: ${account}`);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId === '0x171') {
            web3 = new Web3('https://rpc.pulsechain.com');
            console.log('web3 initialized with PulseChain RPC URL');
        }
      
    } catch (error) {
        console.error("Error connecting to MetaMask", error);
    }
};

window.ethereum.on('disconnect', handleDisconnect);

document.addEventListener('DOMContentLoaded', function () {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWalletHandler);
    } else {
        console.error('Connect Wallet button not found.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const swapBtn = document.getElementById('swapBtn');
    if (!swapBtn) {
        console.error('Swap button not found.');
        return;
    }

    swapBtn.addEventListener('click', () => {
        const swapDirection = document.getElementById('swapDirection').value;
        const selectedStablecoin = document.getElementById('selectedStablecoin').value;
        const amountToSwap = document.getElementById('amountInput').value;
        if (!amountToSwap) {
            console.error('Please enter the amount to swap.');
            return;
        }

        swapHandler(swapDirection, selectedStablecoin, amountToSwap, account, web3);
    });
});

const handleUSDCApprove = async (amount) => {
    const usdcContract = new web3.eth.Contract(usdcContractABI, usdcContractAddress);
    const amountInUSDCDecimals = `${amount * Math.pow(10, 6)}`;
    try {
        await usdcContract.methods.approve(psmContractAddress, amountInUSDCDecimals).send({ from: account });
        console.log('USDC approval successful');
    } catch (error) {
        console.error('Error in USDC approval:', error);
    }
};

window.handleConvertUSDCtoDAI = async (amount) => {
    await handleUSDCApprove(amount); // Make sure USDC is approved before conversion
    if (web3 && account) {
        const contract = new web3.eth.Contract(psmContractABI, psmContractAddress);
        const usdcAmountInWei = `${amount * Math.pow(10, 6)}`;
    
        try {
            await contract.methods.sellGem(account, usdcAmountInWei).send({ from: account });
            console.log(`Conversion successful: ${amount} USDC to DAI`);
        } catch (error) {
            console.error('Error during conversion:', error);
        }
    } else {
        console.log('Web3 or account not initialized');
    }
};

const swapHandler = async (swapDirection, selectedStablecoin, amountToSwap, account, web3) => {
  try {
    let tokenContractABI, tokenContractAddress, psmContractABI, psmContractAddress, approvalAddress;

    switch (swapDirection) {
      case 'sell':
        tokenContractABI = daiABI;
        tokenContractAddress = CONTRACT_ADDRESSES.DAI;
        psmContractABI = selectedStablecoin === 'USDC' ? psmUsdcABI : selectedStablecoin === 'USDP' ? psmUsdpABI : psmGusdABI;
        psmContractAddress = PSM_CONTRACT_ADDRESSES[selectedStablecoin];
        approvalAddress = JOIN_GEM_CONTRACT_ADDRESSES[selectedStablecoin];
        break;
      case 'buy':
        tokenContractABI = CONTRACT_ADDRESSES[selectedStablecoin] === CONTRACT_ADDRESSES.USDC ? usdcABI : selectedStablecoin === 'USDP' ? usdpABI : gusdABI;
        tokenContractAddress = CONTRACT_ADDRESSES[selectedStablecoin];
        psmContractABI = PSM_CONTRACT_ADDRESSES[selectedStablecoin] === PSM_CONTRACT_ADDRESSES.USDC ? psmUsdcABI : selectedStablecoin === 'USDP' ? psmUsdpABI : psmGusdABI;
        psmContractAddress = PSM_CONTRACT_ADDRESSES[selectedStablecoin];
        approvalAddress = JOIN_GEM_CONTRACT_ADDRESSES[selectedStablecoin];
        break;
      default:
        throw new Error("Invalid swap direction");
    }

    const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);
    const psmContract = new web3.eth.Contract(psmContractABI, psmContractAddress);
    const amountInWei = web3.utils.toWei(amountToSwap, 'ether');

    await tokenContract.methods.approve(approvalAddress, amountInWei).send({ from: account });

    if (swapDirection === 'sell') {
      await psmContract.methods.sellGem(account, amountInWei).send({ from: account });
    } else {
      await psmContract.methods.buyGem(account, amountInWei).send({ from: account });
    }
    console.log(`Swap completed: ${amountToSwap} ${swapDirection === 'sell' ? selectedStablecoin : 'DAI'} to ${swapDirection === 'sell' ? 'DAI' : selectedStablecoin}.`);
  } catch (error) {
    console.error('Error executing swap:', error);
  }
};

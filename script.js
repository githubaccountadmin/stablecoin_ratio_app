import usdcABI from './usdcABI.js';
import usdpABI from './usdpABI.js';
import gusdABI from './gusdABI.js';
import daiABI from './daiABI.js';
import psmUsdcABI from './psmUsdcABI.js';
import psmUsdpABI from './psmUsdpABI.js';
import psmGusdABI from './psmGusdABI.js';
import vatABI from './vatABI.js';

// Create a new instance of Web3 with the given provider or a fallback URL
let web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
let account; // Define the account variable globally
let amount = '';

// Define contract addresses and ABIs
const usdcContractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const usdcContractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"authorizer","type":"address"},{"indexed":true,"internalType":"bytes32","name":"nonce","type":"bytes32"}],"name":"AuthorizationCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"authorizer","type":"address"},{"indexed":true,"internalType":"bytes32","name":"nonce","type":"bytes32"}],"name":"AuthorizationUsed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_account","type":"address"}],"name":"Blacklisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newBlacklister","type":"address"}],"name":"BlacklisterChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"burner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newMasterMinter","type":"address"}],"name":"MasterMinterChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"minter","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"uint256","name":"minterAllowedAmount","type":"uint256"}],"name":"MinterConfigured","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldMinter","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":false,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"PauserChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newRescuer","type":"address"}],"name":"RescuerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_account","type":"address"}],"name":"UnBlacklisted","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"inputs":[],"name":"CANCEL_AUTHORIZATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RECEIVE_WITH_AUTHORIZATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRANSFER_WITH_AUTHORIZATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"authorizer","type":"address"},{"internalType":"bytes32","name":"nonce","type":"bytes32"}],"name":"authorizationState","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"blacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"blacklister","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"authorizer","type":"address"},{"internalType":"bytes32","name":"nonce","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"cancelAuthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"authorizer","type":"address"},{"internalType":"bytes32","name":"nonce","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"cancelAuthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"minter","type":"address"},{"internalType":"uint256","name":"minterAllowedAmount","type":"uint256"}],"name":"configureMinter","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currency","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"decrement","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"increment","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"string","name":"tokenSymbol","type":"string"},{"internalType":"string","name":"tokenCurrency","type":"string"},{"internalType":"uint8","name":"tokenDecimals","type":"uint8"},{"internalType":"address","name":"newMasterMinter","type":"address"},{"internalType":"address","name":"newPauser","type":"address"},{"internalType":"address","name":"newBlacklister","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newName","type":"string"}],"name":"initializeV2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"lostAndFound","type":"address"}],"name":"initializeV2_1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"accountsToBlacklist","type":"address[]"},{"internalType":"string","name":"newSymbol","type":"string"}],"name":"initializeV2_2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"isBlacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isMinter","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"masterMinter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"minter","type":"address"}],"name":"minterAllowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pauser","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"validAfter","type":"uint256"},{"internalType":"uint256","name":"validBefore","type":"uint256"},{"internalType":"bytes32","name":"nonce","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"receiveWithAuthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"validAfter","type":"uint256"},{"internalType":"uint256","name":"validBefore","type":"uint256"},{"internalType":"bytes32","name":"nonce","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"receiveWithAuthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"minter","type":"address"}],"name":"removeMinter","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"tokenContract","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescuer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"validAfter","type":"uint256"},{"internalType":"uint256","name":"validBefore","type":"uint256"},{"internalType":"bytes32","name":"nonce","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"transferWithAuthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"validAfter","type":"uint256"},{"internalType":"uint256","name":"validBefore","type":"uint256"},{"internalType":"bytes32","name":"nonce","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"transferWithAuthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"unBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newBlacklister","type":"address"}],"name":"updateBlacklister","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newMasterMinter","type":"address"}],"name":"updateMasterMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newPauser","type":"address"}],"name":"updatePauser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newRescuer","type":"address"}],"name":"updateRescuer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}];

const psmContractAddress = '0x89b78cfa322f6c5de0abceecab66aee45393cc5a';
const psmContractABI = [{"inputs":[{"internalType":"address","name":"gemJoin_","type":"address"},{"internalType":"address","name":"daiJoin_","type":"address"},{"internalType":"address","name":"vow_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"BuyGem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"}],"name":"Deny","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"data","type":"uint256"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"}],"name":"Rely","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"SellGem","type":"event"},{"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"gemAmt","type":"uint256"}],"name":"buyGem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dai","outputs":[{"internalType":"contract DaiAbstract","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"daiJoin","outputs":[{"internalType":"contract DaiJoinAbstract","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"deny","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"gemJoin","outputs":[{"internalType":"contract AuthGemJoinAbstract","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"hope","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ilk","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"nope","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"rely","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"gemAmt","type":"uint256"}],"name":"sellGem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vat","outputs":[{"internalType":"contract VatAbstract","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vow","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

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

// Define the handleDisconnect function
const handleDisconnect = () => {
    console.log('MetaMask disconnected');
    // Perform any necessary actions when MetaMask is disconnected
};

// Connect Wallet handler
const connectWalletHandler = async () => {
    console.log('Connect Wallet button clicked');
    try {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            throw new Error('MetaMask not detected.');
        }

        // Define PulseChain network details
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
        account = accounts[0]; // Assign the connected account to the global variable
        console.log(`Connected account: ${account}`);

        // Initialize web3 with PulseChain RPC URL if on PulseChain
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId === '0x171') {
            web3 = new Web3('https://rpc.pulsechain.com');
            console.log('web3 initialized with PulseChain RPC URL');
        }
      
    } catch (error) {
        console.error("Error connecting to MetaMask", error);
    }
};

// Update event listener to use 'disconnect' instead of 'close'
window.ethereum.on('disconnect', handleDisconnect);

// Error handling for event listeners
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
    // Initialize USDC contract instance
    const usdcContract = new web3.eth.Contract(usdcContractABI, usdcContractAddress);
    const amountInUSDCDecimals = `${amount * Math.pow(10, 6)}`;
    try {
        // Send approval transaction
        await usdcContract.methods.approve(psmContractAddress, amountInUSDCDecimals).send({ from: account });
        console.log('USDC approval successful');
    } catch (error) {
        console.error('Error in USDC approval:', error);
    }
};

// Define handleConvertUSDCtoDAI globally
window.handleConvertUSDCtoDAI = async (amount) => {
    await handleUSDCApprove(amount); // Make sure USDC is approved before conversion
    if (web3 && account) {
        // Initialize PSM contract instance
        const contract = new web3.eth.Contract(psmContractABI, psmContractAddress);
        // Directly multiply the amount by 10**6 for USDC's 6 decimal places
        const usdcAmountInWei = `${amount * Math.pow(10, 6)}`;
    
        try {
            // Assuming sellGem is correct; replace with the actual function if different
            await contract.methods.sellGem(account, usdcAmountInWei).send({ from: account });
            console.log(`Conversion successful: ${amount} USDC to DAI`);
        } catch (error) {
            console.error('Error during conversion:', error);
        }
    } else {
        console.log('Web3 or account not initialized');
    }
};

// Swap handler
const swapHandler = async (swapDirection, selectedStablecoin, amountToSwap, account, web3) => {
  try {
    let tokenContractABI, tokenContractAddress, psmContractABI, psmContractAddress, approvalAddress;

    // Determine contract ABIs and addresses based on swap direction and stablecoin
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

    // Approve the PSM contract or JoinGem contract to spend tokens
    await tokenContract.methods.approve(approvalAddress, amountInWei).send({ from: account });

    // Execute swap
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
});

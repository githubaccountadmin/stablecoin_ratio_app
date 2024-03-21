const ConversionModule = ({ web3, account }) => {
    // Define state variables using plain JavaScript
    let amount = '';
    
    // Define contract addresses and ABIs
    const usdcContractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const usdcContractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"}, ...];

    const psmContractAddress = '0x89b78cfa322f6c5de0abceecab66aee45393cc5a';
    const psmContractABI = [{"inputs":[{"internalType":"address","name":"gemJoin_","type":"address"},{"internalType":"address","name":"daiJoin_","type":"address"},{"internalType":"address","name":"vow_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"}, ...];

    // Define functions for handling amount change and conversion
    const handleAmountChange = (event) => {
        amount = event.target.value;
    };

    const handleUSDCApprove = async () => {
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

    const convertUSDCtoDAI = async () => {
        await handleUSDCApprove(); // Make sure USDC is approved before conversion
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

    // Return HTML for the user interface
    return (
        '<div>' +
        '    <input type="number" onchange="handleAmountChange(event)" placeholder="Enter USDC amount" />' +
        '    <button onclick="convertUSDCtoDAI()">Convert to DAI</button>' +
        '</div>'
    );
};

// Export the ConversionModule function
module.exports = ConversionModule;

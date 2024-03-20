import React from 'react';

const ConversionModule = ({ amount, setAmount, onConvert }) => {
    return (
        <div>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter amount" 
            />
            <button onClick={onConvert}>Convert to DAI</button>
        </div>
    );
};

export default ConversionModule;


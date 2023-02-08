const Web3 = require('web3');
const abi = require('../abi.json');
require('dotenv').config();

async function getContractObject() {
    const web3 = new Web3(process.env.API_ENDPOINT + process.env.API_KEY);
    if (await web3.eth.net.isListening()) {
        return new web3.eth.Contract(abi, process.env.CONTRACT_PAIR);
    } else {
        throw('Web3 connection is down. Check API key validity or API endpoint.');
    }
};

function computeSwapReturn(amount, ethReserve, usdtReserve) {
    const reserveETH = ethReserve / (10 ** 18);
    const reserveUSDT = usdtReserve / (10 ** 6);
    const newUSDTPrice = reserveUSDT / (reserveETH + amount);

    return newUSDTPrice * amount;
}

module.exports = async function simulate(providedAmount) {
    const contract = await getContractObject();
    const { _reserve0, _reserve1 } = await contract.methods.getReserves().call();

    if (isNaN(_reserve0) || isNaN(_reserve1) || (_reserve0 / (10 ** 18)) < providedAmount) {
        throw('Failed to retrieve reserve from contract.');
    }

    const returnedAmount = computeSwapReturn(providedAmount, _reserve0, _reserve1);

    console.log(`Swap of ${providedAmount} ETH would return ${returnedAmount.toFixed(2)} USDT.`);

    return returnedAmount;
};
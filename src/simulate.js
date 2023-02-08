const Web3 = require('web3');
const abi = require('../abi.json');
require('dotenv').config();

/**
 * getContractObject: generate contract wrapper from ABI and endpoint info
 * @returns Contract wrapping the Uniswap contract methods
 */
async function getContractObject() {
    const web3 = new Web3(process.env.API_ENDPOINT + process.env.API_KEY);
    if (await web3.eth.net.isListening()) {
        return new web3.eth.Contract(abi, process.env.CONTRACT_PAIR);
    } else {
        throw('Web3 connection is down. Check API key validity or API endpoint.');
    }
};

/**
 * computeSwapReturn returns the amount of USDT obtained by swapping ETH
 * @param {number} amount amount to swap in ETH
 * @param {number} ethReserve amount in pool reserve in ETH 
 * @param {number} usdtReserve amount in pool reserve in USDT
 * @returns 
 */
function computeSwapReturn(amount, ethReserve, usdtReserve) {
    const amountWithFees = BigInt(0.997 * amount * (10 ** 18));
    const reserveETH = BigInt(ethReserve);
    const reserveUSDT = BigInt(usdtReserve);
    return (amountWithFees * reserveUSDT) / (reserveETH + amountWithFees);
}

/**
 * simulate: simulate the return in USDT from a provided amount in ETH
 * @param {number} providedAmount amount to swap in ETH
 * @returns 
 */
module.exports = async function simulate(providedAmount) {
    const contract = await getContractObject();
    const { _reserve0, _reserve1 } = await contract.methods.getReserves().call();

    if (isNaN(_reserve0) || isNaN(_reserve1) || (_reserve0 / (10 ** 18)) < providedAmount) {
        throw('Failed to retrieve reserve from contract.');
    }

    const returnedAmount = computeSwapReturn(providedAmount, _reserve0, _reserve1);

    console.log(`Swap of ${providedAmount} ETH would return ${(Number(returnedAmount) / (10 ** 6)).toFixed(2)} USDT.`);

    return returnedAmount;
};
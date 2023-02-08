const Web3 = require('web3');
const abi = require('./abi.json');
const argv = require('minimist')(process.argv);

require('dotenv').config();

async function getContractObject() {
    const web3 = new Web3(process.env.API_ENDPOINT + process.env.API_KEY);
    if (await web3.eth.net.isListening()) {
        return new web3.eth.Contract(abi, process.env.CONTRACT_PAIR);
    } else {
        throw('Web3 connection is down. Check API key validity or API endpoint.');
    }
};

async function simulate() {
    // Parsing provided amount of ETH to wei (18 decimals)
    let amount = parseInt(argv["amount"]);

    if (isNaN(amount)) {
        amount = 1;
    }

    console.log(`Provided amount: ${amount} ETH.`);

    const contract = await getContractObject();
    const { _reserve0, _reserve1 } = await contract.methods.getReserves().call();

    if (!isNaN(_reserve0) && !isNaN(_reserve1)) {
        const reserveETH = _reserve0 / (10 ** 18);
        const reserveUSDT = _reserve1 / (10 ** 6);
        console.log(`Pool reserves: ${reserveETH} ETH, ${reserveUSDT} USDT.`);
        const newUSDTPrice = reserveUSDT / (reserveETH + amount);
        console.log(`Swap of ${amount} ETH would return ${newUSDTPrice * amount} USDT.`);
    } else {
        throw('Failed to retrieve reserve from contract.');
    }
};

simulate();
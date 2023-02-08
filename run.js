const simulate = require('./src/simulate');
const argv = require('minimist')(process.argv);

try {
    let providedAmount = parseFloat(argv["amount"]);

    if (isNaN(providedAmount)) {
        providedAmount = 1;
    }

    simulate(providedAmount);
} catch (err) {
    console.error(err);
}
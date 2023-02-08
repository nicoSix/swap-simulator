var rewire = require("rewire");
var simulationRewire = rewire("../src/simulate.js");
var simulation = require("../src/simulate.js");

describe('Simulation script', () => {
    test('getContractObject should return Uniswap contract wrapper', async () => {
        const getContractObject = simulationRewire.__get__("getContractObject");
        const contract = await getContractObject();
        expect(contract).toBeTruthy();
        expect(typeof contract.methods.getReserves).toBe("function");
    });

    test('simulate should throw if provided amount too large', async () => {
        let throwed = false;
        
        try {
            await simulation(100000000);
        } catch (err) {
            throwed = true;
        }

        expect(throwed).toBeTruthy();
    });

    test('simulate should return an integer representing returned amount', async () => {
        expect(!isNaN(await simulation(100))).toBeTruthy();
    });
});
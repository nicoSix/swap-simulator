var rewire = require("rewire");
var simulation = rewire("../src/simulate.js");

describe('Simulation script', () => {
    test('getContractObject should return Uniswap contract wrapper', async () => {
        const getContractObject = simulation.__get__("getContractObject");
        const contract = await getContractObject();
        expect(contract).toBeTruthy();
        expect(typeof contract.methods.getReserves).toBe("function");
    });
});
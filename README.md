# Swap simulation

This program allows to simulate how much USDT would result from swapping ETH on Uniswap V2 ETH/USDT pool.

## Requirements

Make sure that Node is installed on your machine (v18).

## Setup

To install the required dependencies, simply execute the following command:

```
$ npm install
```

## Execute 

```
$ npm run simulate --amount 10 // simulate the price for swapping 10 ETH to USDT
$ npm run simulate // simulate by default the price of swapping 1 ETH
```

## Test

```
$ npm test
```
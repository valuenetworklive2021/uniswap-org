---
title: Factory
tags: smart-contracts, documentation
---

# Code

[`ValueswapV2Factory.sol`](https://github.com/valuenetworklive2021/valueswap-v2-core/blob/master/contracts/ValueswapV2Factory.sol)

# Address

`ValueswapV2Factory` is deployed at `0xF8CC7061b9286b16dF5909BF7969b50209A551E1` on the Ethereum [mainnet](https://etherscan.io/address/0xF8CC7061b9286b16dF5909BF7969b50209A551E1), and the [Ropsten](https://ropsten.etherscan.io/address/0xF8CC7061b9286b16dF5909BF7969b50209A551E1), [Rinkeby](https://rinkeby.etherscan.io/address/0xF8CC7061b9286b16dF5909BF7969b50209A551E1), [Görli](https://goerli.etherscan.io/address/0xF8CC7061b9286b16dF5909BF7969b50209A551E1), and [Kovan](https://kovan.etherscan.io/address/0xF8CC7061b9286b16dF5909BF7969b50209A551E1) testnets. It was built from commit [8160750](https://github.com/valuenetworklive2021/valueswap-v2-core).

# Events

## PairCreated

```solidity
event PairCreated(address indexed token0, address indexed token1, address pair, uint);
```

Emitted each time a pair is created via [createPair](#createpair).

- `token0` is guaranteed to be strictly less than `token1` by sort order.
- The final `uint` log value will be `1` for the first pair created, `2` for the second, etc. (see [allPairs](#allpairs)/[getPair](#getpair)).

# Read-Only Functions

## getPair

```solidity
function getPair(address tokenA, address tokenB) external view returns (address pair);
```

Returns the address of the pair for `tokenA` and `tokenB`, if it has been created, else `address(0)` (`0x0000000000000000000000000000000000000000`).

- `tokenA` and `tokenB` are interchangeable.
- Pair addresses can also be calculated deterministically, see <Link to='/docs/v2/javascript-SDK/getting-pair-addresses/'>Pair Addresses</Link>.

## allPairs

```solidity
function allPairs(uint) external view returns (address pair);
```

Returns the address of the `n`th pair (`0`-indexed) created through the factory, or `address(0)` (`0x0000000000000000000000000000000000000000`) if not enough pairs have been created yet.

- Pass `0` for the address of the first pair created, `1` for the second, etc.

## allPairsLength

```solidity
function allPairsLength() external view returns (uint);
```

Returns the total number of pairs created through the factory so far.

## feeTo

```solidity
function feeTo() external view returns (address);
```

See <Link to='/docs/v2/advanced-topics/fees/#protocol-charge-calculation'>Protocol Charge Calculation</Link>.

## feeToSetter

```solidity
function feeToSetter() external view returns (address);
```

The address allowed to change [feeTo](#feeto).

# State-Changing Functions

## createPair

```solidity
function createPair(address tokenA, address tokenB) external returns (address pair);
```

Creates a pair for `tokenA` and `tokenB` if one doesn't exist already.

- `tokenA` and `tokenB` are interchangeable.
- Emits [PairCreated](#paircreated).

# Interface

```solidity
import '@valueswap/v2-core/contracts/interfaces/IValueswapV2Factory.sol';
```

```solidity
pragma solidity >=0.5.0;

interface IValueswapV2Factory {
  event PairCreated(address indexed token0, address indexed token1, address pair, uint);

  function getPair(address tokenA, address tokenB) external view returns (address pair);
  function allPairs(uint) external view returns (address pair);
  function allPairsLength() external view returns (uint);

  function feeTo() external view returns (address);
  function feeToSetter() external view returns (address);

  function createPair(address tokenA, address tokenB) external returns (address pair);
}
```

# ABI

```typescript
import IValueswapV2Factory from '@valueswap/v2-core/build/IValueswapV2Factory.json'
```

[https://unpkg.com/@valueswap/v2-core@1.0.2/build/IValueswapV2Factory.json](https://unpkg.com/@valueswap/v2-core@1.0.2/build/IValueswapV2Factory.json)

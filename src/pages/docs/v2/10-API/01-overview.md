---
title: API Overview
tags: api, documentation
---

This section explains the Valueswap Subgraph and how to interact with it. The Valueswap subgraph indexes data from the Valueswap contracts over time. It organizes data about pairs, tokens, Valueswap as a whole, and more. The subgraph updates any time a transaction is made on Valueswap. The subgraph runs on [The Graph](https://thegraph.com/) protocol's hosted service and can be openly queried.

## Resources

[Subgraph Explorer](https://thegraph.com/explorer/subgraph/valueswap/valueswap-v2) - sandbox for querying data and endpoints for developers.

[Valueswap V2 Subgraph](https://github.com/valuenetworklive2021/valueswap-v2-subgraph) - source code for deployed subgraph.

## Usage

The subgraph provides a snapshot of the current state of Valueswap and also tracks historical data. It is currently used to power [info.valueswap.valuenetwork.live](https://info.valueswap.valuenetwork.live/). **It is not intended to be used as a data source for structuring transactions (contracts should be referenced directly for the most reliable live data).**

## Making Queries

To learn more about querying a subgraph refer to [The Graph's documentation](https://thegraph.com/docs/introduction).

## Versions

The [Valueswap V2 Subgraph](https://thegraph.com/explorer/subgraph/valueswap/valueswap-v2) only tracks data on Valueswap V2. For Valueswap V1 information see the [V1 Subgraph](https://thegraph.com/explorer/subgraph/graphprotocol/valueswap).

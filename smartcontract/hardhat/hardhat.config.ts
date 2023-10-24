import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { Web3 } from 'Web3';
import path from 'path';
import '@nomiclabs/hardhat-ganache';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
      loggingEnabled: true
    },
    besu: {
      url: "http://bank1rpc.bes.demo.aws.blockchaincloudpoc.com",
    }
  },
  etherscan: {
    apiKey: 'aoCR7fSCwTn1M7XfqI5EI9iYnO7omo1X'
  }
};

export default config;

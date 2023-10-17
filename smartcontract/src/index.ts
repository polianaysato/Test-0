import { Web3 } from 'web3';
// import Web3Quorum from 'web3js-quorum';
import path from 'path';
import fs from 'fs';

import * as compile from './compile'; 
// @ts-ignore
import minimist from 'minimist';
import dotenv from 'dotenv';
dotenv.config();

let args = minimist(process.argv.slice(2));
const rpcURL = args['rpcURL']; 
const contractPath = args['contractPath'];
const contractName = args['contractName']; 

const privateKey = args['privateKey'];
const outputFolder = args['output'] == true ? args['output'] : './build';


args['v'] && console.log(`Creating a web3 provider.......`);

const main = async () => {
  try {
    console.log('[INFO] Running script to execute smart contract deployment');
    await compile.compile(contractPath, contractName);
    
    const contractsDir = path.join(path.dirname(contractPath), 'artifacts', `${contractName}.json`);
    if (!fs.existsSync(contractsDir)) {
      console.error(`[ERR] Contract JSON file is missing in path:${contractsDir}`);
      process.exit(1);
    }
    const contractFile = fs.readFileSync(contractsDir, 'utf8');
    const contractJSON = JSON.parse(contractFile);
    const contractABI = contractJSON.abi;

    const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
 
    const accountA = web3.eth.accounts.privateKeyToAccount('0xca5397e05c147420686183cfeb8dc3513bc2f7848e841087a5c197bd91737a56');
    const contract = new web3.eth.Contract(contractABI);

    const txnCount = await web3.eth.getTransactionCount(accountA.address); // to set nounce
    console.log('[INFO] the txn count ' + txnCount);
    console.log('[INFO] create and sign the txn');
    // @ts-ignore
    const bytecodeWithInitParam = contract.deploy({ data: contractJSON.bytecode, arguments: [5] }).encodeABI();
    const txn = {
      chainId: 2018,
      nonce: web3.utils.numberToHex(txnCount),
      from: accountA.address,
      to: null,
      value: '0x00',
      data: bytecodeWithInitParam,
      gasPrice: '0x00',
      gasLimit: '0x038D7EA4C68000',
    };
    const signedTx = await web3.eth.accounts.signTransaction(txn, privateKey);
    console.log('sending the txn');
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('[INFO] tx transactionHash: ' + txReceipt.transactionHash);
    console.log('[INFO] tx contractAddress: ' + txReceipt.contractAddress);
    return txReceipt.contractAddress;
  } catch (err) {
    console.log('[ERR] Script execution failed', err);
    process.exit(1);
  }
};

main();
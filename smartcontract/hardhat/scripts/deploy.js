
const Web3 = require('web3');
const fs = require('fs');
// import { Web3 } from 'Web3';
// import fs from 'fs';

const host = 'http://bank1rpc.bes.demo.aws.blockchaincloudpoc.com';
const privateKeyA = '0x66ba6bb87060617637d2c423686dfd9f8cb63680033512b2343664c611254c4e';
  
async function main() {
  const web3 = new Web3(new Web3.providers.HttpProvider(privateKeyA));
  const abi = JSON.parse(fs.readFileSync('../artifacts/contracts/Lock.sol/Lock.json').toString());
  //pre seeded account - test account only
  const contract = new web3.eth.Contract(abi.abi);

  const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
  // @ts-ignore
  const deployTx = contract.deploy({ data: abi.bytecode, arguments: [ 5 ] });
  deployTx.send({
    from: accountA.address,
    gas: '1500000',
    gasPrice: web3.utils.toWei('0.00003', 'ether')
     })
     .then((newContractInstance) => {
       contract.options.address = newContractInstance.options.address;
       console.log(contract.options.address, 'options');
     });
}

main();

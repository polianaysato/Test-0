import { Web3 } from 'Web3';
import fs from 'fs';
import path from 'path';

const host = 'http://bank1rpc.bes.demo.aws.blockchaincloudpoc.com/';

async function main() {
  const web3 = new Web3(host);
  const pathDir = path.join(__dirname, '..', 'artifacts/contracts/Lock.sol', 'Lock.json');
  const abi = JSON.parse(fs.readFileSync(pathDir).toString());
  //pre seeded account - test account only
  const contract = new web3.eth.Contract(abi.abi, '0x23949e4A6AAe363c1659742dE024a3966B861CcD');
  console.log(pathDir, 'pATH');
  // @ts-ignore
  const deployTx = contract.deploy({ data: abi.bytecode, arguments: [1234] });
  const hexData = deployTx.encodeABI();
  const privateKeyA = '0x66ba6bb87060617637d2c423686dfd9f8cb63680033512b2343664c611254c4e';

  const privateKeyB = '0x7c13ffa34049e85e1ce7697c58f81d4fbd7d2ce9362918dd2b9e604b94fb56a6';
  const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
  const accountB = web3.eth.accounts.privateKeyToAccount(privateKeyB);
  let accountBalanceA = web3.utils.fromWei(await web3.eth.getBalance(accountA.address), 'ether');
  console.log('Account A has balance of: ' + accountBalanceA);
  console.log('contract address: ', accountA.address);
  console.log('account A: ', accountA);

  // @ts-ignore

  const get = async () => {
    console.log(`Making a call to contract at address 0x77Dbe8CF7032449eeA033B9378eD71bE8e494862`);
    try {
      // @ts-ignore
      const data = await contract.methods.withdraw().call();
      console.log(`The current number stored is: ${data}`);
    } catch (e) {
      console.log('error: ' + e);
    }
  };

  get();

  // create a new account to use to transfer eth to

  let accountBalanceB = web3.utils.fromWei(await web3.eth.getBalance(accountB.address), 'ether');
  console.log('Account B has balance of: ' + accountBalanceB);

  // send some eth from A to B
  const txn = {
    nonce: web3.utils.numberToHex(await web3.eth.getTransactionCount(accountA.address)),
    from: accountA.address,
    to: accountB.address,
    data: hexData,
    value: '0x010', //amount of eth to transfer
    gasPrice: '678', //ETH per unit of gas
    gasLimit: '0x038D7EA4C68000' //max number of gas units the tx is allowed to use
  };

  console.log('transaction: ', txn);

  console.log('create and sign the txn');
  const signedTx = await web3.eth.accounts.signTransaction(txn, accountA.privateKey);
  console.log('sending the txn');
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log('tx transactionHash: ' + txReceipt.transactionHash);
  const receipt = await web3.eth.getTransactionReceipt(txReceipt.transactionHash);

  //After the transaction there should be some ETH transferred
  accountBalanceA = web3.utils.fromWei(await web3.eth.getBalance(accountA.address), 'ether');
  console.log('Account A has an updated balance of: ' + accountBalanceA);
  accountBalanceB = web3.utils.fromWei(await web3.eth.getBalance(accountB.address), 'ether');
  console.log('Account B has an updated balance of: ' + accountBalanceB);
}

if (require.main === module) {
  main();
}

module.exports = exports = main;

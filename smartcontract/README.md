#Script to deploy smart contract to any network using web3js

This script uses web3js to deploy any smart contract to a network. A sample Greetor.sol contract and its ABI can be found in contracts folder, which is deployed to a RPC_ENDPOINT and a sample account private key PRIVATE_KEY, both these values are configured in .env file. 

```To execute the script:
cd smartcontract
npm install
npm run dev

Making a call to contract at address 0x77Dbe8CF7032449eeA033B9378eD71bE8e494862
Account B has balance of: 0.000000000000000032
create and sign the txn
error: AbiError: Parameter decoding error: Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.
sending the txn
tx transactionHash: 0x3e026877bd9677fa1b6b147923d1dec745a575bb3c6980adb06d142c42b7a52c
Account A has an updated balance of: 0.99999999990174148
Account B has an updated balance of: 0.000000000000000048

```

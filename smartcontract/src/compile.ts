import { Web3 } from 'web3';
// import Web3Quorum from 'web3js-quorum';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import solc from 'solc';


export const compile = async (contractPath: string, contractName: string) => {
    try {
        console.log('[INFO] Running script to execute smart contract deployment');
        const contractsDir = path.join(contractPath, `${contractName}.sol`);
        
        if (!fs.existsSync(contractsDir)) {
            console.error(`[ERR] Contract JSON file is missing in path:${contractsDir}`);
            process.exit(1);
        }
        const sourceCode = fs.readFileSync(contractsDir, "utf8");
        const { abi, bytecode } = await getAbiAndBytecode(sourceCode, contractName);

        const artifact = JSON.stringify({ abi, bytecode }, null, 2);
        fs.mkdirSync('artifacts');
        // @ts-ignore
        fs.writeFileSync(`artifacts/${contractName}.json`, artifact, () => {});
    } catch (err) {
        console.log('[ERR] Script execution failed', err);
        process.exit(1);
    }
}

// @ts-ignore
const getAbiAndBytecode = async (sourceCode, contractName) => {
    const input = {
        language: "Solidity",
        sources: { main: { content: sourceCode } },
        settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
    };

    const output = solc.compile(JSON.stringify(input));
    const artifact = JSON.parse(output).contracts.main[contractName];
    return {
        abi: artifact.abi,
        bytecode: artifact.evm.bytecode.object,
    };
}
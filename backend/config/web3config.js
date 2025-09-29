import Web3 from "web3";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


const studentRegistryABI = JSON.parse(fs.readFileSync("./abis/studentRegistry.json", "utf8"));
const verifiedInstitutesABI = JSON.parse(fs.readFileSync("./abis/verifiedInstitutions.json", "utf8"));
const certificatesABI=JSON.parse(fs.readFileSync("./abis/certificates.json","utf8"));

const web3 = new Web3(process.env.ALCHEMY_API_URL);

let pk = process.env.PRIVATE_KEY;

// Ensure it has "0x" prefix
if (!pk.startsWith("0x")) {
  pk = "0x" + pk;
}

const account = web3.eth.accounts.privateKeyToAccount(pk);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;



const verified_contract = new web3.eth.Contract(verifiedInstitutesABI, process.env.VERIFIED_CONTRACT_ADDRESS);
const  student_registry= new web3.eth.Contract(studentRegistryABI, process.env.STUDENT_REGISTRY_CONTRACT_ADDRESS);
const  certificates= new web3.eth.Contract(certificatesABI, process.env.CERTIFICATE_CONTRACT_ADDRESS);

console.log("✅ Using blockchain account:", account.address);
console.log("✅ Connected to contract at:", process.env.VERIFIED_CONTRACT_ADDRESS);
console.log("✅ Connected to contract at:", process.env.CERTIFICATE_CONTRACT_ADDRESS);
console.log("✅ Connected to contract at:", process.env.STUDENT_REGISTRY_CONTRACT_ADDRESS);
const chainId = await web3.eth.getChainId();
console.log("Connected to chain:", chainId); // should log 11155111 for Sepolia


export { web3, verified_contract,student_registry,certificates,account };
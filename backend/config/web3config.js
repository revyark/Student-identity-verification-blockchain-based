import Web3 from "web3";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


const studentRegistryABI = JSON.parse(fs.readFileSync("./abis/studentRegistry.json", "utf8"));
const verifiedInstitutesABI = JSON.parse(fs.readFileSync("./abis/verifiedInstitutions.json", "utf8"));
const certificatesABI=JSON.parse(fs.readFileSync("./abis/certificates.json","utf8"));

const web3 = new Web3(process.env.ALCHEMY_API_URL);

// Admin account (for contract management)
let adminPk = process.env.PRIVATE_KEY;
if (!adminPk.startsWith("0x")) {
  adminPk = "0x" + adminPk;
}
const account = web3.eth.accounts.privateKeyToAccount(adminPk);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Institute account (for issuing credentials)
let institutePk = process.env.INSTITUTE_PRIVATE_KEY;
if (!institutePk.startsWith("0x")) {
  institutePk = "0x" + institutePk;
}
const instituteAccount = web3.eth.accounts.privateKeyToAccount(institutePk);
web3.eth.accounts.wallet.add(instituteAccount);



const verified_contract = new web3.eth.Contract(verifiedInstitutesABI, process.env.VERIFIED_CONTRACT_ADDRESS);
const  student_registry= new web3.eth.Contract(studentRegistryABI, process.env.STUDENT_REGISTRY_CONTRACT_ADDRESS);
const  certificates= new web3.eth.Contract(certificatesABI, process.env.CERTIFICATE_CONTRACT_ADDRESS);

console.log("✅ Using admin account:", account.address);
console.log("✅ Using institute account:", instituteAccount.address);
console.log("✅ Connected to contract at:", process.env.VERIFIED_CONTRACT_ADDRESS);
console.log("✅ Connected to contract at:", process.env.CERTIFICATE_CONTRACT_ADDRESS);
console.log("✅ Connected to contract at:", process.env.STUDENT_REGISTRY_CONTRACT_ADDRESS);
const chainId = await web3.eth.getChainId();
console.log("Connected to chain:", chainId); // should log 11155111 for Sepolia


export { web3, verified_contract,student_registry,certificates,account,instituteAccount };
import Web3 from 'web3';
let web3;
const initWeb3=async()=>{
    if (window.ethereum){
        try{
            await window.ethereum.request({method:'eth_requestAccounts'});
            web3=new Web3(window.ethereum);
            return web3;
        } catch(error){
            console.error("User denied wallet access",error)
        }
    } else{
        alert("Please install MetaMask to use this DApp!");
    }
};

export default initWeb3;

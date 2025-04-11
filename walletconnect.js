import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";

// --- WalletConnect AppKit Configuration ---
const projectId = "15da3c431a74b29edb63198a503d45b5";
const chains = [1, 137]; // Ethereum Mainnet, Polygon (customize as needed)

const metadata = {
  name: "FunFart Grab",
  description: "Mint NFTs after winning the game!",
  url: "https://yourgameurl.com",
  icons: ["https://yourgameurl.com/icon.png"]
};

// Init WalletConnect Modal
const ethereumClient = new EthereumClient(w3mProvider({ chains }), chains);
const web3Modal = new Web3Modal({ projectId, themeMode: "light", themeColor: "purple", metadata }, ethereumClient);

const CONTRACT_ADDRESS = "0x7eFC729a41FC7073dE028712b0FB3950F735f9ca";
const CONTRACT_ABI = [
  "function mintPrize() public"
];

export async function connectWallet() {
  try {
    const provider = await web3Modal.openModal(); // opens QR modal if not connected
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    await web3Provider.send("eth_requestAccounts", []);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    console.log("🔌 Wallet connected:", address);
    return { provider: web3Provider, signer, address };
  } catch (error) {
    console.error("Connection failed:", error);
    alert("Failed to connect wallet.");
    return null;
  }
}

export async function mintPrizeNFT() {
  const wallet = await connectWallet();
  if (!wallet) return;

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet.signer);
    const tx = await contract.mintPrize();
    await tx.wait();
    alert("🎉 NFT Minted Successfully!");
  } catch (error) {
    console.error("Minting error:", error);
    alert("Minting failed: " + (error.message || error));
  }
}

import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";

// --- WalletConnect AppKit Configuration ---
const projectId = "15da3c431a74b29edb63198a503d45b5";

const chains = [
  {
    id: 1, // Ethereum Mainnet
    name: "Ethereum",
    rpcUrls: ["https://rpc.ankr.com/eth"] // Optional: Replace with your own RPC if needed
  },
  {
    id: 137, // Polygon Mainnet
    name: "Polygon",
    rpcUrls: ["https://polygon-rpc.com"]
  }
];

const metadata = {
  name: "FunFart Grab",
  description: "Mint NFTs after winning the game!",
  url: "https://yourgameurl.com",
  icons: ["https://yourgameurl.com/icon.png"]
};

// --- Init WalletConnect Modal ---
const ethereumClient = new EthereumClient(w3mProvider({ projectId, chains }), chains);
const web3Modal = new Web3Modal({ projectId, themeMode: "light", themeColor: "purple", metadata }, ethereumClient);

// --- Contract Details ---
const CONTRACT_ADDRESS = "0x7eFC729a41FC7073dE028712b0FB3950F735f9ca";
const CONTRACT_ABI = [
  "function mintPrize() public"
];

// --- Connect Wallet ---
export async function connectWallet() {
  try {
    await web3Modal.openModal();
    await new Promise(resolve => {
      const checkConnected = setInterval(() => {
        if (web3Modal.getState().selectedNetworkId) {
          clearInterval(checkConnected);
          resolve();
        }
      }, 250);
    });

    const injectedProvider = await ethereumClient.getProvider();
    const web3Provider = new ethers.providers.Web3Provider(injectedProvider);
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

// --- Mint NFT Function ---
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

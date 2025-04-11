// walletConnect.js
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import EthereumProvider from "@walletconnect/ethereum-provider";

const CONTRACT_ADDRESS = "0x7eFC729a41FC7073dE028712b0FB3950F735f9ca";
const CONTRACT_ABI = [
  "function mintPrize() public"
];

let provider;

export async function connectWallet() {
  try {
    provider = await EthereumProvider.init({
      projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // 🔑 You need to register at WalletConnect Cloud
      chains: [137], // Polygon Mainnet (use 80001 for Mumbai testnet)
      showQrModal: true,
    });

    await provider.enable();

    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    console.log("🔗 WalletConnect Connected:", address);
    return { provider: web3Provider, signer, address };

  } catch (err) {
    console.error("❌ WalletConnect connection failed:", err);
    alert("WalletConnect connection failed.");
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
    console.error("❌ Minting error:", error);
    alert("Minting failed: " + (error.message || error));
  }
}

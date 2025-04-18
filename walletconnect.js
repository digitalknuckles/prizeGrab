// walletConnect.js
import { Web3Modal } from '@walletconnect/modal';
import { ethers } from 'ethers';

const projectId = "15da3c431a74b29edb63198a503d45b5";

const metadata = {
  name: "FunFart Grab",
  description: "Mint NFTs after winning the game!",
  url: "https://digitalknuckles.github.io/MoveToMint/",
  icons: ["https://digitalknuckles.github.io/MoveToMint/icon.png"]
};

const web3Modal = new Web3Modal({
  projectId,
  metadata,
  themeMode: 'light'
});

async function connectWallet() {
  try {
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    console.log("🔌 Wallet connected:", address);
    return { provider: web3Provider, signer, address };
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    alert("❌ Failed to connect wallet: " + (err.message || err));
    return null;
  }
}

async function mintPrizeNFT() {
  const wallet = await connectWallet();
  if (!wallet) return;

  try {
    const contract = new ethers.Contract(
      "0x7eFC729a41FC7073dE028712b0FB3950F735f9ca",
      [
        {
          inputs: [],
          name: "mintPrize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ],
      wallet.signer
    );

    const tx = await contract.mintPrize();
    await tx.wait();
    alert("🎉 NFT Minted Successfully!");
  } catch (err) {
    console.error("❌ Minting failed:", err);
    alert("❌ Minting failed: " + (err.reason || err.message || err));
  }
}

export { connectWallet, mintPrizeNFT };

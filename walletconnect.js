// walletConnect.js

const CONTRACT_ADDRESS = "0x7eFC729a41FC7073dE028712b0FB3950F735f9ca";
const CONTRACT_ABI = [
  "function mintPrize() public"
];

export async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("🦊 Connected wallet:", address);
      return { provider, signer, address };
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet.");
      return null;
    }
  } else {
    alert("MetaMask not detected.");
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
    alert("NFT Minted Successfully!");
  } catch (error) {
    console.error("Minting error:", error);
    alert("Minting failed: " + (error.message || error));
  }
}

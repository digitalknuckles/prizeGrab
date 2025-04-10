// walletConnect.js
// Make sure ethers.js is included in your HTML via CDN or bundler

// Your deployed contract address (Polygon/Base)
const CONTRACT_ADDRESS = "0x7eFC729a41FC7073dE028712b0FB3950F735f9ca";

// Minimal ABI containing the mintPrize() method
const CONTRACT_ABI = [
  "function mintPrize() public"
];

/**
 * Connects to MetaMask and returns the provider, signer, and wallet address.
 */
async function connectWallet() {
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
      alert("Failed to connect wallet. Please try again.");
      return null;
    }
  } else {
    alert("MetaMask not detected. Please install MetaMask to continue.");
    return null;
  }
}

/**
 * Calls the 'mintPrize()' function on your NFT contract.
 */
async function mintPrizeNFT() {
  const wallet = await connectWallet();
  if (!wallet) return;

  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet.signer);

  try {
    const tx = await contract.mintPrize();
    console.log("Minting transaction submitted:", tx.hash);
    await tx.wait();
    alert("🎉 Your prize NFT has been minted!");
  } catch (err) {
    console.error("Mint failed:", err);
    alert("Minting failed. See console for details.");
  }
}

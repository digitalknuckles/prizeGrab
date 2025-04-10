// walletConnect.js

// Ensure ethers is globally available
// Assumes you're using the CDN or have bundled ethers separately

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("Connected wallet:", address);
    return { provider, signer, address };
  } else {
    alert("MetaMask not detected. Please install MetaMask.");
    return null;
  }
}

async function mintPrizeNFT(contractAddress, abi) {
  const wallet = await connectWallet();
  if (!wallet) return;

  const contract = new ethers.Contract(contractAddress, abi, wallet.signer);

  try {
    const tx = await contract.mint(); // or your minting method name
    await tx.wait();
    alert("Mint successful!");
  } catch (err) {
    console.error("Mint failed:", err);
    alert("Minting failed. Check console.");
  }
}

import React, { useEffect, useState } from "react";
import { BrowserProvider, formatEther } from "ethers";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";

export default function Home() {
  const { user } = useAuth();
  const getUser = useUser();
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  /**
   * This useEffect hook handles fetching the logged-in user's information and their Ethereum wallet balance
   * when the component is rendered or when the `getUser` function changes.
   *
   * This useEffect hook is responsible for:
   * 1. Fetching the logged-in user's information via the `getUser` function.
   * 2. If the user has an Ethereum wallet address, it retrieves their Ethereum balance.
   *
   * The `fetchUserData` function:
   * - Fetches user data and checks if a wallet address exists.
   * - If a wallet address is found, it triggers `fetchEthereumBalance`.
   *
   * The `fetchEthereumBalance` function:
   * - Checks for the presence of an Ethereum provider (e.g., MetaMask) via `window.ethereum`.
   * - If a provider is available, it fetches and formats the user's Ethereum balance using ethers.js.
   * - Handles cases where no provider is available by setting an appropriate error message.
   *
   * Error handling:
   * - Logs errors and sets user-friendly error messages if fetching data or balance fails.
   *
   * Dependency:
   * - The hook depends on `getUser`, ensuring the latest user data and balance are fetched whenever `getUser` changes.
   */

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUser();
        setWalletAddress(userData?.wallet_address);

        if (userData?.wallet_address) {
          fetchEthereumBalance(userData.wallet_address);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    async function fetchEthereumBalance(address) {
      try {
        // Check if an Ethereum provider exists
        if (typeof window.ethereum !== "undefined") {
          const provider = new BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(address);
          const formattedBalance = formatEther(balance);
          setBalance(formattedBalance);
        } else {
          setError("No Ethereum provider detected. Please install MetaMask.");
        }
      } catch (error) {
        console.error("Error fetching Ethereum balance:", error);
        setError("Failed to fetch Ethereum balance. Please try again.");
      }
    }

    fetchUserData();
  }, [getUser]);

  return (
    <div className="container mt-3">
      <h2>
        <div className="row">
          <div className="mb-12">
            {error && <p className="text-danger">{error}</p>}
            {user?.email !== undefined ? (
              <>
                <p>Your Ethereum Wallet Address: {walletAddress}</p>
                <p>
                  Your Ethereum Balance:{" "}
                  {balance !== null ? `${balance} ETH` : "Fetching balance..."}
                </p>
              </>
            ) : (
              "Please login first"
            )}
          </div>
        </div>
      </h2>
    </div>
  );
}

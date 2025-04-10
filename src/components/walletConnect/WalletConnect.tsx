"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // Import dynamic
import { ethers } from "ethers";
import Card from "components/card/Card";
import { Button, Stat, StatLabel, useToast, VStack , Radio, RadioGroup, Stack,} from "@chakra-ui/react";

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

interface WalletConnectProps {
  onWalletSelect: (wallet: 'metamask' | 'tronlink' | 'solana') => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletSelect }) => {
  const [metaMaskAddress, setMetaMaskAddress] = useState<string | null>(null);
  const [tronAddress, setTronAddress] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'tronlink' | 'solana'>('metamask');
  const toast = useToast()

  const shortenAddress = (address: string | null, len: number): string => {
    if (!address) return "";
    return `${address.substring(0, len)}...`;
  };



  const connectMetaMask = async () => {
    if (typeof window === "undefined") return;
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setMetaMaskAddress(accounts[0]);
      } catch (error) {
        console.log("MetaMask Connection Failed: ", error);
        toast({
          title: "MetaMask Connection Failed",
          description: String(error),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      alert("MetaMask should be installed");
    }
  };

  const connectTronLink = async () => {
    if (typeof window === "undefined") {
      console.error("window undefined");
      return;
    }

    // Check if TronLink is available
    if (!window.tronWeb || !window.tronLink) {
      alert("TronLink is not installed");
      toast({
        title: "TronLink Not Detected",
        description: "Please install the TronLink extension.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Prompt TronLink to connect accounts
      await window.tronLink.request({ method: 'tron_requestAccounts' });

      // Now tronWeb.ready should be true
      if (!window.tronWeb.ready) {
        toast({
          title: "TronLink Not Ready",
          description: "Please unlock your wallet and try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      // Use adapter connection method
      // await connectTron();
      setTronAddress(window.tronWeb.defaultAddress.base58)
    } catch (error) {
      console.error("TronLink connection failed: ", error);
    }
  };

  const disconnectTronLink = async () => {
    try {
      // await disconnectTron();
      setTronAddress(null);
      toast({
        title: "TronLink Disconnected",
        description: "Disconnected from TronLink.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("TronLink disconnection failed:", error);
    }
  };

  useEffect(() => {
    connectMetaMask();
    connectTronLink();
    // connectSolana();
  }, []);

  const handleWalletChange = (value: string) => {
    const wallet = value as 'metamask' | 'tronlink' | 'solana';
    setSelectedWallet(wallet);
    onWalletSelect(wallet);
  };

  return (
    <Card mb={20}>
      <Stat><StatLabel color='secondaryGray.600' fontSize={{base: 'md'}}>Wallet Integration</StatLabel></Stat>
      <VStack align="left">
        <Button 
          variant="darkBrand"
          w="170px"
          color={metaMaskAddress?"white": "red"}
          fontSize="sm"
          fontWeight="500"
          borderRadius="5px"
          px="24px"
          py="5px"
          onClick={connectMetaMask}>
          {metaMaskAddress ? "MetaMask: "+shortenAddress(metaMaskAddress, 7) : "Connect MetaMask"}
        </Button>
        <Button 
          variant="darkBrand"
          w="170px"
          color={tronAddress?"white": "red"}
          fontSize="sm"
          fontWeight="500"
          borderRadius="5px"
          px="24px"
          py="5px" 
          onClick={tronAddress ? disconnectTronLink : connectTronLink}>
          {tronAddress ? "TronLink: "+shortenAddress(tronAddress, 7) : "Connect TronLink"}
        </Button>
        <WalletMultiButton />
        <RadioGroup onChange={handleWalletChange} value={selectedWallet}>
          <Stack direction="row" spacing={4}>
            <Radio value="metamask">MetaMask</Radio>
            <Radio value="tronlink">TronLink</Radio>
            <Radio value="solana">Solana</Radio>
          </Stack>
        </RadioGroup>
      </VStack>
    </Card>
  );
};

export default WalletConnect;
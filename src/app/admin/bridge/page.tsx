"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Box,
  Heading,
  Select,
  Input,
  Button,
  Text,
  VStack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

export default function BridgePage() {
  const [sourceChain, setSourceChain] = useState("ethereum");
  const [destChain, setDestChain] = useState("tron");
  const [amount, setAmount] = useState("");
  const [metaMaskAddress, setMetaMaskAddress] = useState<string | null>(null);
  const [tronAddress, setTronAddress] = useState<string | null>(null);
  const [isBridging, setIsBridging] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  // Connect MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setMetaMaskAddress(accounts[0]);
        toast({
          title: "MetaMask Connected",
          description: `Address: ${accounts[0]}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "MetaMask Connection Failed",
          description: String(error),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "MetaMask Not Detected",
        description: "Please install MetaMask extension.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Connect TronLink
  const connectTronLink = async () => {
    if (window.tronWeb) {
      try {
        const tronWeb = window.tronWeb;
        const address = tronWeb.defaultAddress.base58;
        setTronAddress(address);
        toast({
          title: "TronLink Connected",
          description: `Address: ${address}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "TronLink Connection Failed",
          description: String(error),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "TronLink Not Detected",
        description: "Please install TronLink extension.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Simulate bridging process
  const handleBridge = async () => {
    if (!metaMaskAddress || !tronAddress || !amount) {
      toast({
        title: "Missing Information",
        description: "Please connect both wallets and enter an amount.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsBridging(true);
    try {
      if (sourceChain === "ethereum") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        // Simulate ERC-20 transfer (e.g., USDT approval to a bridge contract)
        const tx = await signer.sendTransaction({
          to: "0x...bridgeContractAddress", // Replace with actual bridge contract
          value: ethers.parseEther("0"), // No ETH, just triggering wallet
          data: "0x...", // Replace with actual ERC-20 approval calldata
        });
        await tx.wait();
        toast({
          title: "Bridge Initiated",
          description: `From Ethereum to Tron: ${amount} USDT`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const tronWeb = window.tronWeb;
        // Simulate TRC-20 transfer (e.g., USDT to bridge contract)
        const tx = await tronWeb.transactionBuilder.sendToken(
          "T...bridgeContractAddress", // Replace with actual Tron bridge contract
          Number(amount) * 10 ** 6, // USDT has 6 decimals
          "T...usdtContractAddress", // Replace with TRC-20 USDT contract
          tronAddress
        );
        const signedTx = await tronWeb.trx.sign(tx);
        await tronWeb.trx.sendRawTransaction(signedTx);
        toast({
          title: "Bridge Initiated",
          description: `From Tron to Ethereum: ${amount} USDT`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Bridging Failed",
        description: String(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsBridging(false);
    }
  };

  // Auto-connect wallets on mount
  useEffect(() => {
    connectMetaMask();
    connectTronLink();
  }, []);

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      <Heading mb={6}>Coin Bridge</Heading>
      <VStack spacing={4} align="stretch">
        <Text color={textColor}>Source Chain</Text>
        <Select
          value={sourceChain}
          onChange={(e) => {
            setSourceChain(e.target.value);
            setDestChain(e.target.value === "ethereum" ? "tron" : "ethereum");
          }}
        >
          <option value="ethereum">Ethereum (ERC-20)</option>
          <option value="tron">Tron (TRC-20)</option>
        </Select>

        <Text color={textColor}>Destination Chain</Text>
        <Select value={destChain} isDisabled>
          <option value="ethereum">Ethereum (ERC-20)</option>
          <option value="tron">Tron (TRC-20)</option>
        </Select>

        <Text color={textColor}>Amount (USDT)</Text>
        <Input
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          color={textColor}
        />

        <Button
          colorScheme="blue"
          onClick={handleBridge}
          isLoading={isBridging}
          isDisabled={!metaMaskAddress || !tronAddress || !amount}
        >
          Bridge Tokens
        </Button>

        {metaMaskAddress && (
          <Text color={textColor}>MetaMask: {metaMaskAddress}</Text>
        )}
        {tronAddress && (
          <Text color={textColor}>TronLink: {tronAddress}</Text>
        )}
      </VStack>
    </Box>
  );
}
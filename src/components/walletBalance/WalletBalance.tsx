'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import Card from 'components/card/Card';

interface WalletBalanceProps {
  selectedWallet: 'metamask' | 'tronlink' | 'solana';
}

export default function WalletBalance({ selectedWallet }: WalletBalanceProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();

  // Fetch Ethereum balance
  const getEthBalance = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        if (accounts.length > 0) {
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));
        }
      } catch (error) {
        console.error('Error fetching ETH balance:', error);
      }
    }
  };

  // Fetch Tron balance
  const getTronBalance = async () => {
    if (window.tronWeb && window.tronWeb.defaultAddress) {
      try {
        const balance = await window.tronWeb.trx.getBalance();
        setBalance(window.tronWeb.fromSun(balance)); // Convert from SUN to TRX
      } catch (error) {
        console.error('Error fetching TRON balance:', error);
      }
    }
  };

  // Fetch Solana balance
  const getSolBalance = async () => {
    if (publicKey) {
      try {
        const connection = new Connection('https://api.devnet.solana.com'); // Use mainnet-beta for production
        const balance = await connection.getBalance(new PublicKey(publicKey));
        setBalance((balance / 1e9).toFixed(2)); // Convert from lamports to SOL
      } catch (error) {
        console.error('Error fetching SOL balance:', error);
      }
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      switch (selectedWallet) {
        case 'metamask':
          await getEthBalance();
          break;
        case 'tronlink':
          await getTronBalance();
          break;
        case 'solana':
          await getSolBalance();
          break;
      }
      setLoading(false);
    };

    fetchBalance();

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [selectedWallet, publicKey]);

  const getWalletName = () => {
    switch (selectedWallet) {
      case 'metamask':
        return 'Ethereum (ETH)';
      case 'tronlink':
        return 'Tron (TRX)';
      case 'solana':
        return 'Solana (SOL)';
      default:
        return 'Unknown';
    }
  };

  const getBalanceUnit = () => {
    switch (selectedWallet) {
      case 'metamask':
        return 'ETH';
      case 'tronlink':
        return 'TRX';
      case 'solana':
        return 'SOL';
      default:
        return '';
    }
  };

  return (
    <Card>
      <Stat>
        <StatLabel color="secondaryGray.600" fontSize={{ base: 'md' }}>
          Wallet Balance
        </StatLabel>
      </Stat>
      {loading ? (
        <Spinner />
      ) : (
        <Box mt="20px">
          <Text fontWeight="bold">{getWalletName()}</Text>
          <Stat>
            <StatNumber>
              {balance
                ? `${parseFloat(balance).toFixed(4)} ${getBalanceUnit()}`
                : 'Not connected'}
            </StatNumber>
          </Stat>
        </Box>
      )}
    </Card>
  );
}

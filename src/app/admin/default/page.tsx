'use client';
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import {
  Box,
  Flex,
  FormLabel,
  Image,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
// import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from 'react-icons/md';
import CheckTable from 'views/admin/default/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
import Tasks from 'views/admin/default/components/Tasks';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import tableDataCheck from 'views/admin/default/variables/tableDataCheck';
import tableDataComplex from 'views/admin/default/variables/tableDataComplex';
// Assets
import Usa from 'img/dashboards/usa.png';
import WalletConnect from 'components/walletConnect/WalletConnect';
import WalletBalance from 'components/walletBalance/WalletBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';

export default function Default() {
  // Chakra Color Mode

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const { publicKey } = useWallet();

  // State for wallet balances and selection
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [tronBalance, setTronBalance] = useState<string>('0');
  const [solBalance, setSolBalance] = useState<string>('0');
  const [salesGrowth, setSalesGrowth] = useState<string>('+0%');
  const [selectedWallet, setSelectedWallet] = useState<
    'metamask' | 'tronlink' | 'solana'
  >('metamask');

  // Fetch Ethereum balance
  const getEthBalance = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        if (accounts.length > 0) {
          const balance = await provider.getBalance(accounts[0]);
          setEthBalance(ethers.formatEther(balance));
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
        setTronBalance(window.tronWeb.fromSun(balance));
      } catch (error) {
        console.error('Error fetching TRON balance:', error);
      }
    }
  };

  // Fetch Solana balance
  const getSolBalance = async () => {
    if (publicKey) {
      try {
        const connection = new Connection(
          'https://api.mainnet-beta.solana.com',
        );
        const balance = await connection.getBalance(new PublicKey(publicKey));
        const currentBalance = (balance / 1e9).toFixed(2);
        setSolBalance(currentBalance);
      } catch (error) {
        console.error('Error fetching SOL balance:', error);
      }
    }
  };

  // Calculate growth based on selected wallet
  const calculateGrowth = (currentBalance: string) => {
    const currentValue = Number(currentBalance);
    const currentSales = currentValue * 100; // Same multiplier as before

    const lastMonthSales = localStorage.getItem(
      `lastMonth${selectedWallet}Sales`,
    );
    const previousSales = lastMonthSales
      ? Number(lastMonthSales)
      : currentSales * 0.8;

    if (previousSales > 0) {
      const growth = ((currentSales - previousSales) / previousSales) * 100;
      setSalesGrowth(`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`);
    } else {
      setSalesGrowth('+0%');
    }

    localStorage.setItem(
      `lastMonth${selectedWallet}Sales`,
      currentSales.toString(),
    );
  };

  useEffect(() => {
    const fetchBalances = async () => {
      await Promise.all([getEthBalance(), getTronBalance(), getSolBalance()]);
    };
    fetchBalances();
  }, [publicKey]);

  useEffect(() => {
    // Recalculate growth when selected wallet changes
    const balance =
      selectedWallet === 'metamask'
        ? ethBalance
        : selectedWallet === 'tronlink'
        ? tronBalance
        : solBalance;
    calculateGrowth(balance);
  }, [selectedWallet, ethBalance, tronBalance, solBalance]);

  // Select the balance based on the chosen wallet
  const getSelectedBalance = () => {
    switch (selectedWallet) {
      case 'metamask':
        return ethBalance;
      case 'tronlink':
        return tronBalance;
      case 'solana':
        return solBalance;
      default:
        return '0';
    }
  };

  const selectedBalance = getSelectedBalance();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
        gap="20px"
        mb="20px"
      >
        <Box mb={2}>
          <WalletConnect onWalletSelect={setSelectedWallet} />
        </Box>
        <Box mb={2}>
          <WalletBalance selectedWallet={selectedWallet}/>
        </Box>
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Earnings"
          value={`$${Number(selectedBalance) * 3000}`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Spend this month"
          value={`$${Number(selectedBalance) * 0.06}`}
        />
        <MiniStatistics
          growth={salesGrowth}
          name="Sales"
          value={`$${Number(selectedBalance) * 100}`}
        />
        <MiniStatistics
          endContent={
            <Flex me="-16px" mt="10px">
              <FormLabel htmlFor="balance">
                <Box boxSize={'12'}>
                  <Image alt="" src={Usa.src} w={'100%'} h={'100%'} />
                </Box>
              </FormLabel>
              <Select
                id="balance"
                variant="mini"
                mt="5px"
                me="0px"
                defaultValue="usd"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gba">GBA</option>
              </Select>
            </Flex>
          }
          name="Your balance"
          value={`$${selectedBalance}`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
            />
          }
          name="New Tasks"
          value="154"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Total Projects"
          value="2935"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <CheckTable tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <ComplexTable tableData={tableDataComplex} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <Tasks />
          {/* <MiniCalendar h="100%" minW="100%" selectRange={false} /> */}
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}

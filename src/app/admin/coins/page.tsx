"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  useColorModeValue,
  Input,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

// Define the type for cryptocurrency data
interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function CoinsPage() {
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from CoinGecko API
  const fetchCoinData = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            // ids: "bitcoin,ethereum,tether,binancecoin,solana,ripple,cardano,dogecoin,tron,usd-coin",
            order: "market_cap_desc",
            per_page: 50,
            page: 1,
            sparkline: false,
          },
        }
      );
      setCoins(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch coin data");
      setLoading(false);
      console.error(err);
    }
  };

  // Run fetch on mount and every 60 seconds
  useEffect(() => {
    fetchCoinData();
    const interval = setInterval(fetchCoinData, 60000); // Refresh every 1 minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Chakra UI color mode for table styling
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const [search, setSearch] = useState("");
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const router = useRouter();
  
  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      <Heading mb={6} textAlign="center">
        Cryptocurrency Prices
      </Heading>

      <Input
          placeholder="Search coins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          mb={4}
        />
      
      <Button mb={4} onClick={() => router.push("/admin/default")}>
        Go to Main Dashboard
      </Button>

      {loading ? (
        <Box textAlign="center">
          <Spinner size="xl" />
        </Box>
      ) : error ? (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      ) : (
        <Table variant="simple" bg={bgColor} borderRadius="md" boxShadow="md">
          <Thead>
            <Tr>
              <Th color={textColor}>Name</Th>
              <Th color={textColor}>Symbol</Th>
              <Th color={textColor} isNumeric>
                Price (USD)
              </Th>
              <Th color={textColor} isNumeric>
                24h Change (%)
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCoins.map((coin) => (
              <Tr key={coin.id}>
                <Td color={textColor}>{coin.name}</Td>
                <Td color={textColor}>{coin.symbol.toUpperCase()}</Td>
                <Td color={textColor} isNumeric>
                  ${coin.current_price.toLocaleString()}
                </Td>
                <Td
                  color={
                    coin.price_change_percentage_24h >= 0 ? "green.500" : "red.500"
                  }
                  isNumeric
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
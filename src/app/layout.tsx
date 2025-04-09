import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import WalletContextProvider from '../lib/WalletContextProvider';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        <AppWrappers>
          <WalletContextProvider>{children}</WalletContextProvider>
        </AppWrappers>
      </body>
    </html>
  );
}

import './globals.css';
import { Inter } from "next/font/google";
import { WalletProvider } from './contexts/WalletContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SolWell - Health Management + Insurance DApp",
  description: "Health Management and Insurance DApp based on Solana",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}

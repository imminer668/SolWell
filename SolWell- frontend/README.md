# SolWell - Solana Health Management + Insurance DApp

SolWell is a health management and insurance DApp based on the Solana blockchain. By recording and synchronizing users' health data, it provides personalized insurance plans and price benefits.

## Features

- **Health Data Dashboard**: Displays user's step count, sleep time, and other health data with data visualization
- **Data Synchronization**: Synchronizes health data to the Solana blockchain
- **Insurance Recommendation**: Recommends suitable insurance products based on user health status
- **Health Incentive**: The better the health status, the more favorable the insurance price, encouraging users to maintain a healthy lifestyle
- **Wallet Integration**: Supports multiple Solana wallets (Phantom, Sollet, Solflare)

## Technology Stack

- Next.js 14
- React 18
- Tailwind CSS 3.3+ (JIT mode)
- Font Awesome 6.4
- Solana Web3.js (to be integrated)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Build Production Version

```bash
npm run build
```

### Run Production Version

```bash
npm start
```

## Project Structure

```
src/
├── app/
│   ├── components/         # Shared components
│   │   └── BottomNavigation.js 
│   ├── connect-wallet/    # Connect wallet page
│   │   └── page.js
│   ├── insurance/         # Insurance page
│   │   └── page.js
│   ├── profile/           # Personal center page
│   │   └── page.js
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home/Health Data Dashboard
```

## Contribution

Welcome to submit issues and pull requests.

## License

MIT 
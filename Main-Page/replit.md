# PayUpp Marketplace

A cross-border money transfer marketplace built with React, TypeScript, Vite, and Tailwind CSS.

## Overview

PayUpp is a marketplace that connects users with verified agents for international money transfers. Users can compare rates, fees, and delivery times across multiple agents.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
├── src/
│   ├── App.tsx              # Main app entry
│   ├── PayUppMarketplace.tsx # Main marketplace component
│   ├── main.tsx             # React entry point
│   └── index.css            # Tailwind CSS imports
├── public/                  # Static assets
├── index.html               # HTML entry
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

## Development

The app runs on port 5000 with hot module replacement:

```bash
npm run dev
```

## Build

```bash
npm run build
```

Output is placed in the `dist/` directory.

## Features

- Currency conversion calculator with live rate display
- Agent marketplace with filtering by delivery method
- P2P Transaction Flow (Binance-style):
  - Select agent to start transaction
  - Enter recipient details (bank transfer, mobile money, or cash pickup)
  - View agent payment details and make payment
  - Track payment release and agent confirmation
  - Transaction completion with summary
- Multiple pages: Home, How It Works, Become an Agent, Pricing, Help, Waitlist
- Responsive design for mobile and desktop
- Animated transitions with Framer Motion

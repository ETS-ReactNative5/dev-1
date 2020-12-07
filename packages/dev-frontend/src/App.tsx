import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Flex, Spinner, Heading, Text, ThemeProvider, Container } from "theme-ui";
import { Wallet } from "@ethersproject/wallet";

import { Decimal, Difference, Percent } from "@liquity/decimal";
import { BatchedWebSocketAugmentedWeb3Provider } from "@liquity/providers";
import { Trove, StabilityDeposit } from "@liquity/lib-base";
import { addressesOf, BlockPolledLiquityStore, EthersLiquity as Liquity } from "@liquity/lib-ethers";
import { LiquityStoreProvider } from "@liquity/lib-react";
import { SubgraphLiquity } from "@liquity/lib-subgraph";

import { LiquityProvider, useLiquity } from "./hooks/LiquityContext";
import { WalletConnector } from "./components/WalletConnector";
import { TransactionProvider, TransactionMonitor } from "./components/Transaction";
import { TroveManager } from "./components/TroveManager";
import { UserAccount } from "./components/UserAccount";
import { SystemStats } from "./components/SystemStats";
import { SystemStatsPopup } from "./components/SystemStatsPopup";
import { StabilityDepositManager } from "./components/StabilityDepositManager";
import { RiskiestTroves } from "./components/RiskiestTroves";
import { PriceManager } from "./components/PriceManager";
import { RedemptionManager } from "./components/RedemptionManager";
import { LiquidationManager } from "./components/LiquidationManager";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import theme from "./theme";

import { DisposableWalletProvider } from "./testUtils/DisposableWalletProvider";

if (window.ethereum) {
  // Silence MetaMask warning in console
  Object.assign(window.ethereum, { autoRefreshOnNetworkChange: false });
}

if (process.env.REACT_APP_DEMO_MODE === "true") {
  const ethereum = new DisposableWalletProvider(
    `http://${window.location.hostname}:8545`,
    "0x4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7"
  );

  Object.assign(window, { ethereum });
}

const EthersWeb3ReactProvider: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={provider => new BatchedWebSocketAugmentedWeb3Provider(provider)}>
      {children}
    </Web3ReactProvider>
  );
};

type LiquityFrontendProps = {
  loader?: React.ReactNode;
};

const LiquityFrontend: React.FC<LiquityFrontendProps> = ({ loader }) => {
  const { account, provider, liquity, contracts } = useLiquity();
  const store = new BlockPolledLiquityStore(provider, account, liquity);

  // For console tinkering ;-)
  Object.assign(window, {
    account,
    provider,
    contracts,
    addresses: addressesOf(contracts),
    store,
    liquity,
    Liquity,
    SubgraphLiquity,
    Trove,
    StabilityDeposit,
    Decimal,
    Difference,
    Percent,
    Wallet
  });

  return (
    <LiquityStoreProvider {...{ store, loader }}>
      <Header>
        <UserAccount />
        <SystemStatsPopup />
      </Header>

      <Container variant="main">
        <Container variant="columns">
          <Container variant="left">
            <TroveManager />
            <StabilityDepositManager />
            <RedemptionManager />
          </Container>

          <Container variant="right">
            <SystemStats />
            <PriceManager />
            <LiquidationManager />
          </Container>
        </Container>

        <RiskiestTroves pageSize={10} />
      </Container>

      <Footer>
        <Text>* Please note that the final user-facing application will look different.</Text>
      </Footer>

      <TransactionMonitor />
    </LiquityStoreProvider>
  );
};

const App = () => {
  const loader = (
    <Flex sx={{ alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Spinner sx={{ m: 2, color: "text" }} size="32px" />
      <Heading>Loading...</Heading>
    </Flex>
  );

  const unsupportedNetworkFallback = (chainId: number) => (
    <Flex
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}
    >
      <Heading>Liquity is not yet deployed to {chainId === 1 ? "mainnet" : "this network"}.</Heading>
      <Text sx={{ mt: 3 }}>Please switch to Ropsten, Rinkeby, Kovan or Görli.</Text>
    </Flex>
  );

  return (
    <EthersWeb3ReactProvider>
      <ThemeProvider theme={theme}>
        <WalletConnector {...{ loader }}>
          <LiquityProvider {...{ loader, unsupportedNetworkFallback }}>
            <TransactionProvider>
              <LiquityFrontend {...{ loader }} />
            </TransactionProvider>
          </LiquityProvider>
        </WalletConnector>
      </ThemeProvider>
    </EthersWeb3ReactProvider>
  );
};

export default App;

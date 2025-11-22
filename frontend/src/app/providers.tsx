"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig, SuiClientProvider, WalletProvider, useSuiClientContext } from "@mysten/dapp-kit";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import { ENOKI_PUBLIC_API_KEY, GOOGLE_CLIENT_ID } from "@/lib/constants";

const { networkConfig } = createNetworkConfig({
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  useEffect(() => {
    if (!isEnokiNetwork(network)) return;
    if (!ENOKI_PUBLIC_API_KEY || !GOOGLE_CLIENT_ID) return;
    console.debug('[Enoki] Registering wallets', {
      network,
      hasApiKey: !!ENOKI_PUBLIC_API_KEY,
      googleClientIdSuffix: GOOGLE_CLIENT_ID?.slice(-6),
    });

    try {
      const { unregister } = registerEnokiWallets({
        apiKey: ENOKI_PUBLIC_API_KEY,
        providers: {
          google: { clientId: GOOGLE_CLIENT_ID },
        },
        client,
        network,
      });
      return unregister;
    } catch (e: any) {
      console.error('[Enoki] Failed to register wallets', e?.message || e);
    }
  }, [client, network]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork={"testnet"}>
          <RegisterEnokiWallets />
          <EnokiFlowProvider apiKey={process.env.NEXT_PUBLIC_ENOKI_API_KEY || ""}>
            <WalletProvider autoConnect>
              {children}
            </WalletProvider>
          </EnokiFlowProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}


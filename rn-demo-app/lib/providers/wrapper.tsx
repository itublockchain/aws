import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dynamicClient } from "@/lib/clients/dynamic";

const queryClient = new QueryClient();

function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <dynamicClient.reactNative.WebView />
        {children}
      </>
    </QueryClientProvider>
  );
}

export default ProviderWrapper;

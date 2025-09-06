import { getPublicClient, getKernelClient } from "@/lib/clients/dynamic";
import { encodeFunctionData } from "viem";
import { address_base, abi } from "@/lib/contracts/USDC";

class BalanceService {
  async getBalance(address: string | undefined): Promise<bigint | any> {
    try {
      const publicClient = getPublicClient();

      const data = await publicClient.readContract({
        address: address_base,
        abi: abi,
        functionName: "balanceOf",
        args: [address],
      });

      return data;
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }
}

// Singleton instance
const balanceService = new BalanceService();

export default balanceService;
export { BalanceService };

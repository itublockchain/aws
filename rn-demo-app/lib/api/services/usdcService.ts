import { getKernelClient } from "@/lib/clients/dynamic";
import { encodeFunctionData, parseUnits } from "viem";
import { address_base, abi } from "@/lib/contracts/USDC";

interface USDCSendResponse {
  hash: string;
  success: boolean;
}

class USDCService {
  async send(to: string, amount: string): Promise<USDCSendResponse | any> {
    try {
      const kernelClient = await getKernelClient();
      
      const amountInWei = parseUnits(amount, 6);

      const data = await kernelClient.sendUserOperation({
        callData: await kernelClient.account.encodeCalls([
          {
            data: encodeFunctionData({
              abi: abi,
              args: [to, amountInWei],
              functionName: "transfer",
            }),
            to: address_base,
          },
        ]),
      });

      return {
        hash: data,
        success: true,
      };
    } catch (error) {
      console.error("Error sending USDC:", error);
      throw error;
    }
  }
}

// Singleton instance
const usdcService = new USDCService();

export default usdcService;
export { USDCService };

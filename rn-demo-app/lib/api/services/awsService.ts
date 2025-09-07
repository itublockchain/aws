import { getPublicClient, getKernelClient } from "@/lib/clients/dynamic";
import { encodeFunctionData } from "viem";
import { address_base, abi } from "@/lib/contracts/AWS";

interface AWSResponse {
  publicKey: string;
  ensName: bigint;
}

interface SetAWSResponse {
  hash: string;
  success: boolean;
}

interface NearbyDevice {
  uuid: string;
  address?: string;
  name?: string;
  rssi?: number;
  ensName?: string;
  publicKey?: string;
}

class AWSService {
  async getNearbyDevices(): Promise<NearbyDevice[]> {
    try {
      // BLE scan simulation - normally would use rnas.scan()
      console.log("Scanning for nearby devices...");
      
      // Simulate scan delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return mock data for now
      const mockDevices: NearbyDevice[] = [
        {
          uuid: "1",
          address: "00:11:22:33:44:55",
          name: "Wallet-1",
          rssi: -45,
          ensName: "alice.eth",
          publicKey: "0x1234567890abcdef1234567890abcdef12345678"
        },
        {
          uuid: "2", 
          address: "00:11:22:33:44:66",
          name: "Wallet-2",
          rssi: -52,
          ensName: "bob.eth",
          publicKey: "0xabcdef1234567890abcdef1234567890abcdef12"
        },
        {
          uuid: "3",
          address: "00:11:22:33:44:77", 
          name: "Wallet-3",
          rssi: -38,
          ensName: "charlie.eth",
          publicKey: "0x567890abcdef1234567890abcdef1234567890ab"
        }
      ];

      return mockDevices;
    } catch (error) {
      console.error("Error getting nearby devices:", error);
      throw error;
    }
  }

  async getAWSName(hash: string): Promise<AWSResponse> {
    try {
      const publicClient = getPublicClient();

      const data = await publicClient.readContract({
        address: address_base,
        abi: abi,
        functionName: "getAWSName",
        args: [hash],
      });

      return data as AWSResponse;
    } catch (error) {
      console.error("Error getting AWS name:", error);
      throw error;
    }
  }

  async setAWSName(hash: string, publicKey: string): Promise<SetAWSResponse> {
    try {
      const kernelClient = await getKernelClient();

      const txHash = await kernelClient.sendUserOperation({
        callData: await kernelClient.account.encodeCalls([
          {
            data: encodeFunctionData({
              abi: abi,
              args: [hash, publicKey],
              functionName: "setAWSName",
            }),
            to: address_base,
          },
        ]),
      });

      return {
        hash: txHash,
        success: true,
      };
    } catch (error) {
      console.error("Error setting AWS name:", error);
      throw error;
    }
  }
}

// Singleton instance
const awsService = new AWSService();

export default awsService;
export { AWSService, NearbyDevice, AWSResponse, SetAWSResponse };

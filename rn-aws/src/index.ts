/**
 * rn-aws - A simple logging and BLE advertise library
 */

import BleAdvertise from 'react-native-ble-advertise';
import { createPublicClient, http, keccak256, toBytes } from 'viem';
import { baseSepolia } from 'viem/chains';
import { abi, address_base } from './contracts/AWS';

// RPC Configuration
const RPC_URL = 'https://base-sepolia.drpc.org';

// Create viem client
const client = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

/**
 * Log function that returns the provided string
 * @param message - The string message to log
 * @returns The same string that was provided
 */
export function log(message: string): string {
  console.log(message);
  return message;
}

/**
 * Interface for BLE advertise configuration
 */
export interface AdvertiseConfig {
  uuid?: string;
  major?: number;
  minor?: number;
  companyId?: number;
}

/**
 * Start BLE advertising with given configuration
 * @param config - The advertising configuration
 * @returns Promise that resolves when advertising starts
 */
export async function startAdvertise(config: AdvertiseConfig = {}): Promise<string> {
  const defaultConfig = {
    uuid: '12345678-1234-1234-1234-1234567890AB',
    major: 1,
    minor: 1,
    companyId: 0xFFFF,
    ...config
  };

  try {
    // Set company ID if provided
    if (defaultConfig.companyId) {
      BleAdvertise.setCompanyId(defaultConfig.companyId);
    }
    
    const result = await BleAdvertise.broadcast(
      defaultConfig.uuid,
      defaultConfig.major,
      defaultConfig.minor
    );
    console.log(`BLE Advertising started with config: ${JSON.stringify(defaultConfig)}`);
    return result;
  } catch (error) {
    const errorMessage = `Failed to start BLE advertising: ${error}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Stop BLE advertising
 * @returns Promise that resolves when advertising stops
 */
export async function stopAdvertise(): Promise<string> {
  try {
    const result = await BleAdvertise.stopBroadcast();
    console.log('BLE Advertising stopped');
    return result;
  } catch (error) {
    const errorMessage = `Failed to stop BLE advertising: ${error}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Check if BLE is supported on this device
 * @returns Promise that resolves with support status
 */
export async function checkBLESupport(): Promise<string> {
  try {
    const result = await BleAdvertise.checkIfBLESupported();
    console.log(`BLE Support check result: ${result}`);
    return result;
  } catch (error) {
    const errorMessage = `Failed to check BLE support: ${error}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Interface for BLE scan result with contract data
 */
export interface ScanResult {
  uuid: string;
  major?: number;
  minor?: number;
  rssi?: number;
  address?: string;
  name?: string;
  publicKey?: string;
  ensName?: string;
}

/**
 * Search contract for device information using nameHash
 * @param nameHash - The keccak256 hash of the device identifier
 * @returns Promise that resolves with contract data
 */
async function searchContract(nameHash: string): Promise<{ publicKey?: string; ensName?: string }> {
  try {
    console.log(`Searching contract for nameHash: ${nameHash}`);
    
    // Check if record exists
    const exists = await client.readContract({
      address: address_base as `0x${string}`,
      abi,
      functionName: 'exists',
      args: [nameHash as `0x${string}`],
    });

    if (!exists) {
      console.log(`No record found for nameHash: ${nameHash}`);
      return { publicKey: undefined, ensName: undefined };
    }

    // Get AWS name data
    const result = await client.readContract({
      address: address_base as `0x${string}`,
      abi,
      functionName: 'getAWSName',
      args: [nameHash as `0x${string}`],
    }) as [string, `0x${string}`, string, bigint];

    const [owner, publicKeyBytes, ensName, updatedAt] = result;
    const publicKey = publicKeyBytes ? publicKeyBytes.toString() : undefined;

    console.log(`Contract search completed for ${nameHash}: publicKey=${publicKey}, ensName=${ensName}`);
    return { publicKey, ensName };
    
  } catch (error) {
    console.log(`Contract search failed for ${nameHash}: ${error}`);
    return { publicKey: undefined, ensName: undefined };
  }
}

/**
 * Generate nameHash from device address using first 8 characters of SHA-256
 * @param address - Device address
 * @returns nameHash as hex string (first 8 chars of SHA-256)
 */
function generateNameHash(address: string): string {
  // Generate SHA-256 hash and take first 8 characters
  const fullHash = keccak256(toBytes(address));
  const nameHash = fullHash.slice(0, 10); // '0x' + 8 characters = 10 total
  return nameHash;
}

/**
 * Start scanning for BLE devices and enrich with contract data
 * @param duration - Scan duration in milliseconds (default: 10000ms)
 * @param enableContractSearch - Whether to search contract for device data (default: true)
 * @returns Promise that resolves with enriched scan results
 */
export async function scan(duration: number = 10000, enableContractSearch: boolean = true): Promise<ScanResult[]> {
  try {
    console.log(`Starting BLE scan for ${duration}ms`);
    
    // Start scanning
    const scanResults: ScanResult[] = [];
    
    // Note: This is a mock implementation as react-native-ble-advertise 
    // primarily focuses on advertising. For actual scanning, you might need
    // a different library like react-native-ble-manager
    
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(async () => {
        console.log(`BLE scan completed. Found ${scanResults.length} devices`);
        
        // Enrich scan results with contract data
        if (enableContractSearch && scanResults.length > 0) {
          console.log('Enriching scan results with contract data...');
          const enrichedResults = await Promise.all(
            scanResults.map(async (device) => {
              if (device.address) {
                try {
                  const nameHash = generateNameHash(device.address);
                  const contractData = await searchContract(nameHash);
                  return {
                    ...device,
                    publicKey: contractData.publicKey,
                    ensName: contractData.ensName
                  };
                } catch (error) {
                  console.log(`Failed to enrich device ${device.address}: ${error}`);
                  return device;
                }
              }
              return device;
            })
          );
          console.log(`Contract enrichment completed for ${enrichedResults.length} devices`);
          resolve(enrichedResults);
        } else {
          resolve(scanResults);
        }
      }, duration);
      
      // In a real implementation, you would set up event listeners here
      // and populate scanResults with discovered devices
    });
    
  } catch (error) {
    const errorMessage = `Failed to scan for BLE devices: ${error}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}

export default {
  log,
  startAdvertise,
  stopAdvertise,
  checkBLESupport,
  scan
};

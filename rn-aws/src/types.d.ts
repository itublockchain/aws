declare module 'react-native-ble-advertise' {
  interface BleAdvertiser {
    broadcast(uuid: string, major: number, minor: number): Promise<string>;
    stopBroadcast(): Promise<string>;
    checkIfBLESupported(): Promise<string>;
    setCompanyId(companyId: number): void;
  }
  
  const BleAdvertise: BleAdvertiser;
  export default BleAdvertise;
}

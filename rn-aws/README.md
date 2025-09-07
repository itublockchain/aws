# rn-aws

A simple logging and BLE advertising library for React Native AWS demo app.

## Installation

```bash
npm install ./rn-aws
```

## Usage

### Logging
```typescript
import { log } from 'rn-aws';

const message = log('Hello, world!');
console.log(message); // Outputs: Hello, world!
```

### BLE Advertising
```typescript
import { startAdvertise, stopAdvertise, checkBLESupport } from 'rn-aws';

// Check BLE support
const support = await checkBLESupport();

// Start advertising with default config
await startAdvertise();

// Start advertising with custom config
await startAdvertise({
  uuid: '12345678-1234-1234-1234-1234567890AB',
  major: 1,
  minor: 1,
  companyId: 0xFFFF
});

// Stop advertising
await stopAdvertise();
```

## API

### `log(message: string): string`

Logs the provided message to the console and returns the same string.

### `startAdvertise(config?: AdvertiseConfig): Promise<string>`

Starts BLE advertising with the given configuration.

- **Parameters:**
  - `config` (optional): Configuration object with:
    - `uuid` (string): iBeacon UUID (default: '12345678-1234-1234-1234-1234567890AB')
    - `major` (number): iBeacon major value (default: 1)
    - `minor` (number): iBeacon minor value (default: 1)
    - `companyId` (number): Company ID (default: 0xFFFF)
- **Returns:** Promise that resolves with success message

### `stopAdvertise(): Promise<string>`

Stops BLE advertising.

- **Returns:** Promise that resolves with success message

### `checkBLESupport(): Promise<string>`

Checks if BLE is supported on the device.

- **Returns:** Promise that resolves with support status

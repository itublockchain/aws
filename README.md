AWS 📲

Splitwise solved the past. AWS powers the future.

AWS is a React Native SDK that lets any app add proximity-based crypto payments in minutes.

🧾 What is "AWS"?

AWS is a developer SDK that enables shake-to-share functionality.
Any app can integrate it to let users discover peers nearby and transfer stablecoins — no wallet addresses, no QR codes.

⚙️ How It Works
🚀 Plug-and-Play Wallets with Porto

AWS comes with embedded passkey wallets:
* No seed phrases, no extensions
* Account abstraction UX out of the box

📡 Peer Discovery via Bluetooth

Just a shake and the SDK handles discovery:
* Foreground BLE advertising + scanning
* Rotating ephemeral IDs (privacy-first)
* Peer list exposed through a simple RN hook

🤝 Encrypted Handshake

One call starts a secure session:
* Mutual key exchange over BLE
* Fresh receive address revealed per session
* Wallet ownership proved in <1 second

💸 Stablecoin Settlement on Rise

Transaction flow built in:
* Gasless USDC transfers on Rise chain
* Event hooks so host apps can display confirmations

🔧 Developer Benefits

* Drop-in React Native module, minimal native setup
* High-level API: startAdvertising()...
* Emits events for discovery, handshake, and tx lifecycle
* Works offline for peer discovery; only requires internet for settlement

With AWS, developers can add “shake-to-share” crypto transfers to any app, making payments social, instant, and invisible.

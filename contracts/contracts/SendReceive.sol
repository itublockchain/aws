// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IENS {
	function resolver(bytes32 node) external view returns (address);
}

interface INameResolver {
	function name(bytes32 node) external view returns (string memory);
}

interface IReverseRegistrar {
	function node(address addr) external view returns (bytes32);
}

// Stores a mapping from a sha3-192 hash (bytes24) to wallet and public key,
// and augments lookups with ENS reverse name resolution for the mapped wallet.
contract SendReceive {
	address public immutable owner;
	IENS public immutable ensRegistry;
	IReverseRegistrar public immutable reverseRegistrar;

	struct Entry {
		address wallet;
		bytes publicKey;
	}

	// hash (e.g., ENS/wallet composite) => entry
	mapping(bytes24 => Entry) private records;

	event MappingUpdated(bytes24 indexed key, address indexed wallet, bytes publicKey);

	constructor(address _ensRegistry, address _reverseRegistrar) {
		owner = msg.sender;
		ensRegistry = IENS(_ensRegistry);
		reverseRegistrar = IReverseRegistrar(_reverseRegistrar);
	}

	modifier onlyOwner() {
		require(msg.sender == owner, "Only owner");
		_;
	}

	// Set or update the entry for a given sha3-192 hash
	function setMapping(bytes24 key, address wallet, bytes calldata publicKey) external onlyOwner {
		records[key] = Entry({wallet: wallet, publicKey: publicKey});
		emit MappingUpdated(key, wallet, publicKey);
	}

	// Returns the stored wallet and public key, plus ENS reverse name for wallet if available
	function getMapping(bytes24 key) external view returns (address wallet, bytes memory publicKey, string memory ensName) {
		Entry storage e = records[key];
		wallet = e.wallet;
		publicKey = e.publicKey;
		ensName = _reverseENSName(wallet);
	}

	function _reverseENSName(address wallet) internal view returns (string memory) {
		if (wallet == address(0)) {
			return "";
		}
		bytes32 node;
		address resolver;
		// Try/catch to avoid reverts propagating
		try reverseRegistrar.node(wallet) returns (bytes32 n) {
			node = n;
		} catch {
			return "";
		}
		if (node == bytes32(0)) {
			return "";
		}
		try ensRegistry.resolver(node) returns (address r) {
			resolver = r;
		} catch {
			return "";
		}
		if (resolver == address(0)) {
			return "";
		}
		try INameResolver(resolver).name(node) returns (string memory n) {
			return n;
		} catch {
			return "";
		}
	}
}


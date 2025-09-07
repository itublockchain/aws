// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @dev Minimal ENS Registry interface used for resolver lookups
interface IENSRegistry {
  function resolver(bytes32 node) external view returns (address);
}

/// @dev Minimal ENS Reverse Registrar interface to compute reverse node for an address
interface IReverseRegistrar {
  function node(address addr) external view returns (bytes32);
}

/// @dev Minimal Name Resolver interface to read the reverse record name
interface INameResolver {
  function name(bytes32 node) external view returns (string memory);
}

/// @title AWS - A simple hash-indexed registry linking a public key; ENS is resolved on read
/// @notice Stores records keyed by an application-provided hash. Each record can hold a public key.
/// ENS name is NOT stored and is resolved dynamically from ENS.
contract AWS {
  /// @dev ENS Registry and Reverse Registrar needed for reverse lookup
  address public immutable ensRegistry;
  address public immutable reverseRegistrar;

  constructor(address ensRegistry_, address reverseRegistrar_) {
    require(ensRegistry_ != address(0) && reverseRegistrar_ != address(0), "invalid ENS addresses");
    ensRegistry = ensRegistry_;
    reverseRegistrar = reverseRegistrar_;
  }
  /// @dev Record stored for each hash key
  struct Record {
    address owner;
    bytes publicKey; // Arbitrary public key bytes as produced by the client
    uint256 updatedAt;
  }

  /// @dev Storage mapping from application-provided hash to its record
  mapping(bytes32 => Record) private records;

  /// @dev Emitted when a new record is created
  event RecordCreated(bytes32 indexed nameHash, address indexed owner);
  /// @dev Emitted when an existing record is updated
  event RecordUpdated(bytes32 indexed nameHash, address indexed owner);

  /// @dev Error when attempting to create a record that already exists
  error RecordAlreadyExists(bytes32 nameHash);
  /// @dev Error when a caller is not the owner of a given record
  error NotRecordOwner(bytes32 nameHash, address caller);
  /// @dev Error when a record is missing
  error RecordNotFound(bytes32 nameHash);

  /// @notice Create a record for a given hash with the provided public key
  /// @dev The caller becomes the owner of the record
  /// @param nameHash The application-provided hash key (e.g., namehash/content hash)
  /// @param publicKey Arbitrary public key bytes to associate with this record
  function setAWSName(bytes32 nameHash, bytes calldata publicKey) external {
    if (records[nameHash].owner != address(0)) {
      revert RecordAlreadyExists(nameHash);
    }

    records[nameHash] = Record({
      owner: msg.sender,
      publicKey: publicKey,
      updatedAt: block.timestamp
    });

    emit RecordCreated(nameHash, msg.sender);
  }

  

  /// @notice Return full record information for a given hash
  /// @param nameHash The application-provided hash key
  /// @return owner The owner address of the record
  /// @return publicKey The associated public key bytes
  /// @return ensName The ENS name resolved from the owner's reverse record (empty if none)
  /// @return updatedAt The last update timestamp
  function getAWSName(bytes32 nameHash)
    external
    view
    returns (
      address owner,
      bytes memory publicKey,
      string memory ensName,
      uint256 updatedAt
    )
  {
    Record memory r = records[nameHash];
    if (r.owner == address(0)) {
      revert RecordNotFound(nameHash);
    }
    return (r.owner, r.publicKey, _resolveReverseENS(r.owner), r.updatedAt);
  }

  /// @notice Convenience getter for just the ENS name
  /// @param nameHash The application-provided hash key
  function getENSName(bytes32 nameHash) external view returns (string memory) {
    Record memory r = records[nameHash];
    if (r.owner == address(0)) {
      revert RecordNotFound(nameHash);
    }
    return _resolveReverseENS(r.owner);
  }

  /// @notice Check if a record exists for the given hash
  /// @param nameHash The application-provided hash key
  function exists(bytes32 nameHash) external view returns (bool) {
    return records[nameHash].owner != address(0);
  }

  /// @dev Restricts a function to the owner of a record
  modifier onlyRecordOwner(bytes32 nameHash) {
    address owner_ = records[nameHash].owner;
    if (owner_ == address(0)) {
      revert RecordNotFound(nameHash);
    }
    if (owner_ != msg.sender) {
      revert NotRecordOwner(nameHash, msg.sender);
    }
    _;
  }

  /// @dev Resolve reverse ENS name for an owner address via ENS registry and reverse registrar
  function _resolveReverseENS(address owner_) internal view returns (string memory) {
    bytes32 reverseNode = IReverseRegistrar(reverseRegistrar).node(owner_);
    address resolverAddr = IENSRegistry(ensRegistry).resolver(reverseNode);
    if (resolverAddr == address(0)) {
      return "";
    }
    return INameResolver(resolverAddr).name(reverseNode);
  }
}



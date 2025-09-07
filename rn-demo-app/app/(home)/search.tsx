import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useState } from "react";

import { Text } from "@/components/native";
import { Colors } from "@/constants/Colors";
import { getHeight, getWidth } from "@/constants/Spaces";
import { DisplayStyle, TextStyle } from "@/constants/Fonts";
import awsService, { NearbyDevice } from "@/lib/api/services/awsService";

export default function Search() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<NearbyDevice[]>([]);

  const startScanning = async () => {
    setIsScanning(true);
    setDevices([]);
    
    try {
      console.log("Starting BLE scan...");
      const nearbyDevices = await awsService.getNearbyDevices();
      setDevices(nearbyDevices);
    } catch (error) {
      console.error("Scan error:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const generateAvatarUrl = (address: string) => {
    // Using DiceBear API for generating random avatars
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&backgroundColor=random`;
  };

  const renderDevice = ({ item }: { item: NearbyDevice }) => (
    <TouchableOpacity style={styles.deviceCard}>
      <View style={styles.deviceInfo}>
        <Image 
          source={{ uri: generateAvatarUrl(item.address || item.uuid) }}
          style={styles.avatar}
        />
        <View style={styles.deviceText}>
          <Text style={styles.ensName}>
            {item.ensName || `wallet-${item.uuid.slice(0, 6)}.eth`}
          </Text>
          <Text style={styles.deviceAddress}>
            {item.address || `Device ${item.uuid}`}
          </Text>
          {item.rssi && (
            <Text style={styles.rssi}>Signal: {item.rssi} dBm</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.header_title}>Nearby Wallets</Text>
        <TouchableOpacity 
          style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
          onPress={startScanning}
          disabled={isScanning}
        >
          {isScanning ? (
            <ActivityIndicator color={Colors.GREEN} size="small" />
          ) : (
            <Text style={styles.scanButtonText}>
              {devices.length > 0 ? "Scan Again" : "Start Scan"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {isScanning && (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color={Colors.DARK} />
          <Text style={styles.scanningText}>Searching for nearby wallets...</Text>
        </View>
      )}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.uuid}
        renderItem={renderDevice}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.devicesList}
        ListEmptyComponent={
          !isScanning ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No wallets found nearby</Text>
              <Text style={styles.emptySubText}>Tap &ldquo;Start Scan&rdquo; to search for devices</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GREEN,
    padding: getWidth(20),
  },
  header_container: {
    marginVertical: getHeight(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header_title: {
    color: Colors.DARK,
    fontSize: DisplayStyle.size.sm,
    fontWeight: DisplayStyle.weight.Black,
    letterSpacing: -1.2,
  },
  scanButton: {
    backgroundColor: Colors.DARK,
    paddingHorizontal: getWidth(16),
    paddingVertical: getHeight(8),
    borderRadius: 8,
    minWidth: getWidth(80),
    alignItems: "center",
  },
  scanButtonDisabled: {
    backgroundColor: Colors.DARK + "80",
  },
  scanButtonText: {
    color: Colors.GREEN,
    fontSize: TextStyle.size.sm,
    fontWeight: DisplayStyle.weight.Bold,
  },
  scanningContainer: {
    alignItems: "center",
    marginVertical: getHeight(20),
  },
  scanningText: {
    color: Colors.DARK,
    fontSize: TextStyle.size.sm,
    marginTop: getHeight(10),
    opacity: 0.7,
  },
  devicesList: {
    paddingBottom: getHeight(20),
  },
  deviceCard: {
    backgroundColor: Colors.DARK + "10",
    borderRadius: 12,
    padding: getWidth(16),
    marginBottom: getHeight(12),
    borderWidth: 1,
    borderColor: Colors.DARK + "20",
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: getWidth(50),
    height: getWidth(50),
    borderRadius: getWidth(25),
    backgroundColor: Colors.DARK + "20",
  },
  deviceText: {
    marginLeft: getWidth(12),
    flex: 1,
  },
  ensName: {
    color: Colors.DARK,
    fontSize: TextStyle.size.md,
    fontWeight: DisplayStyle.weight.Bold,
    marginBottom: getHeight(4),
  },
  deviceAddress: {
    color: Colors.DARK + "80",
    fontSize: TextStyle.size.xs,
    marginBottom: getHeight(2),
  },
  rssi: {
    color: Colors.DARK + "60",
    fontSize: TextStyle.size.xxs,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: getHeight(40),
  },
  emptyText: {
    color: Colors.DARK,
    fontSize: TextStyle.size.md,
    fontWeight: DisplayStyle.weight.Bold,
    marginBottom: getHeight(8),
  },
  emptySubText: {
    color: Colors.DARK + "60",
    fontSize: TextStyle.size.sm,
    textAlign: "center",
  },
});

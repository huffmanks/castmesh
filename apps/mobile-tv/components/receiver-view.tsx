import { useCastingStore } from "@castmesh/core";
import { useReceiver } from "@castmesh/react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { receiverService } from "../network";

export function ReceiverView() {
  const pairingCode = useCastingStore((state) => state.pairingCode);
  const { receiverInfo, connectedDevices, status } = useReceiver(receiverService, pairingCode);

  return (
    <View style={styles.section}>
      <Text style={styles.headingPrimary}>Receiver Mode</Text>

      <Text style={styles.text}>
        Pairing Code: <Text style={styles.bold}>{pairingCode}</Text>
      </Text>

      <Text style={styles.text}>
        Status: {status === "starting" && "Starting receiver..."}
        {status === "listening" && "Listening for connections"}
        {status === "stopped" && "Receiver stopped"}
        {status === "error" && "Receiver failed to start"}
      </Text>

      {receiverInfo && (
        <Text style={styles.text}>
          Host: {receiverInfo.host}:{receiverInfo.port}
        </Text>
      )}

      <Text style={styles.headingSecondary}>Connected Devices</Text>

      {connectedDevices.length === 0 ? (
        <Text style={styles.text}>No connected devices</Text>
      ) : (
        <FlatList
          data={connectedDevices}
          keyExtractor={(device) => device.id}
          renderItem={({ item: device }) => (
            <View style={styles.deviceRow}>
              <Text style={styles.text}>
                {device.name} ({device.address})
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
  },
  headingPrimary: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headingSecondary: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  deviceRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

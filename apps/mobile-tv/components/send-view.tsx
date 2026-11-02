import { useCastingStore } from "@castmesh/core";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export function SenderView() {
  const savedDevices = useCastingStore((state) => state.savedDevices);

  const [inputIp, setInputIp] = useState("");
  const [inputPort, setInputPort] = useState("8080");
  const [inputCode, setInputCode] = useState("");

  return (
    <View style={styles.section}>
      <Text style={styles.headingPrimary}>Sender Mode</Text>

      <Text style={styles.headingSecondary}>Pair New Device</Text>

      <TextInput
        style={styles.input}
        placeholder="Receiver IP"
        placeholderTextColor="#888"
        value={inputIp}
        onChangeText={setInputIp}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Port"
        placeholderTextColor="#888"
        value={inputPort}
        onChangeText={setInputPort}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Pairing Code"
        placeholderTextColor="#888"
        value={inputCode}
        onChangeText={setInputCode}
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          console.log({
            address: inputIp,
            port: Number(inputPort),
            pairingCode: inputCode,
          });
        }}
      >
        <Text style={styles.primaryButtonText}>Pair & Connect</Text>
      </TouchableOpacity>

      <Text style={styles.headingSecondary}>Saved Devices</Text>

      {savedDevices.length === 0 ? (
        <Text style={styles.text}>No saved devices</Text>
      ) : (
        <FlatList
          data={savedDevices}
          keyExtractor={(device) => device.id}
          renderItem={({ item: device }) => (
            <View style={styles.deviceRow}>
              <Text style={styles.text}>{device.name}</Text>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => console.log("Connect to", device.id)}
              >
                <Text style={styles.smallButtonText}>Connect</Text>
              </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  primaryButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  smallButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

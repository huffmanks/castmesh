import { PairedDevice, useCastingStore } from "@castmesh/core";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const {
    isReceiver,
    pairingCode,
    pairedDevices,
    setReceiverMode,
    addPairedDevice,
    activeSocket,
    setActiveSocket,
  } = useCastingStore();

  const [inputIp, setInputIp] = useState("");
  const [inputPort, setInputPort] = useState("8080");
  const [inputCode, setInputCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectToReceiver = (device: PairedDevice) => {
    const ws = new WebSocket(`ws://${device.ip}:${device.port}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "PAIR_REQ", code: device.pairingCode }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "PAIR_RES" && msg.payload.success) {
        addPairedDevice(device);
        setActiveSocket(ws);
        setIsConnected(true);
        Alert.alert("Success", "Successfully connected!");
      } else {
        Alert.alert("Error", "Pairing failed: Invalid code");
        ws.close();
      }
    };
  };

  const sendMedia = (action: string) => {
    if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
      activeSocket.send(JSON.stringify({ type: "MEDIA_CONTROL", payload: { action } }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Universal P2P Casting</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => setReceiverMode(true)}>
          <Text style={styles.buttonText}>Receiver Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setReceiverMode(false)}>
          <Text style={styles.buttonText}>Sender Mode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hr} />

      {isReceiver ? (
        <View>
          <Text style={styles.heading}>Receiver Mode</Text>
          <Text style={styles.text}>
            Your Pairing Code: <Text style={styles.bold}>{pairingCode}</Text>
          </Text>
          <Text style={styles.text}>Status: Listening for incoming connections...</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.heading}>Sender Mode</Text>
          <Text style={styles.subheading}>Pair New Device</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="IP (e.g. 192.168.1.50)"
              placeholderTextColor="#888"
              value={inputIp}
              onChangeText={setInputIp}
              style={[styles.input, { flex: 2 }]}
            />
            <TextInput
              placeholder="Port"
              placeholderTextColor="#888"
              value={inputPort}
              onChangeText={setInputPort}
              style={[styles.input, { flex: 1 }]}
            />
          </View>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Pairing Code"
              placeholderTextColor="#888"
              value={inputCode}
              onChangeText={setInputCode}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                connectToReceiver({
                  id: inputIp,
                  name: `Device (${inputIp})`,
                  ip: inputIp,
                  port: parseInt(inputPort) || 8080,
                  pairingCode: inputCode,
                })
              }
            >
              <Text style={styles.buttonText}>Pair & Connect</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subheading}>Saved Devices</Text>
          {pairedDevices.length === 0 && <Text style={styles.text}>No saved devices</Text>}
          {pairedDevices.map((d) => (
            <View key={d.id} style={styles.deviceRow}>
              <Text style={styles.text}>
                {d.name} ({d.ip}:{d.port})
              </Text>
              <TouchableOpacity style={styles.smallButton} onPress={() => connectToReceiver(d)}>
                <Text style={styles.buttonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          ))}

          {isConnected && (
            <View style={styles.controlsContainer}>
              <Text style={styles.subheading}>Media Controls</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={() => sendMedia("PLAY")}>
                  <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => sendMedia("PAUSE")}>
                  <Text style={styles.buttonText}>Pause</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    height: 40,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#34C759",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  smallButton: {
    backgroundColor: "#5856D6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  hr: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 15,
  },
  controlsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
});

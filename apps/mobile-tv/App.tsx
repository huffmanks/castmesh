import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ReceiverView } from "./components/receiver-view";
import { SenderView } from "./components/send-view";

export default function App() {
  const [mode, setMode] = useState<"receiver" | "sender">("sender");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CastMesh</Text>

      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.button, mode === "receiver" && styles.activeButton]}
          onPress={() => setMode("receiver")}
        >
          <Text style={styles.buttonText}>Receiver Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, mode === "sender" && styles.activeButton]}
          onPress={() => setMode("sender")}
        >
          <Text style={styles.buttonText}>Sender Mode</Text>
        </TouchableOpacity>
      </View>

      {mode === "receiver" ? <ReceiverView /> : <SenderView />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
});

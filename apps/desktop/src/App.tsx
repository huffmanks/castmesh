import { PairedDevice, useCastingStore } from "@castmesh/core";
import { useState } from "react";

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
        alert("Successfully connected!");
      } else {
        alert("Pairing failed: Invalid code");
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
    <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px" }}>
      <h2>Universal P2P Casting</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setReceiverMode(true)}>Receiver Mode</button>
        <button onClick={() => setReceiverMode(false)} style={{ marginLeft: "10px" }}>
          Sender Mode
        </button>
      </div>

      <hr />

      {isReceiver ? (
        <div>
          <h3>Receiver Mode</h3>
          <p>
            Your Pairing Code: <strong>{pairingCode}</strong>
          </p>
          <p>Status: Listening for incoming connections...</p>
        </div>
      ) : (
        <div>
          <h3>Sender Mode</h3>
          <h4>Pair New Device</h4>
          <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
            <input
              placeholder="IP (e.g. 192.168.1.50)"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              style={{ flex: 2 }}
            />
            <input
              placeholder="Port"
              value={inputPort}
              onChange={(e) => setInputPort(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
            <input
              placeholder="Pairing Code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={() =>
                connectToReceiver({
                  id: inputIp,
                  name: `Device (${inputIp})`,
                  ip: inputIp,
                  port: parseInt(inputPort),
                  pairingCode: inputCode,
                })
              }
            >
              Pair & Connect
            </button>
          </div>

          <h4>Saved Devices</h4>
          <ul>
            {pairedDevices.length === 0 && <li>No saved devices</li>}
            {pairedDevices.map((d) => (
              <li key={d.id} style={{ marginBottom: "5px" }}>
                {d.name} ({d.ip}:{d.port}){" "}
                <button onClick={() => connectToReceiver(d)}>Connect</button>
              </li>
            ))}
          </ul>

          {isConnected && (
            <div style={{ marginTop: "20px", padding: "10px", background: "#f0f0f0" }}>
              <h4>Media Controls</h4>
              <button onClick={() => sendMedia("PLAY")}>Play</button>
              <button onClick={() => sendMedia("PAUSE")} style={{ marginLeft: "10px" }}>
                Pause
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

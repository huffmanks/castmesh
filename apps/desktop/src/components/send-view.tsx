import { useCastingStore } from "@castmesh/core";
import { useState } from "react";

export function SenderView() {
  const savedDevices = useCastingStore((state) => state.savedDevices);

  const [inputIp, setInputIp] = useState("");
  const [inputPort, setInputPort] = useState("8080");
  const [inputCode, setInputCode] = useState("");

  return (
    <section>
      <h3>Sender Mode</h3>

      <h4>Pair New Device</h4>

      <input
        placeholder="Receiver IP"
        value={inputIp}
        onChange={(event) => setInputIp(event.target.value)}
      />

      <input
        placeholder="Port"
        value={inputPort}
        onChange={(event) => setInputPort(event.target.value)}
      />

      <input
        placeholder="Pairing Code"
        value={inputCode}
        onChange={(event) => setInputCode(event.target.value)}
      />

      <button
        onClick={() => {
          console.log({
            address: inputIp,
            port: Number(inputPort),
            pairingCode: inputCode,
          });
        }}
      >
        Pair & Connect
      </button>

      <h4>Saved Devices</h4>

      {savedDevices.length === 0 ? (
        <p>No saved devices</p>
      ) : (
        <ul>
          {savedDevices.map((device) => (
            <li key={device.id}>
              {device.name}
              <button onClick={() => console.log("Connect to", device.id)}>Connect</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { type PairedDevice, useCastingStore } from "@castmesh/core";

document.body.innerHTML = `
  <div style="font-family: sans-serif; padding: 20px;">
    <h2>Universal P2P Casting</h2>
    <div id="mode-selector">
      <button id="btn-receiver">Switch to Receiver</button>
      <button id="btn-sender">Switch to Sender</button>
    </div>
    <hr />
    <div id="app-view"></div>
  </div>
`;

const view = document.getElementById("app-view")!;
const store = useCastingStore.getState();

function render() {
  const state = useCastingStore.getState();

  if (state.isReceiver) {
    view.innerHTML = `
      <h3>Receiver Mode</h3>
      <p>Your Pairing Code: <strong>${state.pairingCode}</strong></p>
      <p>Status: Listening for incoming direct connections...</p>
    `;
  } else {
    const savedHtml = state.pairedDevices
      .map(
        (d) => `
        <li>
          ${d.name} (${d.ip}:${d.port})
          <button onclick="window.connectToDevice('${d.id}')">Connect</button>
        </li>
      `,
      )
      .join("");

    view.innerHTML = `
      <h3>Sender Mode</h3>
      <h4>Pair New Device</h4>
      <input id="ip-input" placeholder="Receiver IP (e.g. 192.168.1.50)" />
      <input id="port-input" value="8080" style="width: 60px;" />
      <input id="code-input" placeholder="Pairing Code" style="width: 100px;" />
      <button id="pair-btn">Pair & Connect</button>

      <h4>Saved Devices</h4>
      <ul>${savedHtml || "<li>No saved devices</li>"}</ul>

      <div id="media-controls" style="display:none; margin-top: 20px;">
        <h4>Casting Controls</h4>
        <button onclick="window.sendMedia('PLAY')">Play</button>
        <button onclick="window.sendMedia('PAUSE')">Pause</button>
      </div>
    `;

    document.getElementById("pair-btn")?.addEventListener("click", () => {
      const ip = (document.getElementById("ip-input") as HTMLInputElement).value;
      const port = parseInt((document.getElementById("port-input") as HTMLInputElement).value);
      const code = (document.getElementById("code-input") as HTMLInputElement).value;

      connectToReceiver({ id: ip, name: `Receiver (${ip})`, ip, port, pairingCode: code });
    });
  }
}

function connectToReceiver(device: PairedDevice) {
  console.log(`Connecting directly to ${device.ip}:${device.port}...`);
  const ws = new WebSocket(`ws://${device.ip}:${device.port}`);

  ws.onopen = () => {
    console.log("Connected! Sending pairing verification...");
    ws.send(JSON.stringify({ type: "PAIR_REQ", code: device.pairingCode }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "PAIR_RES" && msg.payload.success) {
      alert("Successfully paired and connected!");
      store.addPairedDevice(device);
      store.setActiveSocket(ws);
      document.getElementById("media-controls")!.style.display = "block";
      render();
    } else {
      alert("Pairing failed: Invalid code");
      ws.close();
    }
  };

  ws.onerror = (err) => {
    console.error("Connection error:", err);
    alert("Could not connect to receiver IP.");
  };
}

(window as any).connectToDevice = (id: string) => {
  const device = useCastingStore.getState().pairedDevices.find((d) => d.id === id);
  if (device) connectToReceiver(device);
};

(window as any).sendMedia = (action: string) => {
  const socket = useCastingStore.getState().activeSocket;
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "MEDIA_CONTROL", payload: { action } }));
    console.log(`Sent command: ${action}`);
  }
};

document.getElementById("btn-receiver")!.addEventListener("click", () => {
  store.setReceiverMode(true);
  render();
});

document.getElementById("btn-sender")!.addEventListener("click", () => {
  store.setReceiverMode(false);
  render();
});

useCastingStore.subscribe(render);
render();

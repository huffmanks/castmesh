import { useCastingStore } from "@castmesh/core";
import { useReceiver } from "@castmesh/react";
import { receiverService } from "../network";

export function ReceiverView() {
  const pairingCode = useCastingStore((state) => state.pairingCode);
  const { receiverInfo, connectedDevices, status } = useReceiver(receiverService, pairingCode);

  return (
    <section>
      <h3>Receiver Mode</h3>

      <p>
        Pairing Code: <strong>{pairingCode}</strong>
      </p>

      <p>
        Status: {status === "starting" && "Starting receiver..."}
        {status === "listening" && "Listening for connections"}
        {status === "stopped" && "Receiver stopped"}
        {status === "error" && "Receiver failed to start"}
      </p>

      {receiverInfo && (
        <p>
          Host: {receiverInfo.host}:{receiverInfo.port}
        </p>
      )}

      <h4>Connected Devices</h4>

      {connectedDevices.length === 0 ? (
        <p>No connected devices</p>
      ) : (
        <ul>
          {connectedDevices.map((device) => (
            <li key={device.id}>
              {device.name} ({device.address})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

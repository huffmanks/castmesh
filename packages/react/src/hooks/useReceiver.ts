import type { ReceiverCallbacks, ReceiverInfo, ReceiverService, SavedDevice } from "@castmesh/core";
import { useEffect, useState } from "react";

type ReceiverStatus = "stopped" | "starting" | "listening" | "error";

export function useReceiver(service: ReceiverService, pairingCode: string) {
  const [status, setStatus] = useState<ReceiverStatus>("stopped");
  const [receiverInfo, setReceiverInfo] = useState<ReceiverInfo | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<SavedDevice[]>([]);

  useEffect(() => {
    let active = true;

    const callbacks: ReceiverCallbacks = {
      onDeviceConnected(device) {
        if (!active) return;

        setConnectedDevices((current) => [
          ...current.filter((item) => item.id !== device.id),
          device,
        ]);
      },

      onDeviceDisconnected(deviceId) {
        if (!active) return;

        setConnectedDevices((current) => current.filter((device) => device.id !== deviceId));
      },

      onError(error) {
        if (!active) return;

        console.error("Receiver error:", error);
        setStatus("error");
      },
    };

    async function start() {
      setStatus("starting");

      try {
        const info = await service.start(pairingCode, callbacks);

        if (!active) {
          await service.stop();
          return;
        }

        setReceiverInfo(info);
        setStatus("listening");
      } catch (error) {
        if (!active) return;

        console.error("Could not start receiver:", error);
        setStatus("error");
      }
    }

    void start();

    return () => {
      active = false;
      void service.stop();
    };
  }, [service, pairingCode]);

  return {
    status,
    receiverInfo,
    connectedDevices,
  };
}

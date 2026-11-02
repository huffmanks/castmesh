export type DeviceMode = "sender" | "receiver";

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

export interface SavedDevice {
  id: string;
  name: string;
  host: string;
  port: number;
  pairedAt: number;
  lastConnectedAt?: number;
}

export type CastingMessage =
  | {
      version: 1;
      type: "pair.request";
      payload: {
        requestId: string;
        code: string;
      };
    }
  | {
      version: 1;
      type: "pair.response";
      payload: {
        requestId: string;
        accepted: boolean;
      };
    }
  | {
      version: 1;
      type: "connection.ping" | "connection.pong";
      payload: {
        id: string;
      };
    };

export interface ReceiverInfo {
  host: string;
  port: number;
}

export interface ReceiverCallbacks {
  onDeviceConnected(device: SavedDevice): void;
  onDeviceDisconnected(deviceId: SavedDevice["id"]): void;
  onError(error: Error): void;
}

export interface ReceiverService {
  start(pairingCode: string, callbacks: ReceiverCallbacks): Promise<ReceiverInfo>;
  stop(): Promise<void>;
}

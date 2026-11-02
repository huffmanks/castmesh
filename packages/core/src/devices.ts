import type { SavedDevice } from "./types";

export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export interface DeviceRepository {
  list(): Promise<SavedDevice[]>;
  save(device: SavedDevice): Promise<void>;
  remove(id: string): Promise<void>;
}

const STORAGE_KEY = "castmesh.saved-devices.v1";

function isSavedDevice(value: unknown): value is SavedDevice {
  if (typeof value !== "object" || value === null) return false;

  const device = value as Record<string, unknown>;

  return (
    typeof device.id === "string" &&
    typeof device.name === "string" &&
    typeof device.host === "string" &&
    typeof device.port === "number" &&
    Number.isInteger(device.port) &&
    device.port > 0 &&
    device.port <= 65535 &&
    typeof device.pairedAt === "number"
  );
}

export function createDeviceRepository(storage: KeyValueStorage): DeviceRepository {
  async function read(): Promise<SavedDevice[]> {
    const raw = await storage.getItem(STORAGE_KEY);

    if (!raw) return [];

    try {
      const value: unknown = JSON.parse(raw);

      return Array.isArray(value) ? value.filter(isSavedDevice) : [];
    } catch {
      return [];
    }
  }

  async function write(devices: SavedDevice[]): Promise<void> {
    await storage.setItem(STORAGE_KEY, JSON.stringify(devices));
  }

  return {
    list: read,

    async save(device) {
      if (!isSavedDevice(device)) {
        throw new Error("Invalid saved device.");
      }

      const devices = await read();

      await write([...devices.filter((item) => item.id !== device.id), device]);
    },

    async remove(id) {
      const devices = await read();

      await write(devices.filter((device) => device.id !== id));
    },
  };
}

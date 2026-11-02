import { describe, expect, it } from "vite-plus/test";

import type { KeyValueStorage } from "./devices";
import { createDeviceRepository } from "./devices";
import type { SavedDevice } from "./types";

function createMemoryStorage(): KeyValueStorage {
  const data = new Map<string, string>();

  return {
    async getItem(key) {
      return data.get(key) ?? null;
    },

    async setItem(key, value) {
      data.set(key, value);
    },
  };
}

const device: SavedDevice = {
  id: "device-1",
  name: "Living Room TV",
  host: "192.168.1.50",
  port: 8080,
  pairedAt: 1_700_000_000_000,
};

describe("device repository", () => {
  it("returns an empty list when no devices are saved", async () => {
    const repository = createDeviceRepository(createMemoryStorage());

    expect(await repository.list()).toEqual([]);
  });

  it("saves and retrieves a device", async () => {
    const repository = createDeviceRepository(createMemoryStorage());

    await repository.save(device);

    expect(await repository.list()).toEqual([device]);
  });

  it("updates an existing device", async () => {
    const repository = createDeviceRepository(createMemoryStorage());

    await repository.save(device);
    await repository.save({ ...device, name: "Updated TV" });

    expect(await repository.list()).toHaveLength(1);
    expect((await repository.list())[0]?.name).toBe("Updated TV");
  });

  it("removes a device", async () => {
    const repository = createDeviceRepository(createMemoryStorage());

    await repository.save(device);
    await repository.remove(device.id);

    expect(await repository.list()).toEqual([]);
  });

  it("handles invalid stored JSON", async () => {
    const storage = createMemoryStorage();

    await storage.setItem("castmesh.saved-devices.v1", "{invalid");

    const repository = createDeviceRepository(storage);

    expect(await repository.list()).toEqual([]);
  });

  it("does not return malformed saved devices", async () => {
    const storage = createMemoryStorage();

    await storage.setItem("castmesh.saved-devices.v1", JSON.stringify([{ id: "bad-device" }]));

    const repository = createDeviceRepository(storage);

    expect(await repository.list()).toEqual([]);
  });
});

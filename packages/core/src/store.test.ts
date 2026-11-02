import { beforeEach, describe, expect, it } from "vite-plus/test";

import { useCastingStore } from "./store";
import type { SavedDevice } from "./types";

const device: SavedDevice = {
  id: "device-1",
  name: "Living Room TV",
  host: "192.168.1.50",
  port: 8080,
  pairedAt: 1_700_000_000_000,
};

describe("casting store", () => {
  beforeEach(() => {
    useCastingStore.setState({
      mode: "sender",
      pairingCode: "123456",
      connectionStatus: "disconnected",
      savedDevices: [],
    });
  });

  it("starts in sender mode", () => {
    expect(useCastingStore.getState().mode).toBe("sender");
  });

  it("switches between sender and receiver", () => {
    useCastingStore.getState().setMode("receiver");

    expect(useCastingStore.getState().mode).toBe("receiver");
  });

  it("updates the pairing code", () => {
    useCastingStore.getState().setPairingCode("654321");

    expect(useCastingStore.getState().pairingCode).toBe("654321");
  });

  it("updates connection status", () => {
    useCastingStore.getState().setConnectionStatus("connected");

    expect(useCastingStore.getState().connectionStatus).toBe("connected");
  });

  it("saves a device", () => {
    useCastingStore.getState().saveDevice(device);

    expect(useCastingStore.getState().savedDevices).toEqual([device]);
  });

  it("updates an existing device instead of duplicating it", () => {
    const store = useCastingStore.getState();

    store.saveDevice(device);
    store.saveDevice({ ...device, name: "Updated TV" });

    expect(useCastingStore.getState().savedDevices).toHaveLength(1);
    expect(useCastingStore.getState().savedDevices[0]?.name).toBe("Updated TV");
  });

  it("removes a saved device", () => {
    const store = useCastingStore.getState();

    store.saveDevice(device);
    store.removeDevice(device.id);

    expect(useCastingStore.getState().savedDevices).toEqual([]);
  });
});

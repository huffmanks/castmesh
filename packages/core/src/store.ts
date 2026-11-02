import { create } from "zustand";

import { generatePairingCode } from "./protocol";
import type { ConnectionStatus, DeviceMode, SavedDevice } from "./types";

interface CastingState {
  mode: DeviceMode;
  pairingCode: string;
  connectionStatus: ConnectionStatus;
  savedDevices: SavedDevice[];

  setMode: (mode: DeviceMode) => void;
  setPairingCode: (code: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  saveDevice: (device: SavedDevice) => void;
  removeDevice: (id: string) => void;
}

export const useCastingStore = create<CastingState>((set) => ({
  mode: "sender",
  pairingCode: generatePairingCode(),
  connectionStatus: "disconnected",
  savedDevices: [],

  setMode: (mode) => set({ mode }),

  setPairingCode: (pairingCode) => set({ pairingCode }),

  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  saveDevice: (device) =>
    set((state) => ({
      savedDevices: [...state.savedDevices.filter((item) => item.id !== device.id), device],
    })),

  removeDevice: (id) =>
    set((state) => ({
      savedDevices: state.savedDevices.filter((device) => device.id !== id),
    })),
}));

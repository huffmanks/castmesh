import { create } from "zustand";

export interface PairedDevice {
  id: string;
  name: string;
  ip: string;
  port: number;
  pairingCode: string;
}

export interface CastingMessage {
  type: "PAIR_REQ" | "PAIR_RES" | "MEDIA_CONTROL";
  code?: string;
  payload?: any;
}

interface CastingCoreState {
  isReceiver: boolean;
  pairingCode: string;
  pairedDevices: PairedDevice[];
  activeSocket: WebSocket | null;
  setReceiverMode: (isReceiver: boolean) => void;
  setPairingCode: (code: string) => void;
  addPairedDevice: (device: PairedDevice) => void;
  removePairedDevice: (id: string) => void;
  setActiveSocket: (socket: WebSocket | null) => void;
}

export const useCastingStore = create<CastingCoreState>((set) => ({
  isReceiver: false,
  pairingCode: Math.floor(1000 + Math.random() * 9000).toString(),
  pairedDevices: [],
  activeSocket: null,
  setReceiverMode: (isReceiver) => set({ isReceiver }),
  setPairingCode: (pairingCode) => set({ pairingCode }),
  addPairedDevice: (device) =>
    set((state) => ({
      pairedDevices: [...state.pairedDevices.filter((d) => d.id !== device.id), device],
    })),
  removePairedDevice: (id) =>
    set((state) => ({
      pairedDevices: state.pairedDevices.filter((d) => d.id !== id),
    })),
  setActiveSocket: (activeSocket) => set({ activeSocket }),
}));

export function generatePairingCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function createPairingRequestMessage(code: string): string {
  return JSON.stringify({ type: "PAIR_REQ", code });
}

export function createPairingResponseMessage(success: boolean): string {
  return JSON.stringify({ type: "PAIR_RES", payload: { success } });
}

export function createMediaControlMessage(action: string, data?: any): string {
  return JSON.stringify({ type: "MEDIA_CONTROL", payload: { action, ...data } });
}

export function parseCastingMessage(rawMessage: string): CastingMessage | null {
  try {
    return JSON.parse(rawMessage) as CastingMessage;
  } catch {
    return null;
  }
}

export function validatePairingCode(inputCode: string, actualCode: string): boolean {
  return inputCode.trim() === actualCode.trim();
}

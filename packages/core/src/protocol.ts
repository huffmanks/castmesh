import type { CastingMessage } from "./types";

const VERSION = 1;
const PAIRING_CODE_LENGTH = 6;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isValidPairingCode(code: string): boolean {
  return new RegExp(`^\\d{${PAIRING_CODE_LENGTH}}$`).test(code);
}

export function generatePairingCode(): string {
  const crypto = globalThis.crypto;

  if (!crypto?.getRandomValues) {
    throw new Error("A cryptographically secure random generator is required.");
  }

  const range = 1_000_000;
  const limit = Math.floor(0x1_0000_0000 / range) * range;
  const values = new Uint32Array(1);

  do {
    crypto.getRandomValues(values);
  } while (values[0]! >= limit);

  return String(values[0]! % range).padStart(PAIRING_CODE_LENGTH, "0");
}

export function validatePairingCode(input: string, expected: string): boolean {
  return isValidPairingCode(input) && isValidPairingCode(expected) && input === expected;
}

export function createPairingRequestMessage(code: string, requestId: string): string {
  if (!isValidPairingCode(code)) {
    throw new Error("Pairing code must contain exactly six digits.");
  }

  if (!requestId.trim()) {
    throw new Error("A request ID is required.");
  }

  const message: CastingMessage = {
    version: VERSION,
    type: "pair.request",
    payload: { requestId, code },
  };

  return JSON.stringify(message);
}

export function createPairingResponseMessage(requestId: string, accepted: boolean): string {
  const message: CastingMessage = {
    version: VERSION,
    type: "pair.response",
    payload: { requestId, accepted },
  };

  return JSON.stringify(message);
}

export function parseCastingMessage(raw: string): CastingMessage | null {
  let value: unknown;

  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(value) || value.version !== VERSION) {
    return null;
  }

  if (!isRecord(value.payload)) {
    return null;
  }

  const payload = value.payload;

  switch (value.type) {
    case "pair.request":
      if (
        typeof payload.requestId === "string" &&
        payload.requestId.length > 0 &&
        typeof payload.code === "string" &&
        isValidPairingCode(payload.code)
      ) {
        return value as CastingMessage;
      }
      return null;

    case "pair.response":
      if (
        typeof payload.requestId === "string" &&
        payload.requestId.length > 0 &&
        typeof payload.accepted === "boolean"
      ) {
        return value as CastingMessage;
      }
      return null;

    case "connection.ping":
    case "connection.pong":
      if (typeof payload.id === "string" && payload.id.length > 0) {
        return value as CastingMessage;
      }
      return null;

    default:
      return null;
  }
}

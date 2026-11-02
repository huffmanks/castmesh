import { describe, expect, it } from "vite-plus/test";

import {
  createPairingRequestMessage,
  createPairingResponseMessage,
  generatePairingCode,
  isValidPairingCode,
  parseCastingMessage,
  validatePairingCode,
} from "./protocol";

describe("pairing codes", () => {
  it("generates a six-digit code", () => {
    const code = generatePairingCode();

    expect(code).toMatch(/^\d{6}$/);
  });

  it("validates six-digit codes", () => {
    expect(isValidPairingCode("123456")).toBe(true);
    expect(isValidPairingCode("12345")).toBe(false);
    expect(isValidPairingCode("1234567")).toBe(false);
    expect(isValidPairingCode("abcdef")).toBe(false);
  });

  it("compares pairing codes", () => {
    expect(validatePairingCode("123456", "123456")).toBe(true);
    expect(validatePairingCode("123456", "654321")).toBe(false);
    expect(validatePairingCode(" 123456 ", "123456")).toBe(false);
  });
});

describe("casting protocol", () => {
  it("creates a pairing request", () => {
    const raw = createPairingRequestMessage("123456", "request-1");
    const message = parseCastingMessage(raw);

    expect(message).toEqual({
      version: 1,
      type: "pair.request",
      payload: {
        requestId: "request-1",
        code: "123456",
      },
    });
  });

  it("rejects invalid pairing codes when creating requests", () => {
    expect(() => createPairingRequestMessage("123", "request-1")).toThrow();
  });

  it("creates a pairing response", () => {
    const raw = createPairingResponseMessage("request-1", true);

    expect(parseCastingMessage(raw)).toEqual({
      version: 1,
      type: "pair.response",
      payload: {
        requestId: "request-1",
        accepted: true,
      },
    });
  });

  it("rejects invalid JSON", () => {
    expect(parseCastingMessage("{invalid")).toBeNull();
  });

  it("rejects unsupported protocol versions", () => {
    expect(
      parseCastingMessage(
        JSON.stringify({
          version: 2,
          type: "pair.request",
          payload: { requestId: "request-1", code: "123456" },
        }),
      ),
    ).toBeNull();
  });

  it("rejects malformed messages", () => {
    expect(
      parseCastingMessage(
        JSON.stringify({
          version: 1,
          type: "pair.request",
          payload: { requestId: "request-1", code: "bad" },
        }),
      ),
    ).toBeNull();
  });

  it("rejects unknown message types", () => {
    expect(
      parseCastingMessage(
        JSON.stringify({
          version: 1,
          type: "unknown",
          payload: {},
        }),
      ),
    ).toBeNull();
  });
});

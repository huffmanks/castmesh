import type { ReceiverService } from "@castmesh/core";

export const receiverService: ReceiverService = {
  async start(pairingCode, callbacks) {
    throw new Error("TV receiver adapter is not implemented");
  },

  async stop() {},
};

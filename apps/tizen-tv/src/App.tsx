import { useCastingStore } from "@castmesh/core";
import { ReceiverView } from "./components/receiver-view";
import { SenderView } from "./components/send-view";

export default function App() {
  const mode = useCastingStore((state) => state.mode);
  const setMode = useCastingStore((state) => state.setMode);

  return (
    <main>
      <h2>CastMesh</h2>

      <nav>
        <button onClick={() => setMode("receiver")}>Receiver Mode</button>
        <button onClick={() => setMode("sender")}>Sender Mode</button>
      </nav>

      {mode === "receiver" ? <ReceiverView /> : <SenderView />}
    </main>
  );
}

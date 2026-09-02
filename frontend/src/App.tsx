/**
 * App shell and routing. OWNER: Member 4 (Prep Flow).
 *
 * Three screens only. Resist adding a fourth.
 *   /            pick subject → strand → sub-strand, set context
 *   /pack/:id    read the pack (this screen must work with no network)
 *   /saved       packs already on this device
 */
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OfflineBanner } from './offline/OfflineBanner.js';
import { PackView } from './features/pack/PackView.js';
import { PrepFlow } from './features/prep/PrepFlow.js';
import { SavedPacks } from './features/pack/SavedPacks.js';

export function App() {
  return (
    <BrowserRouter>
      <OfflineBanner />
      <main className="app">
        <Routes>
          <Route path="/" element={<PrepFlow />} />
          <Route path="/pack/:id" element={<PackView />} />
          <Route path="/saved" element={<SavedPacks />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

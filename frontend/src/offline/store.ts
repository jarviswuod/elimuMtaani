/**
 * Offline pack storage. OWNER: Member 5 (Offline, Print & Share).
 *
 * IndexedDB, not localStorage — packs are large structured objects and
 * localStorage has a ~5MB string-only budget.
 */
import type { Pack, StoredPack } from '@elimu/shared';
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'elimu';
const STORE = 'packs';

let dbPromise: Promise<IDBPDatabase> | null = null;

function db() {
  dbPromise ??= openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE, { keyPath: 'pack.id' });
      }
    },
  });
  return dbPromise;
}

export async function savePack(pack: Pack): Promise<void> {
  const stored: StoredPack = { pack, savedAt: new Date().toISOString(), verifiedOffline: false };
  await (await db()).put(STORE, stored);
}

export async function loadPack(id: string): Promise<StoredPack | undefined> {
  return (await db()).get(STORE, id);
}

export async function listPacks(): Promise<StoredPack[]> {
  return (await db()).getAll(STORE);
}

// TODO(M5): markVerifiedOffline(id) — set verifiedOffline once the pack has been
// opened with navigator.onLine === false. This powers the "works offline" badge,
// which is the single most persuasive thing in the demo.

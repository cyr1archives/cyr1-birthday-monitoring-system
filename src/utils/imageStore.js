const DB_NAME = "cyr1_images";
const STORE = "images";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveImage(id, dataUrl) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(dataUrl, id);
  return tx.complete;
}

export async function loadImage(id) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  return new Promise(resolve => {
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
  });
}

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = getApps().length === 0
  ? initializeApp({
    projectId: "sofvanh"
  })
  : getApps()[0];

export const db = getFirestore(app);
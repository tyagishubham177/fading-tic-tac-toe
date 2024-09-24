import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { INITIAL_GAME_STATE } from "../components/constants";

export const createGameRoom = async (roomId, username) => {
  const gameDoc = doc(db, "games", roomId);
  await setDoc(gameDoc, {
    ...INITIAL_GAME_STATE,
    players: { X: username },
    createdAt: serverTimestamp(),
  });
};

export const joinGameRoom = async (roomId, username) => {
  const gameDoc = doc(db, "games", roomId);
  const docSnap = await getDoc(gameDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const players = data.players || {};
    if (!players.O) {
      await updateDoc(gameDoc, {
        "players.O": username,
      });
      return true;
    }
  }
  return false;
};

export const updateGameState = async (roomId, newState) => {
  const gameDoc = doc(db, "games", roomId);
  await updateDoc(gameDoc, newState);
};

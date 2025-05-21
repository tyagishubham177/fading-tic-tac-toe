import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { INITIAL_GAME_STATE, PLAYER_X, PLAYER_O } from "../components/constants";

export const createGameRoom = async (roomId, username) => {
  try {
    const gameDoc = doc(db, "games", roomId);
    await setDoc(gameDoc, {
      ...INITIAL_GAME_STATE,
      players: { [PLAYER_X]: username },
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating game room:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export const joinGameRoom = async (roomId, username) => {
  const gameDoc = doc(db, "games", roomId);
  try {
    const docSnap = await getDoc(gameDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const players = data.players || {};
      if (!players[PLAYER_O]) {
        try {
          await updateDoc(gameDoc, {
            [`players.${PLAYER_O}`]: username,
          });
          return true;
        } catch (updateError) {
          console.error("Error updating game room for join:", updateError);
          throw updateError; // Re-throw the error for the caller to handle
        }
      } else {
        // Room is full (player O already exists)
        return false;
      }
    } else {
      // Room does not exist
      return false;
    }
  } catch (getError) {
    console.error("Error getting game room for join:", getError);
    throw getError; // Re-throw the error for the caller to handle
  }
};

export const updateGameState = async (roomId, newState) => {
  try {
    const gameDoc = doc(db, "games", roomId);
    await updateDoc(gameDoc, newState);
  } catch (error) {
    console.error("Error updating game state:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

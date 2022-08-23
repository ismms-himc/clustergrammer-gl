import { LOCAL_STORAGE_KEY } from "../constants/state";

export function loadState() {
  try {
    const serialized = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serialized === null) {
      return undefined;
    }
    return JSON.parse(serialized);
  } catch (error) {
    return undefined;
  }
}

export function saveState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
  } catch (error) {
    console.error(error);
    console.error("Failed to save state", state);
  }
}

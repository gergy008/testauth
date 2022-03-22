import { fApp } from './firebase.js'
import { getDatabase } from "firebase/database";

export const db = getDatabase(fApp);
export default db
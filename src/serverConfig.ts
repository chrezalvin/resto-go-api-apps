import { createClient } from "@supabase/supabase-js";
import {config} from "dotenv"; config();

import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore/lite";

export const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";
export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY ?? "";
export const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL ?? "";
export const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const port = process.env.PORT || 3000;
export const websocketPort = parseInt(process.env.WEBSOCKET_PORT || "8080");

if(SUPABASE_URL === "" || SUPABASE_KEY === "") {
    console.warn("Warning: Couldn't find SUPABASE DATABASE credentials in .env");
    console.warn("Warning: database feature will be disabled");
}

const firebase_config = JSON.parse(process.env.FIREBASE_CONFIG ?? "{}");
// check if firebase_config actually have JSON data
if(Object.keys(firebase_config).length === 0)
    throw new Error("Couldn't find FIREBASE_CONFIG in .env");

if(MIDTRANS_SERVER_KEY === "" || MIDTRANS_BASE_URL === "")
    throw new Error("Couldn't find MIDTRANS_SERVER_KEY or MIDTRANS_BASE_URL in .env");

if(JWT_SECRET === "")
    throw new Error("Couldn't find JWT_SECRET in .env");

export const firebaseApp = initializeApp(firebase_config);
export const firestore = getFirestore(firebaseApp);

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
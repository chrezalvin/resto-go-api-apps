"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.firestore = exports.firebaseApp = exports.port = exports.SUPABASE_KEY = exports.SUPABASE_URL = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app_1 = require("firebase/app");
const lite_1 = require("firebase/firestore/lite");
exports.SUPABASE_URL = process.env.SUPABASE_URL ?? "";
exports.SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";
exports.port = process.env.PORT || 3000;
if (exports.SUPABASE_URL === "" || exports.SUPABASE_KEY === "") {
    console.warn("Warning: Couldn't find SUPABASE DATABASE credentials in .env");
    console.warn("Warning: database feature will be disabled");
}
const firebase_config = JSON.parse(process.env.FIREBASE_CONFIG ?? "{}");
// check if firebase_config actually have JSON data
if (Object.keys(firebase_config).length === 0)
    throw new Error("Couldn't find FIREBASE_CONFIG in .env");
exports.firebaseApp = (0, app_1.initializeApp)(firebase_config);
exports.firestore = (0, lite_1.getFirestore)(exports.firebaseApp);
exports.supabase = (0, supabase_js_1.createClient)(exports.SUPABASE_URL, exports.SUPABASE_KEY);

// src/pusher.js
import Pusher from 'pusher-js';

const key = "0686519168d9a0953500"; // chỉ dùng key, KHÔNG secret
const cluster = "ap1";

let pusher = null;

if (key && cluster) {
    pusher = new Pusher(key, {
        cluster,
        forceTLS: true,
    });
} else {
    if (import.meta.env.DEV) {
        console.warn('[Pusher] Missing PUSHER_KEY or PUSHER_CLUSTER');
    }
}

export default pusher;

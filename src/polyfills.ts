// src/polyfills.ts

import { Buffer } from 'buffer';
import process from 'process';

// Make Buffer and process globally available in the browser
window.Buffer = Buffer;
window.process = process;

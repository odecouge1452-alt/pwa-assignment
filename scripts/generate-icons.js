import fs from 'fs';
import zlib from 'zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const body = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, body, crcBuf]);
}

function generatePng(size) {
  // RGBA buffer
  const width = size;
  const height = size;
  
  // Background: #1d1d1b -> R=0x1d (29), G=0x1d (29), B=0x1b (27), A=255
  // Letter "N" or Note icon in center with white: R=255, G=255, B=255, A=255
  const rawData = Buffer.alloc(height * (1 + width * 4));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter byte: 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Draw an "N" shape
      // Margin: 25% from left, right, top, bottom
      const left = Math.round(width * 0.28);
      const right = Math.round(width * 0.72);
      const top = Math.round(height * 0.25);
      const bottom = Math.round(height * 0.75);
      const stemWidth = Math.max(Math.round(size * 0.08), 2);

      let isWhite = false;

      if (y >= top && y <= bottom) {
        // Left vertical stem
        if (x >= left && x <= left + stemWidth) {
          isWhite = true;
        }
        // Right vertical stem
        else if (x >= right - stemWidth && x <= right) {
          isWhite = true;
        }
        // Diagonal connection
        else {
          const progress = (y - top) / (bottom - top);
          const diagX = left + progress * (right - left);
          if (x >= diagX - stemWidth / 2 && x <= diagX + stemWidth / 2) {
            isWhite = true;
          }
        }
      }

      if (isWhite) {
        rawData[pxOffset] = 255;
        rawData[pxOffset + 1] = 255;
        rawData[pxOffset + 2] = 255;
        rawData[pxOffset + 3] = 255;
      } else {
        rawData[pxOffset] = 0x1d;
        rawData[pxOffset + 1] = 0x1d;
        rawData[pxOffset + 2] = 0x1b;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const icon192 = generatePng(192);
fs.writeFileSync('public/icon-192.png', icon192);
console.log('Created public/icon-192.png (' + icon192.length + ' bytes)');

const icon512 = generatePng(512);
fs.writeFileSync('public/icon-512.png', icon512);
console.log('Created public/icon-512.png (' + icon512.length + ' bytes)');

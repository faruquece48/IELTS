import fs from "node:fs/promises";
import path from "node:path";
import { deflateSync } from "node:zlib";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "app", "quran");
const destination = path.join(root, "public", "quran.pdf");
const firstScan = 1;
const lastScan = 611;
const scanCount = lastScan - firstScan + 1;
const navigationPageCount = 3;

const surahNames = [
  "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal",
  "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf",
  "Maryam", "Taha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml",
  "Al-Qasas", "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin",
  "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shuraa", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah",
  "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar",
  "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah",
  "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba",
  "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq",
  "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duhaa", "Ash-Sharh", "At-Tin",
  "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takathur", "Al-'Asr",
  "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas",
  "Al-Falaq", "An-Nas",
];

const surahPages = [
  2, 3, 51, 78, 107, 129, 152, 178, 188, 209, 222, 236, 250, 256, 262, 268, 283, 294, 306,
  313, 323, 332, 343, 351, 360, 367, 377, 386, 397, 405, 412, 416, 419, 429, 435, 441, 446, 453,
  459, 468, 478, 484, 490, 496, 499, 503, 507, 512, 516, 519, 521, 524, 527, 529, 532, 535, 538,
  543, 546, 550, 552, 554, 555, 557, 559, 561, 563, 565, 568, 570, 572, 574, 577, 579, 581, 583,
  585, 587, 588, 590, 591, 592, 593, 595, 596, 597, 598, 598, 599, 601, 601, 602, 603, 603, 604,
  604, 605, 605, 606, 606, 607, 607, 608, 608, 608, 609, 609, 609, 610, 610, 610, 611, 611, 611,
];

if (surahNames.length !== 114 || surahPages.length !== 114) {
  throw new Error("The Surah navigation must contain all 114 Surahs.");
}

const escapePdfText = (value) => value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
const objects = [];
let nextObject = 4;

const scanObjects = Array.from({ length: scanCount }, () => ({
  page: nextObject++,
  content: nextObject++,
  image: nextObject++,
}));

const navigationGroups = Array.from({ length: navigationPageCount }, (_, index) => {
  const start = index * 38;
  return surahNames.slice(start, start + 38).map((name, groupIndex) => ({
    number: start + groupIndex + 1,
    name,
    scan: surahPages[start + groupIndex],
  }));
});

const navigationObjects = navigationGroups.map((entries) => ({
  page: nextObject++,
  content: nextObject++,
  annotations: entries.map(() => nextObject++),
}));

const objectCount = nextObject - 1;
objects[1] = Buffer.from(`<< /Type /Catalog /Pages 2 0 R /PageMode /UseNone /OpenAction [${scanObjects[0].page} 0 R /Fit] >>`);
objects[3] = Buffer.from("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

for (let index = 0; index < scanCount; index += 1) {
  const scanNumber = firstScan + index;
  const ids = scanObjects[index];
  const input = await fs.readFile(path.join(source, `quran_${scanNumber}.png`));
  let imageObjectData;
  let info;

  if (scanNumber !== 1) {
    const converted = await sharp(input).grayscale().raw().toBuffer({ resolveWithObject: true });
    info = converted.info;
    const compressed = deflateSync(converted.data, { level: 6 });
    imageObjectData = Buffer.concat([
      Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${info.width} /Height ${info.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode /Length ${compressed.length} >> stream\n`),
      compressed,
      Buffer.from("\nendstream"),
    ]);
  } else {
    const converted = await sharp(input).flatten({ background: "white" }).jpeg({ quality: 82 }).toBuffer({ resolveWithObject: true });
    info = converted.info;
    imageObjectData = Buffer.concat([
      Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${info.width} /Height ${info.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${converted.data.length} >> stream\n`),
      converted.data,
      Buffer.from("\nendstream"),
    ]);
  }

  const width = 612;
  const height = Number((width * info.height / info.width).toFixed(3));
  const imageName = `Im${scanNumber}`;
  const drawingCommands = [
    `q ${width} 0 0 ${height} 0 0 cm /${imageName} Do Q`,
    `q BT /F1 1 Tf 3 Tr 1 0 0 1 1 1 Tm (Quran scanned page ${scanNumber}) Tj ET Q`,
  ].join("\n");
  objects[ids.page] = Buffer.from(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 3 0 R >> /XObject << /${imageName} ${ids.image} 0 R >> >> /Contents ${ids.content} 0 R >>`);
  objects[ids.content] = Buffer.from(`<< /Length ${Buffer.byteLength(drawingCommands)} >> stream\n${drawingCommands}\nendstream`);
  objects[ids.image] = imageObjectData;
  if (scanNumber % 50 === 0) console.log(`Compiled through scan ${scanNumber}`);
}

for (let navigationIndex = 0; navigationIndex < navigationGroups.length; navigationIndex += 1) {
  const entries = navigationGroups[navigationIndex];
  const ids = navigationObjects[navigationIndex];
  const commands = [
    "q 0.965 0.985 0.975 rg 0 0 612 792 re f Q",
    "0.02 0.34 0.23 rg BT /F1 26 Tf 48 744 Td (Surah Navigation) Tj ET",
    `0.28 0.35 0.32 rg BT /F1 10 Tf 48 722 Td (Select a Surah name to jump to its first scanned page - ${navigationIndex + 1} of ${navigationPageCount}) Tj ET`,
    "0.75 0.86 0.8 RG 48 706 m 564 706 l S",
  ];

  entries.forEach((entry, entryIndex) => {
    const column = Math.floor(entryIndex / 19);
    const row = entryIndex % 19;
    const x = column === 0 ? 48 : 310;
    const y = 678 - row * 32;
    const number = String(entry.number).padStart(3, "0");
    const title = `${number}  ${entry.name}`;
    commands.push(`0.05 0.12 0.1 rg BT /F1 11 Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(title)}) Tj ET`);
    commands.push(`0.24 0.45 0.36 rg BT /F1 9 Tf 1 0 0 1 ${x + 202} ${y} Tm (${entry.scan}) Tj ET`);
    commands.push(`0.86 0.92 0.89 RG ${x} ${y - 8} m ${x + 226} ${y - 8} l S`);

    const annotationId = ids.annotations[entryIndex];
    const target = scanObjects[entry.scan - firstScan];
    objects[annotationId] = Buffer.from(`<< /Type /Annot /Subtype /Link /Rect [${x - 4} ${y - 10} ${x + 230} ${y + 15}] /Border [0 0 0] /Dest [${target.page} 0 R /Fit] >>`);
  });

  const content = commands.join("\n");
  objects[ids.page] = Buffer.from(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Annots [${ids.annotations.map((id) => `${id} 0 R`).join(" ")}] /Contents ${ids.content} 0 R >>`);
  objects[ids.content] = Buffer.from(`<< /Length ${Buffer.byteLength(content)} >> stream\n${content}\nendstream`);
}

const pageReferences = [
  `${scanObjects[0].page} 0 R`,
  ...navigationObjects.map((ids) => `${ids.page} 0 R`),
  ...scanObjects.slice(1).map((ids) => `${ids.page} 0 R`),
];
objects[2] = Buffer.from(`<< /Type /Pages /Count ${pageReferences.length} /Kids [${pageReferences.join(" ")}] >>`);

const header = Buffer.from("%PDF-1.7\n%\xFF\xFF\xFF\xFF\n", "binary");
const chunks = [header];
const offsets = new Array(objectCount + 1).fill(0);
let offset = header.length;
for (let id = 1; id <= objectCount; id += 1) {
  const chunk = Buffer.concat([Buffer.from(`${id} 0 obj\n`), objects[id], Buffer.from("\nendobj\n")]);
  offsets[id] = offset;
  chunks.push(chunk);
  offset += chunk.length;
}

const xrefOffset = offset;
const xref = [
  `xref\n0 ${objectCount + 1}\n`,
  "0000000000 65535 f \n",
  ...offsets.slice(1).map((value) => `${String(value).padStart(10, "0")} 00000 n \n`),
].join("");
chunks.push(Buffer.from(xref + `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`));

await fs.writeFile(destination, Buffer.concat(chunks));
console.log(`Created ${destination} with ${pageReferences.length} PDF pages (${scanCount} scans and ${navigationPageCount} navigation pages).`);

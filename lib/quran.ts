export const QURAN_FIRST_PAGE = 1;
export const QURAN_LAST_PAGE = 611;

export type Surah = {
  number: number;
  name: string;
  arabic: string;
  page: number;
};

const names = [
  ["Al-Fatihah", "الفاتحة"], ["Al-Baqarah", "البقرة"], ["Ali 'Imran", "آل عمران"], ["An-Nisa", "النساء"],
  ["Al-Ma'idah", "المائدة"], ["Al-An'am", "الأنعام"], ["Al-A'raf", "الأعراف"], ["Al-Anfal", "الأنفال"],
  ["At-Tawbah", "التوبة"], ["Yunus", "يونس"], ["Hud", "هود"], ["Yusuf", "يوسف"], ["Ar-Ra'd", "الرعد"],
  ["Ibrahim", "إبراهيم"], ["Al-Hijr", "الحجر"], ["An-Nahl", "النحل"], ["Al-Isra", "الإسراء"],
  ["Al-Kahf", "الكهف"], ["Maryam", "مريم"], ["Taha", "طه"], ["Al-Anbiya", "الأنبياء"], ["Al-Hajj", "الحج"],
  ["Al-Mu'minun", "المؤمنون"], ["An-Nur", "النور"], ["Al-Furqan", "الفرقان"], ["Ash-Shu'ara", "الشعراء"],
  ["An-Naml", "النمل"], ["Al-Qasas", "القصص"], ["Al-'Ankabut", "العنكبوت"], ["Ar-Rum", "الروم"],
  ["Luqman", "لقمان"], ["As-Sajdah", "السجدة"], ["Al-Ahzab", "الأحزاب"], ["Saba", "سبأ"], ["Fatir", "فاطر"],
  ["Ya-Sin", "يس"], ["As-Saffat", "الصافات"], ["Sad", "ص"], ["Az-Zumar", "الزمر"], ["Ghafir", "غافر"],
  ["Fussilat", "فصلت"], ["Ash-Shuraa", "الشورى"], ["Az-Zukhruf", "الزخرف"], ["Ad-Dukhan", "الدخان"],
  ["Al-Jathiyah", "الجاثية"], ["Al-Ahqaf", "الأحقاف"], ["Muhammad", "محمد"], ["Al-Fath", "الفتح"],
  ["Al-Hujurat", "الحجرات"], ["Qaf", "ق"], ["Adh-Dhariyat", "الذاريات"], ["At-Tur", "الطور"], ["An-Najm", "النجم"],
  ["Al-Qamar", "القمر"], ["Ar-Rahman", "الرحمن"], ["Al-Waqi'ah", "الواقعة"], ["Al-Hadid", "الحديد"],
  ["Al-Mujadila", "المجادلة"], ["Al-Hashr", "الحشر"], ["Al-Mumtahanah", "الممتحنة"], ["As-Saff", "الصف"],
  ["Al-Jumu'ah", "الجمعة"], ["Al-Munafiqun", "المنافقون"], ["At-Taghabun", "التغابن"], ["At-Talaq", "الطلاق"],
  ["At-Tahrim", "التحريم"], ["Al-Mulk", "الملك"], ["Al-Qalam", "القلم"], ["Al-Haqqah", "الحاقة"],
  ["Al-Ma'arij", "المعارج"], ["Nuh", "نوح"], ["Al-Jinn", "الجن"], ["Al-Muzzammil", "المزمل"],
  ["Al-Muddaththir", "المدثر"], ["Al-Qiyamah", "القيامة"], ["Al-Insan", "الإنسان"], ["Al-Mursalat", "المرسلات"],
  ["An-Naba", "النبأ"], ["An-Nazi'at", "النازعات"], ["'Abasa", "عبس"], ["At-Takwir", "التكوير"],
  ["Al-Infitar", "الانفطار"], ["Al-Mutaffifin", "المطففين"], ["Al-Inshiqaq", "الانشقاق"], ["Al-Buruj", "البروج"],
  ["At-Tariq", "الطارق"], ["Al-A'la", "الأعلى"], ["Al-Ghashiyah", "الغاشية"], ["Al-Fajr", "الفجر"],
  ["Al-Balad", "البلد"], ["Ash-Shams", "الشمس"], ["Al-Layl", "الليل"], ["Ad-Duhaa", "الضحى"],
  ["Ash-Sharh", "الشرح"], ["At-Tin", "التين"], ["Al-'Alaq", "العلق"], ["Al-Qadr", "القدر"],
  ["Al-Bayyinah", "البينة"], ["Az-Zalzalah", "الزلزلة"], ["Al-'Adiyat", "العاديات"], ["Al-Qari'ah", "القارعة"],
  ["At-Takathur", "التكاثر"], ["Al-'Asr", "العصر"], ["Al-Humazah", "الهمزة"], ["Al-Fil", "الفيل"],
  ["Quraysh", "قريش"], ["Al-Ma'un", "الماعون"], ["Al-Kawthar", "الكوثر"], ["Al-Kafirun", "الكافرون"],
  ["An-Nasr", "النصر"], ["Al-Masad", "المسد"], ["Al-Ikhlas", "الإخلاص"], ["Al-Falaq", "الفلق"], ["An-Nas", "الناس"],
] as const;

// Standard Madani Mushaf starting pages. Page 1 is the cover;
// Al-Fatihah is linked to page 2, where it appears in full.
const pages = [
  2, 3, 51, 78, 107, 129, 152, 178, 188, 209, 222, 236, 250, 256, 262, 268, 283, 294, 306,
  313, 323, 332, 343, 351, 360, 367, 377, 386, 397, 405, 412, 416, 419, 429, 435, 441, 446, 453,
  459, 468, 478, 484, 490, 496, 499, 503, 507, 512, 516, 519, 521, 524, 527, 529, 532, 535, 538,
  543, 546, 550, 552, 554, 555, 557, 559, 561, 563, 565, 568, 570, 572, 574, 577, 579, 581, 583,
  585, 587, 588, 590, 591, 592, 593, 595, 596, 597, 598, 598, 599, 601, 601, 602, 603, 603, 604,
  604, 605, 605, 606, 606, 607, 607, 608, 608, 608, 609, 609, 609, 610, 610, 610, 611, 611, 611,
] as const;

export const surahs: Surah[] = names.map(([name, arabic], index) => ({
  number: index + 1,
  name,
  arabic,
  page: pages[index],
}));

// A Perfect Story Map — Family Edition
// familystorymap / BarOrFamily / people.js
//
// 27 people from "הספר של זהבה". HEBREW ONLY.
//
// ⚠️ The book NEVER names Chaya's brothers and sisters. The single entry
// 'chaya_siblings' stands for all of them on purpose. Do not invent names.
// Grandchildren have no parents[] because the book never says which son each
// belongs to. Empty fields here are findings, not gaps to be filled in.
//
//   branch : 'narcyz' (Chaya's family) | 'urbach' (Natan's family) | 'baror' (today)
//   places : PLACES ids, in the order that person's journey unfolds

const PEOPLE = [

  // ── דור הסבים ──
  { id:'israel_chaim', he:'ישראל-חיים נֶרציס', years:'', role:'סבה של זהבה, אביה של חיה', branch:'narcyz', col:2.5, row:0, places:[1, 2] },
  { id:'rivka_leah', he:'רבקה-לאה (לבית ליכטיג)', years:'', role:'סבתה של זהבה, אמה של חיה', branch:'narcyz', col:3.5, row:0, places:[1, 2] },
  { id:'baruch_urbach', he:'ברוך', years:'', role:'אביו של נתן, סבה של זהבה', branch:'urbach', col:4.5, row:0, places:[3] },
  { id:'golda_urbach', he:'גולדה', years:'', role:'אמו של נתן, סבתה של זהבה', branch:'urbach', col:5.5, row:0, places:[3] },

  // ── דור ההורים ──
  { id:'feigele', he:'פייגלע (פייגעל\'ה)', years:'', role:'⚠️ דודה, מצולמת עם ההורים בקרקוב', branch:'baror', col:6.8, row:1, places:[4] },
  { id:'chana_dichter', he:'חנה דיכטר ז"ל', years:'', role:'דודתו של רמי, מורתה של זהבה', branch:'baror', col:0.5, row:1, places:[18] },
  { id:'chaya', he:'חיה - הֶלָה', years:'נפטרה 9 במאי 1971', role:'אמה של זהבה, ילידת וולברום', branch:'narcyz', col:2.5, row:1, places:[1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21] },
  { id:'chaya_siblings', he:'אחיה ואחיותיה של חיה', years:'', role:'אחים ואחיות שהספר אינו נוקב בשמם', branch:'narcyz', col:1.5, row:1, places:[1] },
  { id:'golda_yora', he:'גולדה יורה – ניימרק', years:'', role:'בת דודתה של חיה, ניצולת מחנות', branch:'narcyz', col:5.8, row:1, places:[1, 6, 19] },
  { id:'natan', he:'נתן אורבך', years:'', role:'אביה של זהבה, נלקח ולא שב', branch:'urbach', col:4.5, row:1, places:[3, 4, 1, 7] },

  // ── זהבה ובני דורה ──
  { id:'rachel', he:'רחל', years:'', role:'בת דודתו של רמי, בת כיתתה של זהבה', branch:'baror', col:0.5, row:2, places:[18] },
  { id:'rami', he:'רמי', years:'', role:'בעלה של זהבה', branch:'baror', col:2.5, row:2, places:[29, 30] },
  { id:'zehava', he:'זהבה (גולדה\'לה)', years:'נ. שלהי אוקטובר 1941', role:'מחברת הספר, בתם היחידה', branch:'baror', col:3.5, row:2, places:[7, 8, 9, 10, 11, 12, 1, 3, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32] },
  { id:'golda_nephew', he:'בן אחותה של דודה גולדה', years:'', role:'⚠️ נספה בשואה, שמו אינו נמסר', branch:'narcyz', col:5.8, row:2, places:[6] },

  // ── הבנים והכלות ──
  { id:'gil', he:'גיל', years:'', role:'בנם של זהבה ורמי', branch:'baror', col:3.0, row:3, places:[] },
  { id:'li', he:'לי', years:'', role:'כלתה של זהבה', branch:'baror', col:6.0, row:3, places:[] },
  { id:'ofer', he:'עופר', years:'', role:'בנם של זהבה ורמי', branch:'baror', col:1.0, row:3, places:[] },
  { id:'ron', he:'רון', years:'', role:'בנם של זהבה ורמי', branch:'baror', col:5.0, row:3, places:[] },
  { id:'ruti', he:'רותי', years:'', role:'כלתה של זהבה', branch:'baror', col:2.0, row:3, places:[] },
  { id:'tamar_gil', he:'תמר', years:'', role:'כלתה של זהבה', branch:'baror', col:4.0, row:3, places:[] },

  // ── הנכדים ──
  { id:'dolev', he:'דוֹלֶב', years:'', role:'נכד/ה של זהבה ורמי', branch:'baror', col:1.5, row:4, places:[] },
  { id:'ella', he:'אלה', years:'', role:'נכד/ה של זהבה ורמי', branch:'baror', col:5.5, row:4, places:[] },
  { id:'eyal', he:'אֱיָל', years:'', role:'נכד/ה של זהבה ורמי', branch:'baror', col:6.5, row:4, places:[] },
  { id:'karni', he:'קרני', years:'', role:'נכד/ה של זהבה ורמי', branch:'baror', col:0.5, row:4, places:[] },
  { id:'tamar_grandchild', he:'תמר', years:'', role:'נכד/ה של זהבה ורמי', branch:'baror', col:3.5, row:4, places:[] },
  { id:'yonatan', he:'יונתן', years:'', role:'נכד/ה של זהבה ורמי', branch:'baror', col:2.5, row:4, places:[] },
  { id:'yuval', he:'יובל', years:'', role:'נכד/ה של זהבה ורמי', branch:'baror', col:4.5, row:4, places:[] },
];

// ─── Unions: who had children with whom ───────────────────────────────────────
// Only unions the book actually states. Chaya's siblings are one collective node
// because the book names none of them.
const FAMILY_UNIONS = [
  { p:['israel_chaim','rivka_leah'],   c:['chaya','chaya_siblings'] },
  { p:['baruch_urbach','golda_urbach'],c:['natan'] },
  { p:['chaya','natan'],               c:['zehava'] },
  { p:['zehava','rami'],               c:['ofer','gil','ron'] },
  { p:['ofer','ruti'],                 c:[] },
  { p:['gil','tamar_gil'],             c:[] },
  { p:['ron','li'],                    c:[] },
  { p:['chana_dichter'],               c:['rachel'] },
];

// ─── Softer links, drawn as dashed edges ──────────────────────────────────────
// The seven grandchildren hang off Zehava rather than off a son, because the book
// never says which grandchild belongs to which son. That is a finding, not a gap:
// do not reassign them without the family's word.
const FAMILY_EXTRA_EDGES = [
  { from:'zehava',     to:'karni',            label:'נכד/ה' },
  { from:'zehava',     to:'dolev',            label:'נכד/ה' },
  { from:'zehava',     to:'yonatan',          label:'נכד/ה' },
  { from:'zehava',     to:'tamar_grandchild', label:'נכד/ה' },
  { from:'zehava',     to:'yuval',            label:'נכד/ה' },
  { from:'zehava',     to:'ella',             label:'נכד/ה' },
  { from:'zehava',     to:'eyal',             label:'נכד/ה' },
  { from:'chaya',      to:'golda_yora',       label:'בת דודתה' },
  { from:'golda_yora', to:'golda_nephew',     label:'בן אחותה' },
  { from:'rami',       to:'chana_dichter',    label:'דודתו' },
  { from:'chaya',      to:'feigele',          label:'⚠️ דודה — הספר אינו אומר מצד מי' },
];

// A Perfect Story Map — Family Edition
// people.js — every family member mentioned in FamilyMemories_Part1,
// with tree layout coordinates and links to the map's place ids.
//
//   branch : 'kliot' | 'friedland' | 'lando'  (matches CC colours in map.js)
//   col/row: manual grid position on the tree canvas (col × 175px, row × 150px)
//   places : PLACES ids, in the chronological order of that person's journey —
//            clicking the person in the tree draws this path on the map.
//
// Layout: three branch groups on one canvas — Kliot (left), Friedland (middle),
// Lando & Schechter (right) — converging at the bottom on Anna + Misha → Masha, Dima.

const PEOPLE = [

  // ── KLIOT — צד אבא ────────────────────────────────────────────────────────
  { id:'svirsky',   he:'משפחת סבירסקי', ru:'семья Свирских', years:'פולין · Польша', role:'שלחו עזרה בשנות הרעב · помогали в голод', branch:'kliot', col:0, row:0, places:[] },
  { id:'yosef_k',   he:'יוסף קליוט', ru:'Иосиф Клиот', years:'1882–1957', role:'סבא, בעל המכולת · дед, лавочник', branch:'kliot', col:2, row:0, places:[3,4,5,10] },
  { id:'etasara',   he:'אתה־שרה (סבירסקי)', ru:'Эта-Сара Свирская', years:'1884–1949', role:'סבתא · бабушка', branch:'kliot', col:3, row:0, places:[3,4,5,10] },
  { id:'sonya',     he:'סוניה קליוט', ru:'Соня Клиот', years:'', role:'רופאת ילדים · детский врач', branch:'kliot', col:0.8, row:1, places:[5,7,10] },
  { id:'rudolf',    he:'רודולף (רובים)', ru:'Рудольф (Рувим)', years:'', role:'מהנדס רכבות · военный инженер', branch:'kliot', col:1.8, row:1, places:[] },
  { id:'efraim',    he:'אפרים קליוט', ru:'Эфраим Клиот', years:'', role:'"אוקטובר האדום" · «Красный Октябрь»', branch:'kliot', col:3, row:1, places:[5,7] },
  { id:'michael_k', he:'מיכאל קליוט', ru:'Михаил Клиот', years:'נפל ~1941–44', role:'נפל ליד פסקוב · погиб под Псковом', branch:'kliot', col:4, row:1, places:[5,15] },
  { id:'fanya',     he:'פאניה קליוט', ru:'Фаня (Фаина) Клиот', years:'', role:'כלכלנית, בנק בוויטבסק · экономист', branch:'kliot', col:5, row:1, places:[5,7] },
  { id:'rivka',     he:'רבקה (ריטה) קליוט', ru:'Ривка (Рита)', years:'', role:'התגוררה ליד חרקוב · жила под Харьковом', branch:'kliot', col:6.2, row:1, places:[5,9] },
  { id:'raisa',     he:'רעיסה ליסיץ (קליוט)', ru:'Раиса Лисиц', years:'', role:'מנהלת חשבונות, ויטבסק · бухгалтер', branch:'kliot', col:8.6, row:1, places:[5] },
  { id:'benjamin',  he:'בנימין ברוך קליוט', ru:'Вениамин Клиот', years:'נ׳ 1910', role:'אבא, מהנדס · папа, инженер', branch:'kliot', col:10, row:1, places:[3,4,5,6,7,10] },
  { id:'liza',      he:'ליזה קליאוט', ru:'Лиза Клиот', years:'נ׳ 1945', role:'בת סוניה · дочь Сони', branch:'kliot', col:0.8, row:2, places:[7,10,18] },
  { id:'radioman',  he:'האלחוטן', ru:'радист', years:'', role:'בעלה של ליזה · муж Лизы', branch:'kliot', col:1.8, row:2, places:[18] },
  { id:'sonya_f',   he:'סוניה (בת פאניה)', ru:'Соня (дочь Фани)', years:'', role:'', branch:'kliot', col:4.6, row:2, places:[] },
  { id:'fira',      he:'פירה', ru:'Фира', years:'', role:'בת רבקה · дочь Ривки', branch:'kliot', col:5.6, row:2, places:[] },
  { id:'izya',      he:'ישראל (איזיה)', ru:'Изя (Израиль)', years:'', role:'בן רבקה · сын Ривки', branch:'kliot', col:6.6, row:2, places:[] },
  { id:'lyalya',    he:'ליליה (ציפורה)', ru:'Ляля (Ципора)', years:'', role:'בת רבקה · дочь Ривки', branch:'kliot', col:7.6, row:2, places:[] },
  { id:'sasha',     he:'אלכסנדר ליסיץ', ru:'Саша Лисиц', years:'', role:'בן רעיסה · сын Раисы', branch:'kliot', col:8.7, row:2, places:[] },
  { id:'emma',      he:'אמה ליסיץ', ru:'Эмма Лисиц', years:'', role:'בת רעיסה · дочь Раисы', branch:'kliot', col:9.7, row:2, places:[] },
  { id:'baruch_j',  he:'ברוך (בוריס) קליאוט', ru:'Барух (Борис) Клиот', years:'נישא 2009', role:'שומר מגילת אסתר · хранитель свитка Эстер', branch:'kliot', col:0.4, row:3, places:[21] },
  { id:'rachel',    he:'רחל קליאוט', ru:'Рахель Клиот', years:'', role:'רעיית ברוך · жена Баруха', branch:'kliot', col:1.4, row:3, places:[21] },

  // ── The meeting point of Kliot × Friedland ───────────────────────────────
  { id:'anna',      he:'אנה קליאוט־לנדו', ru:'Анна', years:'נ׳ 1948', role:'המחברת · автор воспоминаний', branch:'kliot', col:11, row:3, places:[10,7,20,22,23] },
  { id:'michael_br',he:'מיכאל קליאוט', ru:'Михаил Клиот', years:'נ׳ 1950', role:'אחי ז״ל · мой брат, светлой памяти', branch:'kliot', col:12.4, row:3, places:[10,16,7] },
  { id:'nina_s',    he:'נינה סמישבה', ru:'Нина Самышева', years:'', role:'רעייתו; מטפלת במצבות · жена', branch:'kliot', col:13.6, row:3, places:[10] },
  { id:'ilya',      he:'איליה קליאוט', ru:'Илья Клиот', years:'', role:'חי באשדוד עם משפחתו · живёт в Ашдоде с семьёй', branch:'kliot', col:14.4, row:4, places:[10,24] },
  { id:'moshe_bar', he:'משה בר', ru:'Моше Бар', years:'', role:'אבי נאור, נדיה ונילי · отец Наора, Нади и Нили', branch:'lando', col:8.2, row:4, places:[] },
  { id:'natasha',   he:'נטשה גורביץ׳', ru:'Наташа Гуревич', years:'', role:'אם מארק וניקול · мать Марка и Николь', branch:'lando', col:10.6, row:4, places:[] },
  { id:'naor',      he:'נאור בר', ru:'Наор Бар', years:'', role:'בן מריה ומשה · сын Марии и Моше', branch:'lando', col:7.6, row:5, places:[25] },
  { id:'nadia',     he:'נדיה בר', ru:'Надя Бар', years:'', role:'בת מריה ומשה · дочь Марии и Моше', branch:'lando', col:8.6, row:5, places:[25] },
  { id:'nili',      he:'נילי בר', ru:'Нили Бар', years:'', role:'בת מריה ומשה · дочь Марии и Моше', branch:'lando', col:9.6, row:5, places:[25] },
  { id:'zoya',      he:'זויה לנדו', ru:'Зоя Ландо', years:'', role:'רעייתו השנייה של דמיטרי · вторая жена Дмитрия', branch:'lando', col:13.0, row:4, places:[26] },
  { id:'mark_d',    he:'מארק לנדו', ru:'Марк Ландо', years:'', role:'בן דמיטרי ונטשה · сын Дмитрия и Наташи', branch:'lando', col:10.8, row:5, places:[26] },
  { id:'nikol',     he:'ניקול לנדו', ru:'Николь Ландо', years:'', role:'בת דמיטרי ונטשה · дочь Дмитрия и Наташи', branch:'lando', col:11.8, row:5, places:[26] },
  { id:'olga',      he:'אולגה קליוט', ru:'Ольга Клиот', years:'', role:'רעיית איליה · жена Ильи', branch:'kliot', col:15.6, row:4, places:[24] },
  { id:'lital',     he:'ליטל קליוט', ru:'Литаль Клиот', years:'', role:'בת איליה ואולגה · дочь Ильи и Ольги', branch:'kliot', col:13.8, row:5, places:[24] },
  { id:'nir',       he:'ניר קליוט', ru:'Нир Клиот', years:'', role:'בן איליה ואולגה · сын Ильи и Ольги', branch:'kliot', col:14.8, row:5, places:[24] },
  { id:'ron',       he:'רון קליוט', ru:'Рон Клиот', years:'', role:'בן איליה ואולגה · сын Ильи и Ольги', branch:'kliot', col:15.8, row:5, places:[24] },
  { id:'masha',     he:'מאשה (מריה) לנדו', ru:'Маша (Мария) Ландо', years:'', role:'יזמה את העלייה; מייסדת Ludara.AI · инициатор алии; основательница Ludara.AI', branch:'lando', col:9.4, row:4, places:[7,20,23,25] },
  { id:'dima',      he:'דימה (דמיטרי) לנדו', ru:'Дима (Дмитрий) Ландо', years:'', role:'חי ברעננה עם משפחתו · живёт в Раанане с семьёй', branch:'lando', col:11.8, row:4, places:[7,20,26] },

  // ── FRIEDLAND — צד אמא ───────────────────────────────────────────────────
  { id:'yosi',      he:'יוסף (יוסי) פרידלנד', ru:'Иосиф (Йоси) Фридланд', years:'', role:'אבי סבא זלמן · отец деда Залмана', branch:'friedland', col:15.6, row:0, places:[1] },
  { id:'zina',      he:'זינה (זישה) פרידלנד', ru:'Зина (Зиша) Фридланд', years:'', role:'לפי הכיתוב: אם סבתי · по подписи: мать бабушки', branch:'friedland', col:16.6, row:0, places:[1] },
  { id:'sam',       he:'סם (שמואל) פרידלנד', ru:'Сэм (Шмуэль) Фридланд', years:'', role:'ברח לאמריקה ~1910 · бежал в Америку', branch:'friedland', col:13.2, row:1, places:[1,7,16] },
  { id:'dora',      he:'דורה', ru:'Дора', years:'', role:'רעייתו של סם · жена Сэма', branch:'friedland', col:14.2, row:1, places:[16] },
  { id:'zalman',    he:'זלמן (זחר) פרידלנד', ru:'Залман (Захар) Фридланд', years:'', role:'סבא (צד אמא) · дед', branch:'friedland', col:15.6, row:1, places:[2,11,16] },
  { id:'malka',     he:'מלכה פרידלנד', ru:'Малка Фридланд', years:'נפ׳ ~1941', role:'סבתא · бабушка', branch:'friedland', col:16.6, row:1, places:[2,11] },
  { id:'ida',       he:'אידה', ru:'Ида', years:'נרצחה 1941', role:'נרצחה בגטו בוברויסק · погибла в гетто', branch:'friedland', col:17.8, row:1, places:[2] },
  { id:'polya',     he:'פוליה', ru:'Поля', years:'', role:'אחות סבא · сестра деда', branch:'friedland', col:18.85, row:1, places:[16] },
  { id:'avram',     he:'אברם', ru:'Абрам', years:'', role:'אח של סבא · брат деда', branch:'friedland', col:19.9, row:1, places:[16] },
  { id:'nina',      he:'נינה (נחמה) פרידלנד', ru:'Нина (Нехама) Фридланд', years:'~1924', role:'אמא · мама', branch:'friedland', col:11.8, row:2, places:[2,12,14,10,20] },
  { id:'bella',     he:'בלה', ru:'Белла', years:'', role:'האחות הבכורה · старшая сестра', branch:'friedland', col:13.2, row:2, places:[2,12,10] },
  { id:'polina_f',  he:'פולינה פרידלנד', ru:'Полина Фридланд', years:'נ׳ ~1928', role:'מורה לשפות · преподаватель языков', branch:'friedland', col:16.8, row:2, places:[2,12,10] },
  { id:'grisha',    he:'גרישה פרידלנד', ru:'Гриша Фридланд', years:'נפ׳ בגיל 56', role:'מנהל בית ספר · директор школы', branch:'friedland', col:18, row:2, places:[2,12,10] },
  { id:'polina_w',  he:'פולינה', ru:'Полина', years:'', role:'רעיית גרישה · жена Гриши', branch:'friedland', col:19.2, row:2, places:[10] },
  { id:'alisa',     he:'אליסה רוזנבלט', ru:'Алиса Розенблат', years:'נ׳ 1941', role:'כנרית ביארוסלבל · скрипачка', branch:'friedland', col:15, row:3, places:[12,10,16,17] },
  { id:'markr',     he:'מארק רוזנבלט', ru:'Марк Розенблат', years:'', role:'בעלה של אליסה (1962) · муж Алисы', branch:'friedland', col:16, row:3, places:[17] },
  { id:'raya_f',    he:'רעיה', ru:'Рая', years:'', role:'בת פולינה · дочь Полины', branch:'friedland', col:17.4, row:3, places:[10] },
  { id:'yegor',     he:'יגור', ru:'Егор', years:'', role:'בן גרישה ופולינה · сын Гриши', branch:'friedland', col:18.6, row:3, places:[10] },
  { id:'boris_r',   he:'בוריס רוזנבלט', ru:'Борис Розенблат', years:'', role:'בן אליסה · сын Алисы', branch:'friedland', col:16.8, row:4, places:[17] },
  { id:'yevgeny',   he:'יבגני רוזנבלט', ru:'Евгений Розенблат', years:'', role:'בן אליסה · сын Алисы', branch:'friedland', col:17.8, row:4, places:[17] },
  { id:'michael_idf',he:'מיכאל', ru:'Михаил', years:'', role:'נכד אליסה, לוחם בצה״ל · внук Алисы, боец ЦАХАЛа', branch:'friedland', col:17.1, row:5, places:[20] },

  // ── LANDO & SCHECHTER — צד מישה ──────────────────────────────────────────
  { id:'david_s',   he:'דויד שכטר', ru:'Давид Шехтер', years:'', role:'סבא של מישה · дед Миши', branch:'lando', col:23.6, row:0, places:[8] },
  { id:'odiya',     he:'אודיה שכטר', ru:'Одия Шехтер', years:'', role:'סבתא של מישה · бабушка Миши', branch:'lando', col:24.6, row:0, places:[8] },
  { id:'hersh',     he:'הרש לנדו', ru:'Герш Ландо', years:'', role:'מנהל משק אצל חוואי · управляющий у хуторянина', branch:'lando', col:27.2, row:0, places:[8] },
  { id:'milia',     he:'מיליה', ru:'Миля', years:'', role:'דודתו של מישה · тётя Миши', branch:'lando', col:21.6, row:1, places:[7] },
  { id:'huma',      he:'חומה (חנה) שכטר', ru:'Хума (Хана) Шехтер', years:'נ׳ 1908', role:'אם מישה · мать Миши', branch:'lando', col:23.6, row:1, places:[8,7,13] },
  { id:'boruch',    he:'ברוך (בוריס) לנדו', ru:'Барух (Борис) Ландо', years:'', role:'אבי מישה; בצבא עד 1946 · отец Миши', branch:'lando', col:24.6, row:1, places:[8,7] },
  { id:'hana_l',    he:'חנה', ru:'Хана', years:'', role:'אחות ברוך, אשת רב · жена раввина', branch:'lando', col:26, row:1, places:[8] },
  { id:'husband1',  he:'הבעל הראשון', ru:'первый муж', years:'', role:'שידוך בכפייה · брак по сговору', branch:'lando', col:27.2, row:1, places:[8] },
  { id:'roza',      he:'רוזה', ru:'Роза', years:'', role:'אחות ברוך · сестра Баруха', branch:'lando', col:28.2, row:1, places:[8] },
  { id:'shaul',     he:'שאול', ru:'Шауль', years:'', role:'אהובה של רוזה, כלכלן · любимый муж, экономист', branch:'lando', col:29.2, row:1, places:[8,9] },
  { id:'lyonya',    he:'ליוניה (לאוניד)', ru:'Лёня (Леонид)', years:'', role:'נכד מיליה, נשאר במוסקבה · внук Мили', branch:'lando', col:20.8, row:2, places:[7] },
  { id:'marina',    he:'מרינה', ru:'Марина', years:'', role:'נכדת מיליה · внучка Мили', branch:'lando', col:21.8, row:2, places:[7] },
  { id:'volodya',   he:'וולודיה', ru:'Володя', years:'', role:'בעלה של מרינה · муж Марины', branch:'lando', col:22.8, row:2, places:[7] },
  { id:'mark_l',    he:'מארק לנדו', ru:'Марк Ландо', years:'נ׳ 1930', role:'אחיו הבכור של מישה · старший брат', branch:'lando', col:23.9, row:2, places:[8,13,7] },
  { id:'misha_l',   he:'מישה (מיכאל) לנדו', ru:'Миша (Михаил) Ландо', years:'נ׳ 1938', role:'בעלי · мой муж', branch:'lando', col:24.9, row:2, places:[8,13,7,20] },
  { id:'yakov',     he:'יעקב לנדו', ru:'Яков Ландо', years:'נ׳ 1941', role:'נולד בפינוי · родился в эвакуации', branch:'lando', col:25.9, row:2, places:[13,7] },
  { id:'misha_r',   he:'מישה (מיכאל)', ru:'Миша (Михаил)', years:'', role:'בן רוזה; היגר לארה״ב · сын Розы, США', branch:'lando', col:27.2, row:2, places:[8,14] },
  { id:'yefim',     he:'יפים', ru:'Ефим', years:'נפל ~1942', role:'כירורג, נפל בסטלינגרד · хирург, погиб', branch:'lando', col:28.2, row:2, places:[8,14] },
  { id:'pavel',     he:'פאבל', ru:'Павел', years:'', role:'רופא בצ׳יטה · врач в Чите', branch:'lando', col:29.2, row:2, places:[8,19] },
  { id:'vera',      he:'ורה', ru:'Вера', years:'', role:'נשארה באודסה · осталась в Одессе', branch:'lando', col:30.2, row:2, places:[8] },
];

// Parent(s) → children. One or two parents; children in birth order where known.
const FAMILY_UNIONS = [
  // Kliot
  { p:['yosef_k','etasara'], c:['benjamin','sonya','efraim','michael_k','fanya','rivka','raisa'] },
  { p:['sonya','rudolf'],    c:['liza'] },
  { p:['liza','radioman'],   c:['baruch_j'] },
  { p:['baruch_j','rachel'], c:[] },
  { p:['fanya'],             c:['sonya_f'] },
  { p:['rivka'],             c:['fira','izya','lyalya'] },
  { p:['raisa'],             c:['sasha','emma'] },
  { p:['benjamin','nina'],   c:['anna','michael_br'] },
  { p:['michael_br','nina_s'], c:['ilya'] },
  { p:['ilya','olga'],       c:['lital','nir','ron'] },
  { p:['dima','natasha'],    c:['mark_d','nikol'] },
  { p:['dima','zoya'],       c:[] },
  { p:['masha','moshe_bar'], c:['naor','nadia','nili'] },
  // Friedland
  { p:['yosi','zina'],       c:['sam','zalman','ida','polya','avram'] },
  { p:['sam','dora'],        c:[] },
  { p:['zalman','malka'],    c:['bella','nina','polina_f','grisha'] },
  { p:['bella'],             c:['alisa'] },
  { p:['alisa','markr'],     c:['boris_r','yevgeny'] },
  { p:['polina_f'],          c:['raya_f'] },
  { p:['grisha','polina_w'], c:['yegor'] },
  // Lando & Schechter
  { p:['david_s','odiya'],   c:['huma'] },
  { p:['hersh'],             c:['boruch','hana_l','roza'] },
  { p:['boruch','huma'],     c:['mark_l','misha_l','yakov'] },
  { p:['roza','husband1'],   c:['misha_r','yefim'] },
  { p:['roza','shaul'],      c:['pavel','vera'] },
  { p:['marina','volodya'],  c:[] },
  // The meeting point
  { p:['anna','misha_l'],    c:['masha','dima'] },
];

// Dotted edges — known descent whose exact line the memoir leaves open.
const FAMILY_EXTRA_EDGES = [
  { from:'alisa',   to:'michael_idf', label:'נכד · внук' },
  { from:'milia',   to:'lyonya',      label:'נכד · внук' },
  { from:'milia',   to:'marina',      label:'נכדה · внучка' },
  { from:'svirsky', to:'etasara',     label:'משפחתה · её семья' },
];

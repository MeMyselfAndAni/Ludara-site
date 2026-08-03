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
  { id:'svirsky',   he:'משפחת סבירסקי', ru:'семья Свирских', en:'The Svirsky family', years:'פולין · Польша', role:'שלחו עזרה בשנות הרעב · помогали в голод · sent help in the famine years', branch:'kliot', col:0, row:1, places:[] },
  { id:'yosef_k',   he:'יוסף קליוט', ru:'Иосиф Клиот', en:'Yosef Kliot', years:'1882–1957', role:'סבא, בעל המכולת · дед, лавочник · grandfather, the grocer', branch:'kliot', col:2, row:1, places:[3,4,5,10] },
  { id:'etasara',   he:'אתה־שרה (סבירסקי)', ru:'Эта-Сара Свирская', en:'Eta-Sara Svirsky', years:'1884–1949', role:'סבתא · бабушка · grandmother', branch:'kliot', col:3, row:1, places:[3,4,5,10] },
  { id:'sonya',     he:'סוניה קליוט', ru:'Соня Клиот', en:'Sonya Kliot', years:'', role:'רופאת ילדים · детский врач · pediatrician', branch:'kliot', col:0.8, row:2, places:[5,7,10] },
  { id:'rudolf',    he:'רודולף (רובים)', ru:'Рудольф (Рувим)', en:'Rudolf (Ruvim)', years:'', role:'מהנדס רכבות · военный инженер · railway engineer', branch:'kliot', col:1.8, row:2, places:[] },
  { id:'efraim',    he:'אפרים קליוט', ru:'Эфраим Клиот', en:'Efraim Kliot', years:'', role:'"אוקטובר האדום" · «Красный Октябрь» · payroll chief, "Red October"', branch:'kliot', col:3.0, row:2, places:[5,7] },
  { id:'rita_e',    he:'ריטה קליוט', ru:'Рита Клиот', en:'Rita Kliot', years:'', role:'רעיית אפרים · жена Эфраима · Efraim\'s wife', branch:'kliot', col:4.0, row:2, places:[] },
  { id:'michael_k', he:'מיכאל קליוט', ru:'Михаил Клиот', en:'Michael Kliot', years:'נפל ~1941–44', role:'נפל ליד פסקוב · погиб под Псковом · fell near Pskov', branch:'kliot', col:6.15, row:2, places:[5,15] },
  { id:'fanya',     he:'פאניה קליוט', ru:'Фаня (Фаина) Клиот', en:'Fanya Kliot', years:'', role:'כלכלנית, בנק בוויטבסק · экономист · economist, bank in Vitebsk', branch:'kliot', col:5.1, row:2, places:[5,7] },
  { id:'rivka',     he:'רבקה (ריטה) קליוט', ru:'Ривка (Рита)', en:'Rivka (Rita) Kliot', years:'', role:'התגוררה ליד חרקוב · жила под Харьковом · lived near Kharkiv', branch:'kliot', col:7.2, row:2, places:[5,9] },
  { id:'raisa',     he:'רעיסה ליסיץ (קליוט)', ru:'Раиса Лисиц', en:'Raisa Lisits (Kliot)', years:'', role:'מנהלת חשבונות, ויטבסק · бухгалтер · bookkeeper, Vitebsk', branch:'kliot', col:9.7, row:2, places:[5] },
  { id:'benjamin',  he:'בנימין ברוך קליוט', ru:'Вениамин Клиот', en:'Benjamin Kliot', years:'נ׳ 1910', role:'אבא, מהנדס · папа, инженер · father, engineer', branch:'kliot', col:10.8, row:2, places:[3,4,5,6,7,10] },
  { id:'liza',      he:'ליזה קליאוט', ru:'Лиза Клиот', en:'Liza Kliot', years:'נ׳ 1945', role:'בת סוניה · дочь Сони · Sonya\'s daughter', branch:'kliot', col:0.8, row:3, places:[7,10,18] },
  { id:'radioman',  he:'האלחוטן', ru:'радист', en:'the radio operator', years:'', role:'בעלה של ליזה · муж Лизы · Liza\'s husband', branch:'kliot', col:1.8, row:3, places:[18] },
  { id:'semyon',    he:'סמיון קליוט', ru:'Семён Клиот', en:'Semyon Kliot', years:'נפ׳ ~2015 · ум. ~2015 · d. ~2015', role:'בן אפרים וריטה · сын Эфраима и Риты · son of Efraim and Rita', branch:'kliot', col:2.9, row:3, places:[] },
  { id:'olga_e',    he:'אולגה קליוט', ru:'Ольга Клиот', en:'Olga Kliot', years:'', role:'בת אפרים וריטה; חיה בוולגוגרד · дочь Эфраима и Риты, живёт в Волгограде · daughter of Efraim and Rita, lives in Volgograd', branch:'kliot', col:4.0, row:3, places:[14] },
  { id:'sonya_f',   he:'סוניה (בת פאניה)', ru:'Соня (дочь Фани)', en:'Sonya (Fanya\'s daughter)', years:'', role:'', branch:'kliot', col:5.1, row:3, places:[] },
  { id:'fira',      he:'פירה', ru:'Фира', en:'Fira', years:'', role:'בת רבקה · дочь Ривки · Rivka\'s daughter', branch:'kliot', col:6.2, row:3, places:[] },
  { id:'izya',      he:'ישראל (איזיה)', ru:'Изя (Израиль)', en:'Izya (Israel)', years:'', role:'בן רבקה · сын Ривки · Rivka\'s son', branch:'kliot', col:7.2, row:3, places:[] },
  { id:'lyalya',    he:'ליליה (ציפורה)', ru:'Ляля (Ципора)', en:'Lyalya (Tzipora)', years:'', role:'בת רבקה · дочь Ривки · Rivka\'s daughter', branch:'kliot', col:8.2, row:3, places:[] },
  { id:'sasha',     he:'אלכסנדר ליסיץ', ru:'Саша Лисиц', en:'Alexander Lisits', years:'', role:'בן רעיסה · сын Раисы · Raisa\'s son', branch:'kliot', col:9.2, row:3, places:[] },
  { id:'emma',      he:'אמה ליסיץ', ru:'Эмма Лисиц', en:'Emma Lisits', years:'', role:'בת רעיסה · дочь Раисы · Raisa\'s daughter', branch:'kliot', col:10.2, row:3, places:[] },
  { id:'ilya_s',    he:'איליה קליוט', ru:'Илья Клиот', en:'Ilya Kliot', years:'', role:'בן סמיון · сын Семёна · Semyon\'s son', branch:'kliot', col:2.9, row:4, places:[] },
  { id:'miroslava', he:'מירוסלבה קליוט', ru:'Мирослава Клиот', en:'Miroslava Kliot', years:'', role:'בת איליה · дочь Ильи · Ilya\'s daughter', branch:'kliot', col:2.9, row:5, places:[] },
  { id:'baruch_j',  he:'ברוך (בוריס) קליאוט', ru:'Барух (Борис) Клиот', en:'Baruch Kliot', years:'נישא 2009', role:'שומר מגילת אסתר · хранитель свитка Эстер · keeper of the Scroll of Esther', branch:'kliot', col:0.9, row:4, places:[21] },
  { id:'rachel',    he:'רחל קליאוט', ru:'Рахель Клиот', en:'Rachel Kliot', years:'', role:'רעיית ברוך · жена Баруха · Baruch\'s wife', branch:'kliot', col:1.9, row:4, places:[21] },

  // ── The meeting point of Kliot × Friedland ───────────────────────────────
  { id:'anna',      he:'אנה קליאוט־לנדו', ru:'Анна', en:'Anna Kliot-Lando', years:'נ׳ 1948', role:'המחברת · автор воспоминаний · author of the memoirs', branch:'kliot', col:11.3, row:3, places:[10,7,20,22,23] },
  { id:'michael_br',he:'מיכאל קליאוט', ru:'Михаил Клиот', en:'Michael Kliot', years:'נ׳ 1950', role:'אחי ז״ל · мой брат, светлой памяти · my brother, of blessed memory', branch:'kliot', col:12.6, row:3, places:[10,16,7] },
  { id:'nina_s',    he:'נינה סמישבה', ru:'Нина Самышева', en:'Nina Samysheva', years:'', role:'רעייתו; מטפלת במצבות · жена · his wife', branch:'kliot', col:13.8, row:3, places:[10] },
  { id:'ilya',      he:'איליה קליאוט', ru:'Илья Клиот', en:'Ilya Kliot', years:'', role:'חי באשדוד עם משפחתו · живёт в Ашдоде с семьёй · lives in Ashdod with his family', branch:'kliot', col:14.4, row:4, places:[10,24] },
  { id:'moshe_bar', he:'משה בר', ru:'Моше Бар', en:'Moshe Bar', years:'', role:'אבי נאור, נדיה ונילי · отец Наора, Нади и Нили · father of Naor, Nadia and Nili', branch:'lando', col:8.2, row:4, places:[] },
  { id:'natasha',   he:'נטשה גורביץ׳', ru:'Наташа Гуревич', en:'Natasha Gurevich', years:'', role:'אם מארק וניקול · мать Марка и Николь · mother of Mark and Nikol', branch:'lando', col:10.6, row:4, places:[] },
  { id:'naor',      he:'נאור בר', ru:'Наор Бар', en:'Naor Bar', years:'', role:'בן מריה ומשה · сын Марии и Моше · son of Maria and Moshe', branch:'lando', col:7.6, row:5, places:[25] },
  { id:'nadia',     he:'נדיה בר', ru:'Надя Бар', en:'Nadia Bar', years:'', role:'בת מריה ומשה · дочь Марии и Моше · daughter of Maria and Moshe', branch:'lando', col:8.6, row:5, places:[25] },
  { id:'nili',      he:'נילי בר', ru:'Нили Бар', en:'Nili Bar', years:'', role:'בת מריה ומשה · дочь Марии и Моше · daughter of Maria and Moshe', branch:'lando', col:9.6, row:5, places:[25] },
  { id:'zoya',      he:'זויה לנדו', ru:'Зоя Ландо', en:'Zoya Lando', years:'', role:'רעייתו השנייה של דמיטרי · вторая жена Дмитрия · Dmitry\'s second wife', branch:'lando', col:13.0, row:4, places:[26] },
  { id:'mark_d',    he:'מארק לנדו', ru:'Марк Ландо', en:'Mark Lando', years:'', role:'בן דמיטרי ונטשה · сын Дмитрия и Наташи · son of Dmitry and Natasha', branch:'lando', col:10.8, row:5, places:[26] },
  { id:'nikol',     he:'ניקול לנדו', ru:'Николь Ландо', en:'Nikol Lando', years:'', role:'בת דמיטרי ונטשה · дочь Дмитрия и Наташи · daughter of Dmitry and Natasha', branch:'lando', col:11.8, row:5, places:[26] },
  { id:'olga',      he:'אולגה קליוט', ru:'Ольга Клиот', en:'Olga Kliot', years:'', role:'רעיית איליה · жена Ильи · Ilya\'s wife', branch:'kliot', col:15.6, row:4, places:[24] },
  { id:'lital',     he:'ליטל קליוט', ru:'Литаль Клиот', en:'Leetal Kliot', years:'', role:'בת איליה ואולגה · дочь Ильи и Ольги · daughter of Ilya and Olga', branch:'kliot', col:13.8, row:5, places:[24] },
  { id:'nir',       he:'ניר קליוט', ru:'Нир Клиот', en:'Nir Kliot', years:'', role:'בן איליה ואולגה · сын Ильи и Ольги · son of Ilya and Olga', branch:'kliot', col:14.8, row:5, places:[24] },
  { id:'ron',       he:'רון קליוט', ru:'Рон Клиот', en:'Ron Kliot', years:'', role:'בן איליה ואולגה · сын Ильи и Ольги · son of Ilya and Olga', branch:'kliot', col:15.8, row:5, places:[24] },
  { id:'masha',     he:'מאשה (מריה) לנדו', ru:'Маша (Мария) Ландо', en:'Maria (Masha) Lando', years:'', role:'יזמה את העלייה; מייסדת Ludara.AI · инициатор алии; основательница Ludara.AI · initiated the aliyah; founder of Ludara.AI', branch:'lando', col:9.4, row:4, places:[7,20,23,25] },
  { id:'dima',      he:'דימה (דמיטרי) לנדו', ru:'Дима (Дмитрий) Ландо', en:'Dmitry (Dima) Lando', years:'', role:'חי ברעננה עם משפחתו · живёт в Раанане с семьёй · lives in Raanana with his family', branch:'lando', col:11.8, row:4, places:[7,20,26] },

  // ── FRIEDLAND — צד אמא ───────────────────────────────────────────────────
  { id:'yosi',      he:'יוסף (יוסי) פרידלנד', ru:'Иосиф (Йоси) Фридланд', en:'Yosef (Yosi) Friedland', years:'', role:'אבי סבא זלמן · отец деда Залмана · father of grandfather Zalman', branch:'friedland', col:15.6, row:0, places:[1] },
  { id:'zina',      he:'זינה (זישה) פרידלנד', ru:'Зина (Зиша) Фридланд', en:'Zina (Zisha) Friedland', years:'', role:'לפי הכיתוב: אם סבתי · по подписи: мать бабушки · per the caption: my grandmother\'s mother', branch:'friedland', col:16.6, row:0, places:[1] },
  { id:'sam',       he:'סם (שמואל) פרידלנד', ru:'Сэм (Шмуэль) Фридланд', en:'Sam (Shmuel) Friedland', years:'', role:'ברח לאמריקה ~1910 · бежал в Америку · fled to America ~1910', branch:'friedland', col:13.2, row:1, places:[1,7,16] },
  { id:'dora',      he:'דורה', ru:'Дора', en:'Dora', years:'', role:'רעייתו של סם · жена Сэма · Sam\'s wife', branch:'friedland', col:14.2, row:1, places:[16] },
  { id:'zalman',    he:'זלמן (זחר) פרידלנד', ru:'Залман (Захар) Фридланд', en:'Zalman (Zakhar) Friedland', years:'', role:'סבא (צד אמא) · дед · grandfather', branch:'friedland', col:15.6, row:1, places:[2,11,16] },
  { id:'malka',     he:'מלכה פרידלנד', ru:'Малка Фридланд', en:'Malka Friedland', years:'נפ׳ ~1941', role:'סבתא · бабушка · grandmother', branch:'friedland', col:16.6, row:1, places:[2,11] },
  { id:'ida',       he:'אידה', ru:'Ида', en:'Ida', years:'נרצחה 1941', role:'נרצחה בגטו בוברויסק · погибла в гетто · murdered in the Bobruisk ghetto', branch:'friedland', col:17.8, row:1, places:[2] },
  { id:'polya',     he:'פוליה', ru:'Поля', en:'Polya', years:'', role:'אחות סבא · сестра деда · grandfather\'s sister', branch:'friedland', col:18.85, row:1, places:[16] },
  { id:'avram',     he:'אברם', ru:'Абрам', en:'Avram', years:'', role:'אח של סבא · брат деда · grandfather\'s brother', branch:'friedland', col:19.9, row:1, places:[16] },
  { id:'nina',      he:'נינה (נחמה) פרידלנד', ru:'Нина (Нехама) Фридланд', en:'Nina (Nechama) Friedland', years:'~1924', role:'אמא · мама · mother', branch:'friedland', col:11.9, row:2, places:[2,12,14,10,20] },
  { id:'bella',     he:'בלה', ru:'Белла', en:'Bella', years:'', role:'האחות הבכורה · старшая сестра · the eldest sister', branch:'friedland', col:13.2, row:2, places:[2,12,10] },
  { id:'kagan_f',   he:'מויסיי קגן', ru:'Моисей Каган', en:'Moisei Kagan', years:'', role:'אביה של אליסה · отец Алисы · Alisa\'s father', branch:'friedland', col:14.3, row:2, places:[] },
  { id:'polina_f',  he:'פולינה פרידלנד', ru:'Полина Фридланд', en:'Polina Friedland', years:'נ׳ ~1928', role:'מורה לשפות · преподаватель языков · language teacher', branch:'friedland', col:16.8, row:2, places:[2,12,10] },
  { id:'grisha',    he:'גרישה פרידלנד', ru:'Гриша Фридланд', en:'Grisha Friedland', years:'נפ׳ בגיל 56', role:'מנהל בית ספר · директор школы · school principal', branch:'friedland', col:18, row:2, places:[2,12,10] },
  { id:'pavlina_w', he:'פבלינה', ru:'Павлина', en:'Pavlina', years:'', role:'רעיית גרישה · жена Гриши · Grisha\'s wife', branch:'friedland', col:19.2, row:2, places:[10] },
  { id:'alisa',     he:'אליסה קגן', ru:'Алиса Каган', en:'Alisa Kagan', years:'נ׳ 1941', role:'כנרית ביארוסלבל · скрипачка · violinist in Yaroslavl', branch:'friedland', col:15, row:3, places:[12,10,16,17] },
  { id:'markr',     he:'מארק רוזנבלט', ru:'Марк Розенблат', en:'Mark Rozenblat', years:'', role:'בעלה של אליסה (1962) · муж Алисы · Alisa\'s husband (1962)', branch:'friedland', col:16, row:3, places:[17] },
  { id:'raya_f',    he:'רעיה', ru:'Рая', en:'Raya', years:'', role:'בת פולינה · дочь Полины · Polina\'s daughter', branch:'friedland', col:17.4, row:3, places:[10] },
  { id:'igor',      he:'איגור', ru:'Игорь', en:'Igor', years:'', role:'בן גרישה ופבלינה · сын Гриши и Павлины · son of Grisha and Pavlina', branch:'friedland', col:18.6, row:3, places:[10] },
  { id:'boris_r',   he:'בוריס רוזנבלט', ru:'Борис Розенблат', en:'Boris Rozenblat', years:'', role:'בן אליסה · сын Алисы · Alisa\'s son', branch:'friedland', col:16.8, row:4, places:[17] },
  { id:'yevgeny',   he:'יבגני רוזנבלט', ru:'Евгений Розенблат', en:'Yevgeny Rozenblat', years:'', role:'בן אליסה · сын Алисы · Alisa\'s son', branch:'friedland', col:17.8, row:4, places:[17] },
  { id:'michael_idf',he:'מיכאל', ru:'Михаил', en:'Michael', years:'', role:'נכד אליסה, לוחם בצה״ל · внук Алисы, боец ЦАХАЛа · Alisa\'s grandson, an IDF soldier', branch:'friedland', col:17.1, row:5, places:[20] },

  // ── LANDO & SCHECHTER — צד מישה ──────────────────────────────────────────
  { id:'david_s',   he:'דויד שכטר', ru:'Давид Шехтер', en:'David Schechter', years:'', role:'סבא של מישה · дед Миши · Misha\'s grandfather', branch:'lando', col:23.6, row:1, places:[8] },
  { id:'odiya',     he:'אודיה שכטר', ru:'Одия Шехтер', en:'Odiya Schechter', years:'', role:'סבתא של מישה · бабушка Миши · Misha\'s grandmother', branch:'lando', col:24.6, row:1, places:[8] },
  { id:'hersh',     he:'הרש לנדו', ru:'Герш Ландо', en:'Hersh Lando', years:'', role:'מנהל משק אצל חוואי · управляющий у хуторянина · estate manager for a wealthy farmer', branch:'lando', col:27.2, row:1, places:[8] },
  { id:'milia',     he:'מיליה', ru:'Миля', en:'Milia', years:'', role:'דודתו של מישה · тётя Миши · Misha\'s aunt', branch:'lando', col:21.6, row:2, places:[7] },
  { id:'huma',      he:'חומה (חנה) שכטר', ru:'Хума (Хана) Шехтер', en:'Huma (Hana) Schechter', years:'נ׳ 1908', role:'אם מישה · мать Миши · Misha\'s mother', branch:'lando', col:23.6, row:2, places:[8,7,13] },
  { id:'boruch',    he:'ברוך (בוריס) לנדו', ru:'Барух (Борис) Ландо', en:'Boruch (Boris) Lando', years:'', role:'אבי מישה; בצבא עד 1946 · отец Миши · Misha\'s father; in the army until 1946', branch:'lando', col:24.6, row:2, places:[8,7] },
  { id:'hana_l',    he:'חנה', ru:'Хана', en:'Hana', years:'', role:'אחות ברוך, אשת רב · жена раввина · Boruch\'s sister, a rabbi\'s wife', branch:'lando', col:26, row:2, places:[8] },
  { id:'husband1',  he:'הבעל הראשון', ru:'первый муж', en:'the first husband', years:'', role:'שידוך בכפייה · брак по сговору · an arranged match', branch:'lando', col:27.2, row:2, places:[8] },
  { id:'roza',      he:'רוזה', ru:'Роза', en:'Roza', years:'', role:'אחות ברוך · сестра Баруха · Boruch\'s sister', branch:'lando', col:28.2, row:2, places:[8] },
  { id:'shaul',     he:'שאול', ru:'Шауль', en:'Shaul', years:'', role:'אהובה של רוזה, כלכלן · любимый муж, экономист · Roza\'s beloved husband, an economist', branch:'lando', col:29.2, row:2, places:[8,9] },
  { id:'lyonya',    he:'ליוניה (לאוניד)', ru:'Лёня (Леонид)', en:'Lyonya (Leonid)', years:'', role:'נכד מיליה, נשאר במוסקבה · внук Мили · Milia\'s grandson, stayed in Moscow', branch:'lando', col:20.8, row:4, places:[7] },
  { id:'marina',    he:'מרינה', ru:'Марина', en:'Marina', years:'', role:'נכדת מיליה · внучка Мили · Milia\'s granddaughter', branch:'lando', col:21.8, row:4, places:[7] },
  { id:'volodya',   he:'וולודיה', ru:'Володя', en:'Volodya', years:'', role:'בעלה של מרינה · муж Марины · Marina\'s husband', branch:'lando', col:22.8, row:4, places:[7] },
  { id:'mark_l',    he:'מארק לנדו', ru:'Марк Ландо', en:'Mark Lando', years:'נ׳ 1930', role:'אחיו הבכור של מישה · старший брат · Misha\'s elder brother', branch:'lando', col:23.9, row:3, places:[8,13,7] },
  { id:'misha_l',   he:'מישה (מיכאל) לנדו', ru:'Миша (Михаил) Ландо', en:'Misha (Michael) Lando', years:'נ׳ 1938', role:'בעלי · мой муж · my husband', branch:'lando', col:24.9, row:3, places:[8,13,7,20] },
  { id:'yakov',     he:'יעקב לנדו', ru:'Яков Ландо', en:'Yakov Lando', years:'נ׳ 1941', role:'נולד בפינוי · родился в эвакуации · born in evacuation', branch:'lando', col:25.9, row:3, places:[13,7] },
  { id:'misha_r',   he:'מישה (מיכאל)', ru:'Миша (Михаил)', en:'Misha (Michael)', years:'', role:'בן רוזה; היגר לארה״ב · сын Розы, США · Roza\'s son; emigrated to the USA', branch:'lando', col:27.2, row:3, places:[8,14] },
  { id:'yefim',     he:'יפים', ru:'Ефим', en:'Yefim', years:'נפל ~1942', role:'כירורג, נפל בסטלינגרד · хирург, погиб · surgeon, fell at Stalingrad', branch:'lando', col:28.2, row:3, places:[8,14] },
  { id:'pavel',     he:'פאבל', ru:'Павел', en:'Pavel', years:'', role:'רופא בצ׳יטה · врач в Чите · doctor in Chita', branch:'lando', col:29.2, row:3, places:[8,19] },
  { id:'vera',      he:'ורה', ru:'Вера', en:'Vera', years:'', role:'נשארה באודסה · осталась в Одессе · stayed in Odessa', branch:'lando', col:30.2, row:3, places:[8] },
];

// Parent(s) → children. One or two parents; children in birth order where known.
const FAMILY_UNIONS = [
  // Kliot
  { p:['yosef_k','etasara'], c:['benjamin','sonya','efraim','michael_k','fanya','rivka','raisa'] },
  { p:['sonya','rudolf'],    c:['liza'] },
  { p:['liza','radioman'],   c:['baruch_j'] },
  { p:['baruch_j','rachel'], c:[] },
  { p:['efraim','rita_e'],   c:['semyon','olga_e'] },
  { p:['semyon'],            c:['ilya_s'] },
  { p:['ilya_s'],            c:['miroslava'] },
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
  { p:['bella','kagan_f'],   c:['alisa'] },
  { p:['alisa','markr'],     c:['boris_r','yevgeny'] },
  { p:['polina_f'],          c:['raya_f'] },
  { p:['grisha','pavlina_w'],c:['igor'] },
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

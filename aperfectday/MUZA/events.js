// ── CURRENT EXHIBITIONS ("What's On") ─────────────────────────
// A Perfect Day — MUZA, Eretz Israel Museum (Tel Aviv)
// Time-limited exhibitions, shown as places with cat:'event' so they reuse the
// existing pins, cards, list, favourites and PDF with no engine changes.
//
// Each entry carries en/he/ru/ar blocks using the SAME field names as data.js
// (name / role / zone / desc / tip), so i18n.js applyLang() translates them
// automatically. events.js MUST load AFTER data.js and BEFORE i18n.js.
//
// An exhibition whose endDate has passed is never merged into PLACES, so the
// layer prunes itself with no maintenance. Verified against each exhibition's
// own page on eretzmuseum.org.il on 2 September 2026.
//
// IDs start at 9001 so they never collide with real place IDs.
// Use the Hebrew gershayim ״ inside strings, never a straight double quote.

const EVENT_WINDOW_DAYS = 365;

const EVENTS = [
  {
    id: 9001, nbhd: "core", cat: "event", emoji: "🎨",
    lat: 32.1022894, lng: 34.7958946,
    startDate: "2026-04-20", endDate: "2026-11-07",
    website: "https://www.eretzmuseum.org.il/exhibitions/%D7%94%D7%91%D7%99%D7%90%D7%A0%D7%9C%D7%94-%D7%9C%D7%90%D7%95%D7%9E%D7%A0%D7%95%D7%99%D7%95%D7%AA-%D7%95%D7%9C%D7%A2%D7%99%D7%A6%D7%95%D7%91-%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91-2026/",
    en: { name: "Tel Aviv Biennale of Crafts and Design 2026: Works and Days", role: "Exhibition · until 7 Nov 2026", zone: "Throughout the museum",
         desc: "More than 200 works and projects by Israeli makers fill the third Biennale held at MUZA, under the theme Works and Days. The main exhibition is in the Rothschild Center, and the Biennale then spreads out into the permanent pavilions and the open spaces of the campus, with gallery talks, tours and family activities alongside it. Curators: Henrietta Eliezer Brunner and Galit Gaon.",
         tip: "Start in the Rothschild Center, then look for Biennale works placed inside the permanent pavilions." },
    he: { name: "הביאנלה לאומנויות ולעיצוב תל אביב 2026: מעשים וימים", role: "תערוכה · עד 7.11.26", zone: "ברחבי המוזיאון",
         desc: "למעלה מ-200 עבודות ופרויקטים מאת יוצרות ויוצרים ישראלים מוצגים בביאנלה השלישית המתקיימת במוז״א, תחת התמה מעשים וימים. לצד התערוכה המרכזית במרכז רוטשילד, מתפרשת הביאנלה בביתני הקבע ובמרחבי המוזיאון, ומלווה בסיורים, שיחי גלריה ופעילויות לכל המשפחה. אוצרות: אנריאטה אליעזר ברונר וגלית גאון.",
         tip: "התחילו במרכז רוטשילד, ואחר כך חפשו את עבודות הביאנלה המוצבות בתוך ביתני הקבע." },
    ru: { name: "Тель-Авивская биеннале ремесла и дизайна 2026: Труды и дни", role: "Выставка · до 7.11.26", zone: "По всему музею",
         desc: "Более 200 работ и проектов израильских авторов представлены на третьей биеннале в MUZA под темой Труды и дни. Основная экспозиция размещена в центре Ротшильда, а сама биеннале продолжается в постоянных павильонах и на открытых пространствах кампуса, сопровождаясь экскурсиями, беседами в галерее и семейными занятиями. Кураторы: Энриэтта Элиэзер Бруннер и Галит Гаон.",
         tip: "Начните с центра Ротшильда, затем ищите работы биеннале внутри постоянных павильонов." },
    ar: { name: "بينالي تل أبيب للحرف والتصميم 2026: أعمال وأيام", role: "معرض · حتى 7.11.26", zone: "في أنحاء المتحف",
         desc: "أكثر من 200 عمل ومشروع لفنانين إسرائيليين تُعرض في البينالي الثالث الذي يقام في متحف أرض إسرائيل، تحت عنوان أعمال وأيام. يقع المعرض الرئيسي في مركز روتشيلد، ثم يمتد البينالي إلى الأجنحة الدائمة وإلى الساحات المفتوحة في الحرم، مصحوباً بجولات وحوارات في الأروقة وأنشطة عائلية. أمينتا المعرض: إنرييتا إليعيزر برونر وغاليت غاؤون.",
         tip: "ابدأ من مركز روتشيلد، ثم ابحث عن أعمال البينالي الموضوعة داخل الأجنحة الدائمة." },
  },
  {
    id: 9002, nbhd: "east", cat: "event", emoji: "🖌️",
    lat: 32.1025605, lng: 34.7976444,
    startDate: "2026-06-23", endDate: "2027-04-30",
    website: "https://www.eretzmuseum.org.il/exhibitions/%D7%99%D7%95%D7%9D-%D7%93%D7%99%D7%9F-2018-2022/",
    en: { name: "Judgment Day, 2018–2022", role: "Exhibition · until 30 Apr 2027", zone: "Nehushtan Pavilion",
         desc: "Judgment Day is a monumental painting by Neta Harari-Navon, built from wooden panels that join into a wide composition which never settles into a single stable focus. The eye travels between the parts, and each viewer assembles a different reading of what is happening. Curators: Ilana Elgart Sharon and Raz Samira.",
         tip: "Stand back first for the whole composition, then come close for the panels." },
    he: { name: "יום דין, 2018–2022", role: "תערוכה · עד 30.4.27", zone: "ביתן נחושתן",
         desc: "העבודה יום דין, ציור מונומנטלי של נטע הררי-נבון, עשויה לוחות עץ המתלכדים לקומפוזיציה רחבת ממדים שאינה מתכנסת למוקד יציב אחד. המבט נע בין חלקי היצירה, והצופה מרכיב בכל פעם קריאה אחרת של המתרחש. אוצרים: אילנה אלגרט שרון ורז סמירה.",
         tip: "התרחקו תחילה כדי לראות את הקומפוזיציה כולה, ורק אחר כך התקרבו אל הלוחות." },
    ru: { name: "Судный день, 2018–2022", role: "Выставка · до 30.4.27", zone: "Павильон Нехуштан",
         desc: "Судный день — монументальная живопись Неты Харари-Навон, собранная из деревянных панелей, которые складываются в широкую композицию, не сходящуюся к одному устойчивому центру. Взгляд движется между частями работы, и каждый зритель всякий раз собирает иное прочтение происходящего. Кураторы: Илана Элгарт Шарон и Раз Самира.",
         tip: "Сначала отойдите, чтобы увидеть композицию целиком, и только потом подойдите к панелям." },
    ar: { name: "يوم الدين، 2018–2022", role: "معرض · حتى 30.4.27", zone: "جناح نحوشتان",
         desc: "يوم الدين عمل تصويري ضخم للفنانة نيتاع هراري-نافون، مركّب من ألواح خشبية تتلاحم في تكوين واسع لا يستقر على مركز واحد ثابت. تتنقل العين بين أجزاء العمل، ويؤلّف كل مشاهد قراءة مختلفة لما يجري. أمناء المعرض: إيلانا إلغارت شارون وراز سميرة.",
         tip: "ابتعد أولاً لترى التكوين كاملاً، ثم اقترب من الألواح." },
  },
  {
    id: 9003, nbhd: "east", cat: "event", emoji: "🗿",
    lat: 32.1028378, lng: 34.7978806,
    startDate: "2026-06-18", endDate: "2026-09-18",
    website: "https://www.eretzmuseum.org.il/exhibitions/%D7%9E%D7%95%D7%A6%D7%92-%D7%9E%D7%99%D7%95%D7%97%D7%93-%D7%A6%D7%9E%D7%93-%D7%A4%D7%A1%D7%9C%D7%99-%D7%93%D7%99%D7%95%D7%A7%D7%9F-%D7%9E%D7%94%D7%AA%D7%A7%D7%95%D7%A4%D7%94-%D7%94%D7%A8%D7%95%D7%9E/",
    en: { name: "Special Exhibit: Two Roman Portrait Herms", role: "Special display · until 18 Sep 2026", zone: "Ceramics Pavilion",
         desc: "A pair of Roman portrait sculptures uncovered in May 2026 in a rescue excavation near Binyamina, directed by Eliran Oren and Avishag Rice. The two were found together, laid face down inside the settling pit of a wine press, which may be evidence of a deliberate burial in antiquity. Each shows the head, shoulders and chest of a bearded man, worked with the fine detail characteristic of Roman art. Curator: Ilana Elgart Sharon.",
         tip: "Recently excavated and on display for a short season only." },
    he: { name: "מוצג מיוחד: צמד פסלי דיוקן (הרמות) מהתקופה הרומית", role: "מוצג מיוחד · עד 18.9.26", zone: "ביתן הקרמיקה",
         desc: "צמד פסלי הדיוקן נחשף במאי 2026 בחפירת הצלה סמוך לבנימינה, בניהולם של אלירן אורן ואבישג רייס. הפסלים נמצאו יחד, מונחים בתוך בור סינון של גת יין כשפניהם כלפי מטה, עדות אפשרית להטמנה מכוונת בעת העתיקה. כל אחד מהם מציג דיוקן, כתפיים וחזה של גבר עטור זקן, מעוצבים ברמת פירוט מרשימה האופיינית לאמנות הרומית. אוצרת: אילנה אלגרט שרון.",
         tip: "ממצא טרי מן החפירה, מוצג לתקופה קצרה בלבד." },
    ru: { name: "Особый экспонат: две римские портретные гермы", role: "Особый показ · до 18.9.26", zone: "Павильон керамики",
         desc: "Пара римских портретных скульптур, обнаруженная в мае 2026 года при спасательных раскопках близ Биньямины под руководством Элирана Орена и Авишаг Райс. Обе были найдены вместе, лежащими лицом вниз в отстойной яме винодавильни, что может указывать на намеренное сокрытие в древности. Каждая передаёт голову, плечи и грудь бородатого мужчины, выполненные с тонкой детализацией, характерной для римского искусства. Куратор: Илана Элгарт Шарон.",
         tip: "Свежая находка, выставлена лишь на короткий срок." },
    ar: { name: "معروض خاص: تمثالا هرمة رومانيان", role: "عرض خاص · حتى 18.9.26", zone: "جناح الخزف",
         desc: "تمثالان رومانيان للوجه كُشف عنهما في أيار 2026 في حفرية إنقاذ قرب بنيامينا، بإدارة إليران أورن وأفيشاغ رايس. عُثر عليهما معاً موضوعين ووجهاهما إلى الأسفل داخل حفرة ترسيب لمعصرة نبيذ، وهو ما قد يدل على إخفاء متعمّد في العصور القديمة. يُظهر كل منهما رأس رجل ملتحٍ وكتفيه وصدره، منحوتاً بتفصيل دقيق يميّز الفن الروماني. أمينة المعرض: إيلانا إلغارت شارون.",
         tip: "اكتشاف حديث، معروض لفترة قصيرة فقط." },
  },
  {
    id: 9004, nbhd: "east", cat: "event", emoji: "⏳",
    lat: 32.1033136, lng: 34.79758,
    startDate: "2025-09-11", endDate: "2026-12-31",
    website: "https://www.eretzmuseum.org.il/exhibitions/%D7%A9%D7%95%D7%95%D7%94-%D7%9C%D7%97%D7%9B%D7%95%D7%AA/",
    en: { name: "Worth the Wait", role: "Family exhibition · until 31 Dec 2026", zone: "Alexander Pavilion of Postal History",
         desc: "Are we there yet? Everyday life is made of small waits and large ones, from waiting for a friend to arrive, through a family journey, to waiting for a baby to be born. Modern technology has changed those waiting times dramatically: what once took days or weeks, from posting a letter to developing a photograph, now takes seconds, while nature goes on teaching patience. Curators: Tamor Haimovich and Noga Shai-Sherbrek.",
         tip: "Built for families, with things for children to do along the way." },
    he: { name: "שווה לחכות", role: "תערוכה לכל המשפחה · עד 31.12.26", zone: "ביתן אלכסנדר לתולדות הדואר והבולאות",
         desc: "הגענו? כבר הגענו? חיי היום יום שלנו רצופים בהמתנות קטנות וגדולות: מהמתנה לחבר שיגיע לביקור, דרך נסיעה משפחתית ועד ציפייה לתינוק שייוולד. התמורות הטכנולוגיות הביאו לשינוי דרמטי בזמני ההמתנה שלנו, ומה שפעם ארך ימים ושבועות, משליחת מכתב ועד פיתוח תמונות, הפך לעניין של שניות. לצד זאת, הטבע ממשיך ללמד אותנו שיעור בסבלנות. אוצרות: תמור חיימוביץ ונגה שי-שרברק.",
         tip: "תערוכה שנבנתה למשפחות, עם פעילות לילדים לאורך הדרך." },
    ru: { name: "Стоит подождать", role: "Семейная выставка · до 31.12.26", zone: "Павильон Александра, история почты",
         desc: "Мы уже приехали? Наша повседневная жизнь соткана из ожиданий, маленьких и больших: от ожидания друга в гости и семейной поездки до ожидания рождения ребёнка. Технологические перемены резко изменили эти сроки: то, что когда-то занимало дни и недели, от отправки письма до проявки фотографии, теперь укладывается в секунды, а природа по-прежнему учит нас терпению. Кураторы: Тамор Хаймович и Нога Шай-Шербрек.",
         tip: "Выставка сделана для семей, с занятиями для детей по пути." },
    ar: { name: "يستحق الانتظار", role: "معرض عائلي · حتى 31.12.26", zone: "جناح ألكسندر لتاريخ البريد",
         desc: "هل وصلنا بعد؟ حياتنا اليومية مليئة بانتظارات صغيرة وكبيرة: من انتظار صديق قادم للزيارة، إلى رحلة عائلية، إلى انتظار مولود. غيّرت التحولات التكنولوجية أزمنة الانتظار تغييراً كبيراً، فما كان يستغرق أياماً وأسابيع، من إرسال رسالة إلى تحميض صورة، صار مسألة ثوانٍ، بينما تواصل الطبيعة تعليمنا درساً في الصبر. أمينتا المعرض: تامور حايموفيتش ونوغا شاي-شربرك.",
         tip: "معرض صُمّم للعائلات، وفيه أنشطة للأطفال على طول المسار." },
  },
  {
    id: 9005, nbhd: "core", cat: "event", emoji: "📬",
    lat: 32.1027887, lng: 34.7955134,
    startDate: "2025-03-13", endDate: "2026-12-31",
    website: "https://www.eretzmuseum.org.il/exhibitions/%D7%92%D7%9C%D7%95%D7%99%D7%95%D7%AA-%D7%9E%D7%90%D7%AA%D7%9E%D7%95%D7%9C/",
    en: { name: "Postcards from Yesterday · Vera Vladimirsky", role: "Wall work · until 31 Dec 2026", zone: "Klatchkin Center",
         desc: "A permanent, site-specific wall work commissioned by MUZA from the artist Vera Vladimirsky. It responds to the multidisciplinary character of the museum itself, which holds historical collections of archaeology, ethnography, photography and folklore side by side. Curator: Raz Samira.",
         tip: "Look for it on the wall as you pass through the Klatchkin Center." },
    he: { name: "גלויות מאתמול · ורה ולדימירסקי", role: "עבודת קיר · עד 31.12.26", zone: "מרכז קלצ׳קין",
         desc: "גלויות מאתמול היא עבודת קיר קבועה ומותאמת חלל, בהזמנת מוז״א, מוזיאון ארץ ישראל תל אביב. העבודה מתייחסת לאופיו הרב תחומי של המוזיאון, המכיל זה לצד זה אוספים היסטוריים של ארכאולוגיה, אתנוגרפיה, צילום ופולקלור. אוצר: רז סמירה.",
         tip: "חפשו אותה על הקיר בדרככם דרך מרכז קלצ׳קין." },
    ru: { name: "Открытки из вчера · Вера Владимирская", role: "Настенная работа · до 31.12.26", zone: "Центр Клячкина",
         desc: "Постоянная настенная работа, созданная специально для этого пространства по заказу музея у художницы Веры Владимирской. Она отзывается на междисциплинарный характер самого музея, где рядом хранятся исторические собрания археологии, этнографии, фотографии и фольклора. Куратор: Раз Самира.",
         tip: "Ищите её на стене, проходя через центр Клячкина." },
    ar: { name: "بطاقات من الأمس · فيرا فلاديميرسكي", role: "عمل جداري · حتى 31.12.26", zone: "مركز كلاتشكين",
         desc: "عمل جداري دائم مصمّم خصيصاً للمكان، كلّف المتحف الفنانة فيرا فلاديميرسكي بإنجازه. يستجيب العمل للطابع متعدد التخصصات للمتحف نفسه، الذي يضم جنباً إلى جنب مجموعات تاريخية في علم الآثار والإثنوغرافيا والتصوير والفولكلور. أمين المعرض: راز سميرة.",
         tip: "ابحث عنه على الجدار في طريقك عبر مركز كلاتشكين." },
  },
  {
    id: 9006, nbhd: "east", cat: "event", emoji: "🔖",
    lat: 32.1028378, lng: 34.7978806,
    startDate: "2024-12-13", endDate: "2026-12-31",
    website: "https://www.eretzmuseum.org.il/exhibitions/%D7%A2%D7%9C-%D7%97%D7%A4%D7%A6%D7%99%D7%9D-%D7%95%D7%90%D7%A0%D7%A9%D7%99%D7%9D/",
    en: { name: "Of Objects and People: Seals from the MUZA Collection", role: "Special display · until 31 Dec 2026", zone: "Ceramics Pavilion",
         desc: "Amulet seals shown to the public for the first time, in a collaboration between MUZA and the Department of Archaeology and Ancient Near Eastern Cultures at Tel Aviv University. Around twenty seals were chosen from some three hundred held in the Ceramics Pavilion collection. Graduate students carried out an iconographic and material study of each one and catalogued it by its own distinctive features. Curator: Ilana Elgart Sharon.",
         tip: "Small objects, worth slowing down for." },
    he: { name: "על חפצים ואנשים: חותמות מאוסף מוז״א", role: "תצוגה מיוחדת · עד 31.12.26", zone: "ביתן הקרמיקה",
         desc: "התערוכה היא תצוגה מיוחדת של חותמות קמע המוצגות לראשונה לקהל, פרי שיתוף פעולה בין מוז״א ובין החוג לארכאולוגיה ותרבויות המזרח הקדום באוניברסיטת תל אביב. מתוך כשלוש מאות חותמות מאוסף ביתן הקרמיקה נבחרו כעשרים. סטודנטים לתארים מתקדמים ערכו לכל אחת מהן מחקר איקונוגרפי וחומרי, וקטלגו את הפריט על פי המאפיינים הייחודיים לו. אוצרת: אילנה אלגרט שרון.",
         tip: "פריטים קטנים, שווה לעצור לידם לרגע." },
    ru: { name: "О вещах и людях: печати из собрания музея", role: "Особый показ · до 31.12.26", zone: "Павильон керамики",
         desc: "Печати-амулеты, впервые показанные публике, в сотрудничестве музея с кафедрой археологии и культур древнего Ближнего Востока Тель-Авивского университета. Из примерно трёхсот печатей собрания павильона керамики отобрано около двадцати. Студенты старших курсов провели иконографическое и материаловедческое исследование каждой и каталогизировали её по присущим ей признакам. Куратор: Илана Элгарт Шарон.",
         tip: "Предметы совсем небольшие, у них стоит задержаться." },
    ar: { name: "عن الأشياء والناس: أختام من مجموعة المتحف", role: "عرض خاص · حتى 31.12.26", zone: "جناح الخزف",
         desc: "أختام تعويذية تُعرض على الجمهور للمرة الأولى، بالتعاون بين المتحف وقسم الآثار وثقافات الشرق الأدنى القديم في جامعة تل أبيب. اختير نحو عشرين ختماً من بين ثلاثمئة تقريباً في مجموعة جناح الخزف. أجرى طلاب الدراسات العليا لكل منها بحثاً أيقونياً ومادياً، وفهرسوا القطعة بحسب سماتها الخاصة. أمينة المعرض: إيلانا إلغارت شارون.",
         tip: "قطع صغيرة الحجم، تستحق التوقف عندها." },
  },
  {
    id: 9007, nbhd: "east", cat: "event", emoji: "📷",
    lat: 32.1033136, lng: 34.79758,
    startDate: "2024-11-22", endDate: "2026-11-21",
    website: "https://www.eretzmuseum.org.il/exhibitions/%D7%AA%D7%9C-%D7%90%D7%95%D7%A8-%D7%9E%D7%A6%D7%9C%D7%9E%D7%95%D7%AA-%D7%90%D7%A0%D7%9C%D7%95%D7%92%D7%99%D7%95%D7%AA/",
    en: { name: "Tel Or: Analog Cameras, 1860–2000", role: "Exhibition · until 21 Nov 2026", zone: "Alexander Pavilion of Postal History",
         desc: "A chronological display of the analog cameras used by photographers working in this country, from the beginnings of photography to the digital age. Among them a twin-lens stereoscopic camera and a wooden camera of the kind carried on nineteenth-century photographic expeditions. Curator: Tagia Raz.",
         tip: "Follow it left to right and the whole history of the craft passes in one room." },
    he: { name: "תל אור: מצלמות אנלוגיות, 1860–2000", role: "תערוכה · עד 21.11.26", zone: "ביתן אלכסנדר לתולדות הדואר והבולאות",
         desc: "התערוכה כוללת תצוגה כרונולוגית של מצלמות אנלוגיות ששימשו את צלמי הארץ, מראשית הצילום ועד לעידן הדיגיטלי. בין המוצגים מצלמה סטריאוסקופית דו עינית, בעלת שתי עדשות, ומצלמת עץ שכמוהן שימשו במסעות צילום במאה ה-19. אוצרת: תגיא רז.",
         tip: "עברו לאורך התצוגה לפי הסדר, וכל תולדות המקצוע חולפות בחדר אחד." },
    ru: { name: "Тель Ор: аналоговые камеры, 1860–2000", role: "Выставка · до 21.11.26", zone: "Павильон Александра, история почты",
         desc: "Хронологическая экспозиция аналоговых камер, которыми пользовались фотографы этой страны, от зарождения фотографии до цифровой эпохи. Среди экспонатов двухобъективная стереоскопическая камера и деревянная камера того типа, что брали в фотографические экспедиции XIX века. Куратор: Тагия Раз.",
         tip: "Пройдите экспозицию по порядку, и вся история ремесла уместится в одной комнате." },
    ar: { name: "تل أور: كاميرات تناظرية، 1860–2000", role: "معرض · حتى 21.11.26", zone: "جناح ألكسندر لتاريخ البريد",
         desc: "عرض زمني للكاميرات التناظرية التي استخدمها مصورو البلاد، من بدايات التصوير حتى العصر الرقمي. من بين المعروضات كاميرا مجسّمة بعدستين، وكاميرا خشبية من النوع الذي رافق رحلات التصوير في القرن التاسع عشر. أمينة المعرض: تاغيا راز.",
         tip: "امشِ مع العرض بالترتيب، فيمر تاريخ الحرفة كله في غرفة واحدة." },
  },
  {
    id: 9008, nbhd: "park", cat: "event", emoji: "✂️",
    lat: 32.1009395, lng: 34.7946903,
    startDate: "2025-03-10", endDate: "2026-09-30",
    website: "https://www.eretzmuseum.org.il/exhibitions/%D7%AA%D7%A6%D7%95%D7%92%D7%94-%D7%9E%D7%99%D7%95%D7%97%D7%93%D7%AA-%D7%91%D7%91%D7%99%D7%AA%D7%9F-%D7%9C%D7%AA%D7%A8%D7%91%D7%95%D7%AA-%D7%99%D7%94%D7%95%D7%93%D7%99%D7%AA-%D7%95%D7%9C%D7%A4%D7%95/",
    en: { name: "Yehudit Shadur: Papercuts, 1970–1980", role: "Special display · until 30 Sep 2026", zone: "Jewish Culture and Folklore Pavilion",
         desc: "Papercutting is an ancient art, known in the Far East for shadow theatre and for decoration. In Jewish folk art it became popular in the communities of Eastern Europe from the eighteenth century, above all in the Mizrach panels hung on the eastern wall of a home, a synagogue or a sukkah to mark the direction of Jerusalem. Curator: Maya Musak.",
         tip: "Closes at the end of September." },
    he: { name: "יהודית שדור: מגזרות נייר, 1970–1980", role: "תצוגה מיוחדת · עד 30.9.26", zone: "הביתן לתרבות יהודית ולפולקלור",
         desc: "אמנות מגזרת הנייר עתיקת יומין ומוכרת בארצות המזרח הרחוק בשימוש בתיאטרון צלליות, לקישוט ולנוי. באמנות היהודית העממית הייתה מגזרת הנייר פופולרית בקהילות מזרח אירופה החל במאה ה-18, ובראשן לוחות מזרח שנתלו על הכותל המזרחי בבתים, בבתי כנסת או בסוכה וציינו את כיוון ירושלים. אוצרת: מאיה מוסק.",
         tip: "התצוגה נסגרת בסוף ספטמבר." },
    ru: { name: "Иехудит Шадур: вырезки из бумаги, 1970–1980", role: "Особый показ · до 30.9.26", zone: "Павильон еврейской культуры и фольклора",
         desc: "Искусство бумажной вырезки древнее и хорошо известно на Дальнем Востоке в театре теней и в убранстве. В еврейском народном искусстве оно распространилось в общинах Восточной Европы начиная с XVIII века, прежде всего в табличках мизрах, которые вешали на восточной стене дома, синагоги или сукки, отмечая направление на Иерусалим. Куратор: Майя Мусак.",
         tip: "Показ закрывается в конце сентября." },
    ar: { name: "يهوديت شادور: قصاصات ورقية، 1970–1980", role: "عرض خاص · حتى 30.9.26", zone: "جناح الثقافة اليهودية والفولكلور",
         desc: "فن قص الورق قديم ومعروف في الشرق الأقصى في مسرح الظل وفي الزخرفة. وفي الفن الشعبي اليهودي انتشر في جماعات أوروبا الشرقية منذ القرن الثامن عشر، وفي مقدمته ألواح مزراح التي كانت تُعلّق على الجدار الشرقي في البيوت والكنس والمظلة، للدلالة على اتجاه القدس. أمينة المعرض: مايا موساك.",
         tip: "ينتهي العرض في نهاية أيلول." },
  },
  {
    id: 9009, nbhd: "east", cat: "event", emoji: "✉️",
    lat: 32.1033136, lng: 34.79758,
    startDate: "2021-09-19", endDate: "2026-10-03",
    website: "https://www.eretzmuseum.org.il/exhibitions/%D7%92%D7%9C%D7%95%D7%99%D7%95%D7%AA-%D7%9C%D7%9C%D7%90-%D7%92%D7%91%D7%95%D7%9C%D7%95%D7%AA/",
    en: { name: "Postcards Without Borders", role: "Special display · until 3 Oct 2026", zone: "Alexander Pavilion of Postal History",
         desc: "From its first appearance more than 150 years ago, the postcard became a communication tool of the first order and at times the only one: the most efficient, most common and cheapest in the world before the telephone was invented. It came into official use in Vienna in 1869 and quickly became a medium for a short, condensed message. Curator: Rachel Bonfil.",
         tip: "In its final month after a long run." },
    he: { name: "מוצג מיוחד: גלויות ללא גבולות", role: "תצוגה מיוחדת · עד 3.10.26", zone: "ביתן אלכסנדר לתולדות הדואר והבולאות",
         desc: "משחר הופעתה, לפני למעלה מ-150 שנים, הפכה גלוית הדואר לאמצעי תקשורת ראשון במעלה ולעיתים יחיד, לכלי היעיל, השכיח והזול ביותר ברחבי העולם טרם המצאת הטלפון. היא נכנסה לשימוש באופן רשמי בווינה בשנת 1869, ועד מהרה הפכה למצע המאפשר מסר קצר ותמציתי. אוצרת: רחל בונפיל.",
         tip: "בחודש האחרון שלה, אחרי תקופת הצגה ארוכה." },
    ru: { name: "Открытки без границ", role: "Особый показ · до 3.10.26", zone: "Павильон Александра, история почты",
         desc: "С первого своего появления более 150 лет назад почтовая открытка стала средством связи первостепенной, а порой и единственной важности: самым действенным, самым распространённым и самым дешёвым в мире до изобретения телефона. Официально она вошла в обиход в Вене в 1869 году и вскоре превратилась в носитель короткого и ёмкого сообщения. Куратор: Рахель Бонфиль.",
         tip: "Последний месяц после долгого показа." },
    ar: { name: "معروض خاص: بطاقات بلا حدود", role: "عرض خاص · حتى 3.10.26", zone: "جناح ألكسندر لتاريخ البريد",
         desc: "منذ ظهورها الأول قبل أكثر من 150 عاماً، صارت البطاقة البريدية وسيلة اتصال من الطراز الأول، وأحياناً الوحيدة: الأنجع والأكثر شيوعاً والأرخص في العالم قبل اختراع الهاتف. دخلت الاستعمال الرسمي في فيينا عام 1869، وسرعان ما غدت وسيطاً لرسالة قصيرة مكثّفة. أمينة المعرض: راحيل بونفيل.",
         tip: "في شهره الأخير بعد فترة عرض طويلة." },
  },
];

// ── Date helpers ──────────────────────────────────────────────
function _apdEventToday(){
  var tz = (typeof GUIDE_TIMEZONE !== 'undefined' && GUIDE_TIMEZONE) ? GUIDE_TIMEZONE : 'Asia/Jerusalem';
  var d = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
  d.setHours(0,0,0,0);
  return d;
}
function _apdParseDate(str){
  var p = String(str).split('-');
  return new Date(+p[0], +p[1]-1, +p[2]);
}
// True while an exhibition has NOT yet closed (closes today or later).
function isEventNotPassed(p){
  if(!p || p.cat !== 'event') return true;
  return _apdParseDate(p.endDate) >= _apdEventToday();
}
// True when it closes today or later AND opens within the window ahead.
function isEventInWindow(p){
  if(!p || p.cat !== 'event') return false;
  var today = _apdEventToday();
  var horizon = new Date(today);
  horizon.setDate(horizon.getDate() + EVENT_WINDOW_DAYS);
  return _apdParseDate(p.endDate) >= today && _apdParseDate(p.startDate) <= horizon;
}
// True when it is open today. Lets Open Now count a running exhibition.
function isEventOnNow(p){
  if(!p || p.cat !== 'event') return false;
  var today = _apdEventToday();
  return _apdParseDate(p.startDate) <= today && _apdParseDate(p.endDate) >= today;
}
// Events currently worth showing, earliest closing first, so what is about to
// end sits at the top of the list.
function eventsShowing(){
  return EVENTS.filter(isEventInWindow).sort(function(a,b){
    return a.endDate < b.endDate ? -1 : (a.endDate > b.endDate ? 1 : 0);
  });
}

// ── Merge into PLACES ─────────────────────────────────────────
// Only exhibitions that have not closed are merged, so a finished one vanishes
// from the map, the list, search, the PDF and any saved favourites with no
// maintenance. Runs BEFORE i18n.js, so applyLang() translates events like any
// other place.
if (typeof PLACES !== 'undefined' && Array.isArray(PLACES)) {
  window.PLACE_COUNT = PLACES.length;   // curated places, captured before the merge
  var _apdLive = eventsShowing();
  window.EVENT_COUNT = _apdLive.length;
  PLACES.push.apply(PLACES, _apdLive);
}

# Planul de conținut organic — X · TikTok · Instagram + Stories

Owner, 2026-11-02: *„Eu voi face mainly content organic care va duce aici, de aceea vreau sa
reincepem postarile pe x, tiktok si instagram + story si vreau sa facem un plan perfect."*

Planul ăsta nu pornește de la zero. Pornește de la ce ai deja măsurat și de la ce e deja
produs și nepostat. Tot ce e marcat **măsurat** vine din cercetarea ta din septembrie–octombrie,
cu sursă; restul e judecată și e marcat ca atare.

---

## 1. Singura treabă a conținutului

Nu reach. Nu urmăritori. **Înscrieri la mini-curs.**

Distincția nu e filosofie, e măsurată: **3,2 milioane de vizualizări au produs 6.000 de
urmăritori** ([[vandy-pilon-motivatie-video]]). Un conținut care face cifre mari fără să ducă
nicăieri e muncă pierdută, iar tu ai mai trecut o dată prin asta.

Deci fiecare postare trebuie să treacă un test: **omul care tocmai a văzut asta are un motiv
să vrea mai mult, și știe unde?**

### Lanțul, și unde se pierde

```
vizualizare → click pe profil → click pe link → pagina /mentorat → formular → mini-curs
                   ~1–3%          ~20–40%           ~15–25%
```

Procentele alea sunt ordine de mărime, nu previziuni — **niciunul nu e măsurat pe conturile
tale.** Important nu e să le nimerești, e să le **măsori** din prima săptămână, pentru că
veriga cea mai slabă decide tot, și nu poți ști care e fără cifre.

Un ordin de mărime ca să-ți dimensionezi așteptările: la 10.000 de vizualizări pe un clip
bun, 20–60 de oameni ajung pe pagină și 5–15 se înscriu. **Deci primele sute de lead-uri vin
din zeci de postări, nu din trei.** Organicul e lent și gratuit; nu e rapid.

---

## 2. Ce face fiecare canal — și ce NU face

Rolurile nu sunt preferințe. Ies din cercetarea ta din 10.10.2026.

### TikTok — MOTORUL. Aici crești.

- **8,71 mil. de utilizatori adulți în România** (DataReportal, Digital 2026). Cel mai mare
  bazin, de departe.
- Ai deja **26.700 de urmăritori** — nu pornești de la zero.
- **măsurat:** publicul românesc de business e pe TikTok, nu pe YouTube
  ([[vandy-pilon-construiesc-business]]: Chifoi 557K).
- **Plafonul realist** pentru conținut creativ în română: 130–180K pe clip
  ([[vandy-audienta-design-ro]]). Nu-ți propune milioane; nu există în nișa asta, în limba asta.
- **Volum: 1 clip pe zi.** Sub asta, algoritmul nu are din ce alege.

### Instagram Reels — al doilea motor, cost marginal zero

Același clip, reîncărcat nativ (nu redistribuit cu watermark). **6,00 mil. în România.**

⚠️ **măsurat, și contează pentru ce postezi:** formatele statice — machetele de citate,
cardurile, orice „text montage" — **nu pot fi monetizate pe Instagram** (Content Monetisation
Policies: „Static videos", „Static image polls", „Slideshows of images", „Text montages").
Aduc urmăritori, nu bani direcți de la Instagram. Nu e un motiv să nu le postezi — e un motiv
să nu construiești pe ele.

Grila de profil e a doua pagină de vânzare. Cine vine dintr-un clip se uită la primele 9
pătrate înainte să decidă dacă te urmărește.

### Instagram Stories — NU e canal de creștere. E strat de livrare.

Ăsta e lucrul pe care îl greșește toată lumea, și tu l-ai verificat deja la sursă oficială:

- **Toate cele trei semnale oficiale de ranking în Stories sunt despre relația existentă** —
  viewing history, engagement history, closeness (Instagram, „Ranking Explained", 31.05.2023).
  **Nu există niciun semnal de descoperire.**
- Instagram, textual: *„The stories you see are from people you've chosen to follow, as well
  as ads."*
- Reach ca % din urmăritori, la 10–50K (Socialinsider, 161.180 Stories): **Feed 3,70% ·
  Stories 0,60%.**

**→ Stories reordonează cercul pe care îl ai. Nu îl lărgesc.** Rolul lor real: hrănesc
„engagement history" și „closeness", care ridică livrarea Reels-urilor tale către urmăritorii
actuali. Plus: e **singurul loc unde linkul e nativ** și se apasă fără să treacă prin bio.

**Regula:** dacă Stories îți mănâncă timpul de TikTok/Reels, nu merită. 2–3 cadre/zi, din
material deja filmat, maximum 10 minute.

### X — canal de autoritate, nu de distribuție

**1,73 mil. în România — de ~5 ori mai mic decât TikTok.** Nu merită o linie de producție
separată. Merită redistribuire inteligentă, pentru că acolo stau oamenii care cumpără la 990 €.

**Ponderile reale din codul open-source** (`home-mixer/params/param.rs`, verificate 10.10.2026):

| acțiune | pondere | ce înseamnă pentru tine |
|---|---|---|
| **copiere link** | **20,0** | conținutul care se trimite mai departe în privat |
| **reply între conturi care se urmăresc reciproc** | **5,0 × boost 15,0** | conversația, nu postarea |
| quote · DM · follow | 5,0 · 5,0 · 4,0 | |
| retweet | 1,0 | |
| **like** | **0,5** | practic irelevant |
| **click pe profil** | **0,0** | zero. nu optimiza pentru el |
| report · mute | −234 · −58,8 | |

Trei consecințe tactice, direct din cod:
1. **Postare originală, nu fir.** Reply-urile sunt filtrate din For You pentru cine nu te
   urmărește (`OONRetweetReplyFilter`). Firele lucrează pentru urmăritori, nu pentru
   descoperire.
2. **Ești în fereastra de cold start**: postare originală · sub 50.000 de urmăritori · sub 2
   ore vechime · sub 200 de impresii → ridicată în slotul 15–16. O postare trăiește maximum
   **48 de ore** ca și candidat.
3. **Linkurile NU sunt penalizate.** Singurul parametru legat de linkuri e `OpenLinkWeight`
   **+0,2**, pozitiv. Folclorul „linkurile îți omoară reach-ul" nu are suport în cod.

**Volumul pe X:** 1 postare originală/zi + **20–30 de minute de reply-uri** la oameni cu care
te urmărești reciproc. Reply-urile alea sunt singurul lucru cu multiplicator 15× în tot codul.

### YouTube — nu acum

Al doilea plafon măsurat: meșteșug pe YouTube ~15–20K, mult sub TikTok
([[vandy-audienta-design-ro]]). Mai târziu, ca arhivă pentru înregistrările lungi.

---

## 3. Formatele, în ordinea în care aș paria pe ele

### 1. ARTEFACTUL — lucrul construit, și prețul lui

Arăți un site/aplicație reală, spui ce a cerut clientul și cât a plătit.

De ce primul: **n-ai niciun absolvent și nicio recenzie.** Dovada trebuie să vină din lucrul
tău, nu din al altora. Și te ține în poziția de meșter, nu de posesor
([[vandy-asimetria-nu-averea]]) — singura poziție care nu atrage ostilitate în România.

Format: 15–25 s, ecranul sus / fața jos, text serif galben peste
([[vandy-referinta-jb-copeland]]: clipul lui de 502.500 are 17 s și **doar 5 s de vorbit**).

### 2. ȘTIREA ECONOMICĂ TRADUSĂ ÎN BANII OMULUI

**măsurat: singurul format românesc cu PODEA** — p10 = 3.000 de vizualizări
([[vandy-pilon-construiesc-business]]). Adică și cel mai slab clip din zece face 3.000. Niciun
alt format din cercetarea ta nu are asta.

O știre despre AI/tehnologie/economie → ce înseamnă concret pentru un om cu o firmă mică.

### 3. CARDURILE DE ÎNCREDERE

**măsurat: 37% rată de salvări la referință** (Hormozi: 658 salvări la 1.772 aprecieri).
Oamenii nu dau like — **păstrează**. Și pe X, salvarea/trimiterea e exact ce are pondere 20,0.

⛔ **Regula absolută: formatul se copiază, CUVINTELE NU.** Toate textele originale, semnate cu
numele tău. [[vandy-carduri-incredere]].

⚠️ **Bifa albastră de pe carduri**: dacă nu ești verificat pe X, e singura informație falsă de
pe un card a cărui valoare e tocmai credibilitatea. `bifa=False` în `card.py` o scoate. Decizia
e a ta, dar spune-mi-o.

### 4. FAȚA ȘI VOCEA, set fix

Structura JB Copeland: set fix, haine schimbate între clipuri, 17–25 s, puțin vorbit, text
serif peste. Lanțul tehnic e gata: `video.py` (retuș + gradare + caption, ~12 min pentru un
clip de 60 s). ⚠️ Nu există subtitrare sincronizată — caption static. Dacă vrei subtitrări pe
cuvânt, îmi trebuie whisper instalat; spune-mi și îl pun.

### 5. MACHETELE DE CITATE — ultimul

Construiesc **gust**, nu autoritate ([[vandy-carduri-incredere]]). Nu se monetizează pe
Instagram. Bune ca umplutură în zilele fără clip, nu ca bază.

---

## 4. Fabrica: din ziua de filmare ies 20 de clipuri

Asta e partea care face planul sustenabil cu timpul pe care îl ai.

Când înregistrezi mini-cursul ([[mini-curs.md]]), filmezi **în aceeași zi, același set**:

| ce | câte | de unde |
|---|---|---|
| mini-cursul întreg | 1 | pe bucăți, cu pauze între părți |
| **clipuri tăiate din el** | **12–15** | fiecare idee care stă singură în 20 de secunde |
| cârlige filmate separat | 5–8 | aceeași propoziție spusă în 5 feluri, pentru A/B |
| cadre de ecran | 10+ | capturi din partea de construit, pentru artefacte |

O zi de filmare = **o lună de postat**. Fără ea, planul cere să te filmezi zilnic, și n-o vei
face — exact motivul pentru care ai renunțat la sesiunea live.

Ce NU se taie direct: partea 8, oferta. Aia e doar pentru pagină.

---

## 5. Săptămâna

| | TikTok | IG Reels | IG Stories | X |
|---|---|---|---|---|
| **Luni** | artefact | același clip | 2–3 cadre | postare originală |
| **Marți** | știre economică | același clip | 2–3 cadre | postare originală |
| **Miercuri** | față/voce | același clip | 2–3 cadre + sondaj | postare originală |
| **Joi** | artefact | același clip | 2–3 cadre | postare originală |
| **Vineri** | știre economică | același clip | 2–3 cadre | postare originală |
| **Sâmbătă** | card (imagine) | card | 1–2 cadre | card ca imagine |
| **Duminică** | — | — | 1 cadru | — |

Plus, în fiecare zi lucrătoare: **20–30 de minute de reply-uri pe X** cu oameni cu care te
urmărești reciproc. E singura activitate din tot planul cu multiplicator 15× dovedit în cod.

**5 clipuri + 1 card + 5 postări pe X pe săptămână.** Dacă o săptămână nu iese, taie sâmbăta
întâi, nu clipurile.

### Unde pui linkul

| platformă | unde |
|---|---|
| TikTok | link în bio → `vandy.ro/mentorat` |
| Instagram | link în bio + **link în Stories** (singurul nativ) |
| X | în postare, direct. Nu e penalizat (`OpenLinkWeight +0,2`) |

**Un singur link, peste tot, de la prima zi.** Nu schimba destinația între platforme — nu vei
putea să-ți dai seama ce funcționează.

---

## 6. Primele 14 zile — începem din ce există deja

Nu de la zero. Ai inventar nepostat:

- **7 postări finale 1080×1920** în `~/vandy_quotes/2026-09-23/` — gata, nepostate
- **11 carduri** în `~/vandy_quotes/2026-10-10-carduri/` (5 singulare + carusel de 6) —
  **neaprobate**, așteaptă verdictul tău pe texte
- **107 citate românești cu sursă primară**, verificate
- `card.py`, `machete.py`, `video.py`, `look.py`, `retus.py` — toate funcționale
- publicare prin upload-post, profil `vandy` (TikTok `@vandy.001`, Instagram `@vandy_o1`)

| zile | ce se întâmplă |
|---|---|
| **1–2** | Tu: aprobi sau rescrii textele celor 11 carduri. Eu: pun linkul în bio pe toate trei, pregătesc Highlights-urile. |
| **3–4** | **Ziua de filmare.** Mini-cursul + cele 20 de clipuri. Singura zi grea. |
| **5** | Eu: urc videoul, pun `VIDEO.url`, publicăm paginile. Funnelul e viu. |
| **6–14** | Postat zilnic după grila de mai sus. Cardurile aprobate umplu golurile cât montez clipurile. |

**Ziua 5 e prima zi în care un om poate intra în funnel.** Tot ce e înainte e pregătire.

---

## 7. Ce măsori, și ce ignori

**Măsori, săptămânal, într-un singur tabel:**

| cifră | de unde |
|---|---|
| vizualizări pe clip | platformă |
| **click-uri pe link** | bio-link / UTM |
| **vizitatori pe `/mentorat`** | analytics |
| **înscrieri** | Resend |
| **câți au deschis videoul** | pixel `ViewContent` |
| **câți au ajuns la final** | deblocările |
| **rezervări 99 €** | procesator |

**Ignori:** like-urile (0,5 pondere pe X, nimic altundeva), numărul de urmăritori ca țintă în
sine, și orice clip care face cifre fără să miște linia de înscrieri. **Vizualizările nu sunt
produsul.**

Regula de decizie: după 20 de clipuri, te uiți care **format** a adus înscrieri, nu care clip a
adus vizualizări. Și faci mai mult din ăla.

---

## 8. Liniile roșii — ale tale, și ale legii

- *„Fără AI care te arată pe tine în situații reale false. AI-ul doar pentru fundaluri și artă."*
- *„Fără conținut de câștig rapid."* ⚠️ Tensiune reală cu titlul de pe formular. Pe pagină ai
  decis și e treaba ta; **în conținutul organic ține-te de regulă** — acolo nu ai nici
  disclaimer, nici context, iar un clip cu „200 $ pe zi" trăiește pentru totdeauna.
- **Pilonii nu apar niciodată pe conținut.** Sunt structură internă.
- **Tot în română.**
- Claritate maximă: rezoluție nativă, JPEG `subsampling=0` q95–97, text la 2× apoi LANCZOS,
  video crf ≤ 20 preset medium/slow.
- **Nimic care sună a sfat de investiții.** ESMA, în română, textual: *„Încercările de
  declinare a responsabilității, cum ar fi «Aceasta nu este consultanță de investiții», nu vă
  vor proteja în aceste cazuri."* Disclaimerul nu te acoperă. Nu da sfaturi, arată ce ai făcut.

---

## 9. Ce-mi trebuie de la tine

1. **Aprobarea pe cele 11 carduri** — texte, unul câte unul. Blocant pentru zilele 1–2.
2. **Ziua de filmare** — pune-o în calendar. Totul așteaptă după ea.
3. **Bifa albastră de pe carduri**: o scot, sau ești verificat pe X?
4. **Numărul de urmăritori pe Instagram și pe X** — nu le am, și fără ele nu pot alege
   categoria corectă din benchmark-uri, nici să-ți spun ce e normal.
5. **Un caz real cu factură** — stă sub tot formatul „artefact".
6. **Vrei subtitrări sincronizate?** Dacă da, instalez whisper. Acum caption-ul e static.

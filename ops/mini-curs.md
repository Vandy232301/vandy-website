# Mini-cursul — ce înregistrezi, în ce ordine, cu ce setări

Owner, 2026-11-02: *„eu doar sa creez mini cursul si apoi sa il punem sus pe site ca sa dam
drumul."* Documentul ăsta e tot ce-ți trebuie ca să-l faci într-o singură zi.

> **Ideea care schimbă economia întregii treburi:** ziua în care înregistrezi mini-cursul e și
> ziua în care îți produci conținutul organic pe o lună. Același set, aceeași lumină, aceeași
> cămașă. Din 25 de minute de vorbit ies 15–20 de clipuri scurte. Dacă filmezi mini-cursul fără
> să tai și short-form din el, ai plătit o zi și ai luat un singur lucru.
> Cum se taie: [plan-organic.md](plan-organic.md), partea 4.

---

## 1. Ce promite, exact

Titlul de pe formular, al tău: *„Învață 100% gratuit cum poți face 200–300 $ pe zi creând
website-uri performante pentru clienți din țară sau chiar din toată lumea."*

Deci videoul trebuie să livreze **procesul**, nu o prezentare a masterclass-ului. Dacă omul se
uită 25 de minute și pleacă fără să fi învățat nimic utilizabil, ai pierdut și vânzarea, și
reputația. Regula: **dacă nu cumpără nimic, tot trebuie să poată face primul pas singur.**

Asta nu-ți taie din vânzare, ți-o face. Cine aplică și se blochează vine la masterclass tocmai
pentru că a încercat.

---

## 2. Structura, pe minute

Durata țintă: **25–30 de minute**. Sub 20 nu susține o ofertă de 990 €. Peste 35, abandonul
crește fără să adaugi argument.

| # | parte | minute | ce faci |
|---|---|---|---|
| 1 | **Cârligul** | 0:00–1:30 | Arăți un site real pe ecran și spui cât a plătit clientul și în cât timp l-ai făcut. Nimic altceva. Fără intro, fără „salut, numele meu e". |
| 2 | **Cine ești** | 1:30–3:00 | Cei 16 ani, aplicațiile live, tipurile de clienți. Scurt. Nu CV — dovada că ai dreptul să vorbești. |
| 3 | **De ce nu merge ce încearcă toți** | 3:00–7:00 | Tab-ul deschis. Demo-ul care impresionează și nu se vinde. De ce „învață AI" nu e o meserie. Aici omul trebuie să se recunoască. |
| 4 | **Pasul 1 — traduci cererea** | 7:00–12:00 | Caietul de sarcini. **Arăți pe ecran** un prompt real al tău, prost și apoi bun, cu ce iese din fiecare. |
| 5 | **Pasul 2 — construiești de livrat** | 12:00–18:00 | Diferența dintre demo și produs: domeniu, viteză, formular care chiar trimite, ce verifici înainte să predai. **Arăți ecranul.** |
| 6 | **Pasul 3 — găsești și ceri bani** | 18:00–23:00 | Unde sunt firmele, primul mesaj (îl scrii pe ecran, în fața lor), cum se formează prețul, cum îl spui fără să te scuzi. |
| 7 | **Ce nu poți face singur** | 23:00–25:00 | Cinstit: ce din toate astea se învață din video și ce are nevoie de cineva care se uită peste umărul tău. Aici se naște oferta, din lipsă reală, nu din presiune. |
| 8 | **Oferta** | 25:00–28:00 | Masterclass-ul, ce pleci cu, cele zece locuri, rezervarea de 99 € care se scade din total, cele 48 de ore. |
| 9 | **Ce faci acum** | 28:00–29:00 | O singură instrucțiune: butonul de sub video. |

⚠️ **Partea 8 trebuie să fie ultima parte vorbită.** Oferta de pe pagină se deblochează la
finalul videoului (`ended`), deci dacă spui oferta la minutul 20 și mai vorbești 9 minute, omul
decis stă degeaba. Dacă vrei oferta mai devreme, pune secunda în
`VIDEO.dezvaluieLaSecunda` din `src/data/prezentare.ts` și apare acolo.

---

## 3. Patru reguli de conținut, care decid dacă funcționează

**Arată ecranul, nu fața, în părțile 4–6.** Fața ta e pentru 1, 2, 3, 7, 8, 9. Partea de
predare trebuie să fie ecran: cod, prompt, site, mesaj scris. Un om care se uită la o față
vorbind despre caiet de sarcini nu învață nimic și pleacă.

**Un singur caz real, de la cap la coadă.** Nu trei exemple pe jumătate. Alegi o firmă, un
proiect, și îl urmărești prin toate cele trei părți. Omul trebuie să vadă un lucru întreg, nu
cinci bucăți.

**Spune cifrele ca prețuri încasate, nu ca venituri promise.** „Clientul a plătit 1.500 €" e
fapt. „Poți face 1.500 € pe săptămână" e afirmație comercială reglementată, și pe video e
înregistrată pentru totdeauna. Fraza sigură: *„Atât am facturat eu pentru asta. Cât faci tu
depinde de câți clienți găsești și cât de repede lucrezi."*

**Rămâi meșterul, nu posesorul.** Fără mașină, fără ceas, fără „uite ce viață am". Cercetarea
ta proprie ([[vandy-asimetria-nu-averea]]) spune că ostilitatea nu vine din avere, ci din
poziția față de privitor. Ecranul cu lucrul tău te pune în poziția protejată. Orice cadru cu
ce-ți permiți te mută în cea atacată.

---

## 4. Setări tehnice

**Imagine.** 1920×1080, 25 sau 30 fps, fix. Nu vertical — videoul stă pe o pagină, iar
capturile de ecran au nevoie de lățime.

**Export.** libx264, `crf 18`, preset `slow`, audio AAC 192 kbps. (Regula de claritate din
CLAUDE.md cere crf ≤ 20 și preset medium/slow — aici mergem pe 18, fiindcă jumătate din video e
text pe ecran, iar textul e primul care se face terci la compresie.)

**Captura de ecran.** Înregistrează la rezoluția nativă a monitorului și mărește fontul în
editor/browser **înainte** de filmare, nu la montaj. Text micșorat la export e text ilizibil pe
telefon — și jumătate din oameni se uită pe telefon.

**Sunet.** Microfon aproape, cameră cu draperii sau covor. Sunetul prost închide un video mai
repede decât imaginea proastă.

**Fundalul contează mai mult decât crezi** ([[vandy-pilon-construiesc-business]]): fundalul te
trădează. Un perete curat cu o singură sursă de lumină bate orice birou aglomerat.

**Îmbrăcat la fel toată ziua.** Dacă tai short-form din aceeași înregistrare, continuitatea e
singurul lucru care face ca 20 de clipuri să arate ca o serie, nu ca un morman.

---

## 5. Unde se încarcă, și de ce nu pe YouTube

**Vimeo.** Nu e o preferință — e singura variantă care face ce ai cerut: fără bară de progres,
fără durată vizibilă, fără derulare. YouTube nu poate: `controls=0` ascunde bara, dar durata
apare la hover și săgețile de la tastatură derulează oricum.

Pașii:
1. Urci videoul pe Vimeo (plan plătit, pentru `controls=0`).
2. Setezi vizibilitatea pe **Unlisted** sau **Hide from Vimeo**, și la „Where can this be
   embedded" pui **doar `vandy.ro`**. Altfel linkul circulă și cele 48 de ore devin o minciună.
3. Îmi dai linkul, îl pun în `VIDEO.url`. Restul se configurează singur.

Alternativă mai ieftină la volum: **Bunny Stream**. Merge, dar nu poate bloca derularea — cu ea
oferta se dezvăluie pe ceas, nu pe vizionare reală. E scris în cod, în `src/data/prezentare.ts`.

---

## 6. Ce-mi trebuie de la tine ca să pornim

| # | lucru | de ce |
|---|---|---|
| 1 | **videoul pe Vimeo** + linkul | fără el nu există funnel |
| 2 | **un caz real cu factură** | stă și cârligul videoului, și reclamele, și al doilea email |
| 3 | **linkul de plată** (Stripe), cu expirare | altfel cele 48 de ore sunt decor |
| 4 | **ce e bonusul** din ofertă | al doilea bonus nedefinit; cât e gol, pagina nu-l pretinde |
| 5 | **datele firmei** pentru subsol | `FIRMA` e încă `null` |
| 6 | 2–3 **capturi din video** | pentru postări și pentru cardul de share |

Punctele 1 și 3 sunt blocante. Restul se pot adăuga după ce dăm drumul.

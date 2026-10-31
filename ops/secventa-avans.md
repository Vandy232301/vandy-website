# Secvența pentru cine s-a înscris și n-a plătit avansul

Scrisă 31.10.2026, la cererea owner-ului: *„vreau sa avem si o secventa de
mailuri pentru cei care nu au platit etc."*

Ținta: omul care a lăsat datele pe `/mentorat`, a ajuns pe `/prezentare`, și
**nu** a plătit avansul în fereastra de 48 de ore.

---

## ⚠️ Ce trebuie să existe ca secvența să poată porni

Secvența se adresează celor care **nu au plătit**. Ca s-o poți trimite, sistemul
trebuie să știe **cine a plătit** — altfel îi scrii „mai ai 8 ore" exact omului
care tocmai ți-a dat 290 €, și l-ai pierdut.

Lipsesc trei lucruri, în ordinea în care trebuie rezolvate:

1. **Procesator de plată** cu link de avans (`PLATA.url` în
   `src/data/prezentare.ts` e `null`). Linkul trebuie să **expire** și la
   procesator, nu doar să dispară butonul — vezi regula 4 din
   `src/lib/fereastraOferta.ts`.
2. **Webhook de plată** → marchează contactul în Resend (de ex. proprietate
   `a_platit = true`, sau mutare într-o audiență „plătitori"). Fără webhook nu
   există segment, deci nu există secvență automată — doar una trimisă manual,
   cu riscul de mai sus.
3. **Momentul de start.** Ceasul de 48 de ore pornește la prima vizită pe
   `/prezentare`, în `localStorage`-ul omului. Serverul nu îl știe. Cea mai
   simplă aliniere: pornește secvența de la **momentul înscrierii**, și
   formulează emailul 3 ca „fereastra ta se închide azi", nu cu ora exactă.
   Altfel ceasul din email și cel din pagină se contrazic.

Până atunci, emailurile de mai jos sunt scrise și pot fi trimise manual.

---

## Ritmul

| # | când | rol |
|---|---|---|
| 0 | imediat | confirmarea — **există deja**, în `api/aplica-mentorat.js` |
| 1 | +1 oră | l-a deschis? un singur link |
| 2 | +20 ore | valoare, nu presiune — îi dai un lucru util din video |
| 3 | +40 ore | termenul se închide azi |
| 4 | +50 ore | s-a închis, cinstit, fără redeschidere |
| 5 | +5 zile | obiecția reală, și apelul ca ieșire |

**Regula care ține toată secvența cinstită:** masterclass-ul nu dispare și
prețul nu se schimbă. Ce expiră e **condiția de avans**. Dacă vreun email de
mai jos sugerează altceva, l-ai rescris greșit. Vezi `src/lib/fereastraOferta.ts`.

---

## 1 · +1 oră

**Subiect:** Ai apucat să o deschizi?
**Preheader:** E linkul tău, rămâne al tău.

> Salut, {{prenume}}.
>
> Ți-am trimis acum o oră prezentarea și văd că e genul de link care se pierde
> în inbox. Ăsta e singurul lucru din emailul ăsta:
>
> **[Deschide prezentarea]**
>
> Durează cât un episod de serial. La final știi exact ce construiești la
> masterclass, cum ajunge la clienți și cum se plătește.
>
> Vandy

## 2 · +20 ore

**Subiect:** Partea pe care o sare toată lumea
**Preheader:** Nu construitul e greu.

> {{prenume}},
>
> Dacă ai văzut prezentarea, știi deja care e partea grea. Dacă n-ai văzut-o,
> îți spun aici, pe scurt, fiindcă e lucrul care face diferența:
>
> **Să construiești poate oricine, acum. Greul e să știi cui îi vinzi.**
>
> De-aia la masterclass nu pleci doar cu lucrul construit. Pleci cu oferta
> scrisă, cu zece nume reale de oameni sau firme care au problema pe care o
> rezolvi, cu primul mesaj de contact scris în sală, și cu prețul.
>
> Partea asta e jumătate din zi. Restul prezentării o explică în detaliu:
>
> **[Vezi prezentarea]**
>
> Vandy

## 3 · +40 ore

**Subiect:** Fereastra ta de avans se închide azi
**Preheader:** Locul rămâne, condiția nu.

> {{prenume}},
>
> Scurt, fiindcă e o chestiune de ore: posibilitatea de a-ți ține locul cu
> avans de {{avans}} € se închide azi.
>
> Ca să fie clar ce se întâmplă și ce nu:
>
> - Masterclass-ul **nu** dispare, iar prețul **nu** se schimbă.
> - Ce expiră e **avansul** — după termen, locul se ia plătind integral, dacă
>   mai e liber.
> - Sunt {{locuri}} locuri libere din zece.
>
> **[Îmi țin locul cu avans]**
>
> Dacă nu ești sigur, nu plăti. Așteaptă apelul și decizi atunci — chiar e în
> regulă.
>
> Vandy

## 4 · +50 ore

**Subiect:** S-a închis. Ce rămâne.
**Preheader:** Fără redeschideri, fără prelungiri.

> {{prenume}},
>
> Fereastra de avans s-a închis. Nu o redeschid și nu o prelungesc — dacă aș
> face-o, tot ce ți-am scris până acum ar fi fost decor.
>
> Ce rămâne neschimbat: masterclass-ul, prețul, și locul, dacă mai e liber.
> Diferența e că acum se ia plătind integral.
>
> Și rămâne apelul, care oricum nu te costă nimic: douăzeci de minute, te
> întrebăm ce vrei să construiești, îți spunem cinstit dacă se poate într-o zi.
> Dacă nu ne potrivim, ți-o spunem atunci.
>
> Echipa te caută oricum. Dacă vrei mai repede, răspunde la emailul ăsta.
>
> Vandy

## 5 · +5 zile

**Subiect:** Întrebarea pe care mi-o pun toți
**Preheader:** „Și dacă nu mă descurc?"

> {{prenume}},
>
> Întrebarea care vine cel mai des, în diverse forme: *și dacă vin și nu mă
> descurc?*
>
> Răspunsul cinstit: de-aia suntem zece, nu o sută. Într-o zi cu zece oameni
> apuc să mă uit pe ecranul fiecăruia. Nu pleci cu notițe și cu speranța că te
> prinzi acasă — pleci cu lucrul tău, construit și publicat, pentru că l-am
> făcut împreună în sală.
>
> Ce **nu** îți promit: un venit. Nu garantez, și nu crede pe nimeni care o
> face. Ce îți promit e ce pleci cu — și aia se vede la finalul zilei.
>
> Dacă vrei să vorbim, răspunde aici cu un cuvânt și te caut.
>
> **[Recitesc ce pleci cu]**
>
> Vandy

---

## Variabile

| variabilă | de unde |
|---|---|
| `{{prenume}}` | primul cuvânt din numele din formular |
| `{{avans}}` | `AVANS` din `src/data/prezentare.ts` (acum **290**, de confirmat) |
| `{{locuri}}` | `OFERTA.locuriTotal - OFERTA.locuriLuate` din `src/data/mentorat.ts` |

Fiecare email are nevoie de link de dezabonare — obligatoriu legal și cerut de
Resend. Secvența se oprește imediat ce contactul e marcat ca plătitor.

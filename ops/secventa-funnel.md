# Secvența de emailuri — de la reclamă la masterclass

Funnelul e: reclamă → `/gratuit` (înscriere) → **sesiune live gratuită** → `/prezentare`
(înregistrare + ofertă) → masterclass. Decizia de a trece de la VSL înregistrat la sesiune
live e a owner-ului, 2026-11-02. Harta întreagă: `ops/funnel.md`.

Emailurile de vânzare propriu-zise (după ce omul a văzut oferta) sunt în
**`ops/secventa-avans.md`** — cele cinci, la +1h, +20h, +40h, +50h și +5 zile. Documentul
de față acoperă tot restul, adică patru brațe cu patru meserii diferite.

> **Variabile folosite peste tot**
> `{{prenume}}` · `{{data_sesiune}}` (ex. „joi, 20 noiembrie, ora 19:00") ·
> `{{link_intrare}}` · `{{link_inregistrare}}` · `{{link_oferta}}`
>
> Expeditor: `VANDY <noreply@vandy.ro>`. Subsolul legal de la finalul fișierului intră în
> **toate**.

---

## ⚠️ Ce blochează segmentarea (citește înainte de a programa orice)

Trei brațe din patru au nevoie să știe ceva ce acum nu se știe:

| ca să trimiți… | trebuie să știi… | cum afli | stare |
|---|---|---|---|
| brațul 2 (a participat) | cine a intrat în sesiune | export de participanți din Zoom → import în Resend | **manual, de făcut după sesiune** |
| brațul 3 (n-a participat) | aceeași listă, inversată | idem | **manual** |
| `secventa-avans.md` | cine a plătit avansul | webhook de la procesator care marchează contactul | ⛔ **nu există procesator** |
| brațul 4 (listă de așteptare) | când s-au ocupat locurile | `OFERTA.locuriLuate` ajunge la 10 | manual |

Fără webhook, emailul „ți-au mai rămas 8 ore" ajunge la cineva care a plătit acum o oră.
Ăsta e cel mai urât bug din tot funnelul fiindcă nu se vede la testare — se vede abia când
un om care tocmai ți-a dat 290 € primește o somație. **Nu porni brațul de vânzare fără el.**

Pentru prima serie, exportul manual din Zoom după sesiune e acceptabil: sunt câteva sute de
oameni și o faci o dată. Plata nu e: aia trebuie automată de la primul leu încasat.

---

## Brațul 1 — de la înscriere la sesiune

**Meseria lui: PREZENȚA.** Nu vânzarea. La un eveniment live gratuit, cea mai mare pierdere
nu e la înscriere, e între înscriere și ziua sesiunii — oamenii se înscriu și uită. Fiecare
email de aici există ca să mute prezența în sus, nimic altceva.

⛔ **Niciun email din brațul ăsta nu vinde masterclass-ul.** Omul s-a înscris la un lucru
gratuit; dacă primul lucru care vine e o ofertă de 990 €, învață că „gratuit" era un
pretext, și nu mai vine nici la sesiune.

### E0 — instant · „Ești pe listă"

**Deja construit**, în `api/inscriere-gratuit.js`. Livrează și atât: confirmarea, data
dacă e stabilită, butonul către `/prezentare`. Fără pitch, fără PS.

### E1 — +1 zi · Subiect: *Greșeala care te lasă cu un tab deschis*

> {{prenume}},
>
> Înainte de sesiune, un lucru care o să te ajute să înțelegi restul.
>
> Aproape toată lumea care „învață AI" face același drum: deschide ChatGPT, cere ceva,
> primește ceva aproape bun. Și acolo se oprește. Rămâne cu un tab deschis, nu cu un
> proces.
>
> Diferența nu e în unealtă. Toți avem aceleași unelte. Diferența e că un demo impresionează
> pe cine îl vede, iar un produs e ceva pentru care cineva scoate bani. Între ele e o
> distanță pe care n-o trece aproape nimeni, și nu pentru că e grea tehnic.
>
> E grea pentru că nimeni nu-ți spune ce lipsește. Asta îți arăt live.
>
> VANDY

*Fără link de vânzare. La final, doar: „Sesiunea e {{data_sesiune}}. Dacă n-ai pus-o în
calendar, [o pui de aici]({{link_calendar}})."*

### E2 — +2 zile · Subiect: *Două zile de lucru, 1.500 €*

> {{prenume}},
>
> Îți arăt un lucru concret, ca să nu vorbim în general.
>
> [aici: un site real, ce a cerut clientul, ce i-ai livrat, în cât timp, cât a plătit]
>
> Nu e cel mai spectaculos lucru pe care l-am construit. L-am ales pentru că e cel mai
> banal: o firmă obișnuită, o nevoie obișnuită, un preț pe care îl plătesc sute de firme din
> România în fiecare lună fără să stea pe gânduri.
>
> Partea interesantă nu e site-ul. E că firma aia căuta pe cineva de trei luni și nu găsea.
>
> Despre asta e sesiunea.
>
> VANDY

⚠️ **Emailul ăsta are nevoie de un caz real cu factură.** Dacă nu există, nu-l trimite —
scrie altul. Un exemplu inventat aici strică exact lucrul pe care îl construiește.

### E3 — cu 24 de ore înainte · Subiect: *Mâine, {{data_sesiune}}*

Scurt. Data, ora, linkul, cât durează. Și o propoziție: *„Vino cu un caz concret al tău — o
firmă pe care o cunoști, ceva ce ai vrea să vinzi. Dacă îl pui în întrebări, lucrez pe el."*

### E4 — cu o oră înainte · Subiect: *Într-o oră*

Trei rânduri. Linkul, mare. Nimic de citit.

### E5 — la start · Subiect: *Suntem live. Intră.*

Un rând și butonul. Trimis la minutul 0.

> **De ce patru mementouri și nu unul.** Par multe. Nu sunt: la evenimente live, între 50%
> și 70% dintre înscriși nu ajung, iar aproape toți sunt oameni care chiar voiau să vină.
> Mementoul nu-i convinge, le amintește. Dacă ți se pare agresiv, taie E4, nu E5.

---

## Brațul 2 — a participat

Se declanșează după sesiune, pentru cine a fost în sală. **Aici începe vânzarea**, și e
primul moment în care are voie să înceapă: omul a primit ce i-ai promis.

### E6 — +1 oră după sesiune · Subiect: *Înregistrarea, și ce urmează*

> {{prenume}},
>
> Mulțumesc că ai stat. Înregistrarea e aici, întreagă: {{link_inregistrare}}
>
> Ce ai văzut azi e metoda. E completă și o poți aplica singur — chiar poți, și unii o s-o
> facă.
>
> Ce n-am putut face în 90 de minute e să mă uit pe lucrul tău. Despre asta e MASTERCLASS
> ATELIER AI: o zi întreagă, zece oameni, și pleci cu lucrul tău construit și publicat, nu
> cu notițe. La mijlocul zilei mă uit pe ecranul fiecăruia și repar pe loc. De asta sunt
> zece locuri și nu o sută.
>
> Detaliile și condițiile: {{link_oferta}}
>
> VANDY

*Emailul ăsta pornește fereastra de 48 de ore. De aici încolo preia `secventa-avans.md`.*

---

## Brațul 3 — s-a înscris și n-a venit

Meserie complet diferită: **nu vinzi, îl duci la înregistrare.** Omul ăsta nu te-a refuzat,
a avut altceva de făcut. Tratat ca un refuz, se pierde definitiv.

### E7 — +2 ore · Subiect: *N-ai ajuns — uite înregistrarea*

> {{prenume}},
>
> Te-am căutat în listă și nu te-am găsit. Se întâmplă.
>
> Înregistrarea e aici, întreagă, fără condiții: {{link_inregistrare}}
>
> VANDY

Atât. Fără reproș, fără ofertă.

### E8 — +1 zi · Subiect: *Partea de la minutul [X]*

Numești **un lucru concret** din sesiune și spui la ce minut e. Un om care n-a deschis o
înregistrare de 90 de minute o deschide pentru 4 minute dintr-un punct anume.

### E9 — +3 zile · Subiect: *Închid înregistrarea [zi]*

⚠️ **Doar dacă e adevărat.** Dacă n-o închizi, nu scrie asta — un termen limită care trece
fără să se întâmple nimic te învață publicul că nu te cred data viitoare. Dacă o închizi,
închide-o.

*Cine deschide înregistrarea din brațul ăsta trece în brațul 2.*

---

## Brațul 4 — locurile s-au terminat

Se declanșează când `OFERTA.locuriLuate` ajunge la 10. **Nu-i hărțui cu o ofertă care nu mai
există** — e cel mai rapid mod de a pierde o listă pentru care ai plătit.

### E10 — Subiect: *S-au ocupat. Ce urmează.*

> {{prenume}},
>
> Cele zece locuri din Seria 1 s-au ocupat.
>
> Nu-ți vând nimic cu emailul ăsta. Îți spun doar că Seria 2 e în [lună] și că ești primul
> pe listă dacă vrei — răspunde cu „da" și te trec.
>
> Până atunci [ceva real: înregistrarea rămâne, un lucru pe care îl trimiți, o sesiune de
> întrebări].
>
> VANDY

⚠️ **Depinde de o decizie care nu e luată: există Seria 2?** Vezi `ops/funnel.md` §6. Dacă
nu există, brațul ăsta n-are ce promite și trebuie rescris cinstit.

---

## Subsolul legal — în toate emailurile

> Primești acest email pentru că te-ai înscris la sesiunea live gratuită pe vandy.ro.
> [Dezabonare]({{unsubscribe}}).
>
> Rezultatele depind de munca, priceperea, piața și timpul fiecăruia, iar unii nu obțin
> niciun venit. Cifrele menționate sunt prețuri încasate pentru lucrări proprii sau
> obiective, nu venituri promise sau garantate. Nu este consultanță financiară sau de
> investiții.

Linkul de dezabonare nu e opțional: fără el, GDPR și regulile Resend sunt ambele încălcate,
iar rata de spam-report urcă — ceea ce îți strică livrabilitatea pentru toată lista.

---

## Ordinea în care le scrii, dacă n-ai timp de toate

1. **E3, E4, E5** (mementourile). Fără ele pierzi jumătate din oameni înainte să te audă.
2. **E6**. E singurul email care vinde ceva.
3. **E7**. Recuperează cel mai mare segment pierdut, cu trei rânduri.
4. Restul.

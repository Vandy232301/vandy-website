# Secvența de emailuri — de la înscriere la masterclass

Funnelul: conținut organic / reclame → **`/mentorat`** (landing complet, cu formularul care
poartă titlul mare) → **`/prezentare`** (mini-cursul video, 48 de ore) → ofertă cu rezervare de
99 € → pentru cine nu cumpără, **secvență educațională** cu vânzare ulterioară.

Owner, 2026-11-02: *„Pentru cei care nu cumpara sa urmeze o secventa educationala si valoaroasa
de email cu vanzare ulterioara."* Brațul C de mai jos e exact asta, și e cea mai importantă
parte a documentului — acolo stau 90% dintre oameni.

> **Variabile:** `{{prenume}}` · `{{link_video}}` (= `/prezentare`) · `{{ore_ramase}}` ·
> `{{link_plata}}`
> Expeditor: `VANDY <noreply@vandy.ro>`. Subsolul de la final intră în **toate**.

---

## ⚠️ Ce blochează segmentarea

| ca să trimiți… | trebuie să știi… | cum | stare |
|---|---|---|---|
| brațul B | cine a deschis videoul | pixel `ViewContent` → Resend | de legat |
| brațul B avansat | cine a ajuns la final | deblocarea → Resend | de legat |
| **oprirea vânzării** | **cine a plătit** | **webhook de la procesator** | ⛔ **nu există** |
| brațul D | când s-au ocupat locurile | `OFERTA.locuriLuate` = 10 | manual |

**Fără webhook de plată nu porni brațul B.** Emailul „ți-au mai rămas 8 ore" care ajunge la
cineva care tocmai a plătit 99 € e cel mai scump email din funnel — și nu se vede la testare.

---

## Brațul A — livrarea (primele 48 de ore)

Meseria lui: **omul să se uite la video.** Nu să cumpere. Dacă nu se uită, nu există vânzare.

### A0 — instant · „Ești înăuntru"
**Deja construit**, în `api/aplica-mentorat.js`. Linkul către video, plus un singur rând despre
cele 48 de ore. Fără pitch.

### A1 — +3 ore, DOAR dacă n-a deschis · Subiect: *N-ai deschis încă*
Două rânduri și linkul. Cel mai ieftin email din tot funnelul și cel care recuperează cel mai
mult: jumătate dintre oameni își lasă datele și pleacă la altceva în aceeași secundă.

### A2 — +24 ore, dacă n-a terminat · Subiect: *Mai ai 24 de ore*
> {{prenume}},
>
> Mâine pe vremea asta videoul se închide. Nu e un truc — îl țin deschis 48 de ore ca să-l
> vadă oameni care chiar vor, nu să fie salvat într-un tab pentru cândva.
>
> Dacă ai început și te-ai oprit, reia de unde ai rămas: {{link_video}}

### A3 — la −3 ore · Subiect: *Se închide în seara asta*
Un rând, linkul. Atât.

⚠️ **Toate trei afirmă că videoul se închide. Deci chiar trebuie să se închidă** — vezi regula
1 din `src/lib/fereastraOferta.ts`. Dacă rămâne accesibil pe alt link, toate emailurile astea
sunt minciuni, și una verificabilă.

---

## Brațul B — a văzut tot, n-a plătit

Fereastra de 48h curge. Cele cinci emailuri există deja în **`ops/secventa-avans.md`** (+1h,
+20h, +40h, +50h, +5 zile) — de actualizat doar cifra: **99 €, nu 290 €**, și formularea
„rezervare care se scade din total", nu „avans".

---

## Brațul C — secvența educațională ⭐

**Aici stau aproape toți.** Din zece oameni care văd videoul, unul cumpără acum. Ceilalți nouă
nu sunt pierduți — sunt oameni care n-au bani luna asta, care vor să vadă dacă ești real, sau
care au nevoie de trei săptămâni ca să se decidă. Secvența asta e pentru ei, și pe termen de
șase luni aduce mai mult decât fereastra de 48 de ore.

**Regula care o face să funcționeze: primele patru emailuri NU vând nimic.** Fiecare e un lucru
pe care îl poate folosi singur, azi. Vânzarea revine în al cincilea, și după aia o dată pe
lună, nu mai des.

| # | când | subiect | ce livrează |
|---|---|---|---|
| **C1** | +2 zile | *Caietul de sarcini pe care îl folosesc eu* | Șablonul real, de copiat. Nu o descriere a lui — șablonul. |
| **C2** | +5 zile | *Cum arată un site de 300 € față de unul de 3.000 €* | Două exemple, punct cu punct. Ce vede clientul și ce nu. |
| **C3** | +9 zile | *Zece tipuri de firme care au nevoie acum* | Lista, cu motivul pentru fiecare. Utilizabilă în aceeași zi. |
| **C4** | +14 zile | *Mesajul la care mi se răspunde* | Textul exact, plus de ce funcționează și ce să nu scrii. |
| **C5** | +18 zile | *Unde te blochezi, și ce fac eu cu asta* | Prima revenire la ofertă. Onest: ce se învață din emailuri și ce are nevoie de cineva care se uită peste umărul tău. |
| **C6+** | lunar | știri, cazuri, rezultate | Un lucru util + o linie despre seria următoare. |

**De ce funcționează:** fiecare email de valoare pe care îl trimiți fără să ceri nimic ridică
probabilitatea ca al cincilea să fie citit. Invers — cinci emailuri de vânzare la rând — îți
antrenează lista să nu te mai deschidă, și o pierzi definitiv pentru câteva sute de euro.

**De unde vine materialul:** din mini-curs. Fiecare parte a videoului ([[mini-curs.md]] §2)
devine un email. Nu scrii conținut nou — îl rescrii.

---

## Brațul D — locurile s-au terminat

Se declanșează la `OFERTA.locuriLuate` = 10. **Nu-i hărțui cu o ofertă care nu există.** Un
email: s-au ocupat, Seria 2 e în [lună], ești primul pe listă dacă răspunzi cu „da".

⚠️ Depinde de o decizie încă neluată: **există Seria 2?** Vezi `ops/funnel.md` §6.

---

## Subsolul — în toate emailurile

> Primești acest email pentru că ți-ai lăsat datele pe vandy.ro. [Dezabonare]({{unsubscribe}}).
>
> Rezultatele depind de munca, priceperea, piața și timpul fiecăruia, iar unii nu obțin niciun
> venit. Cifrele menționate sunt prețuri încasate pentru lucrări proprii, nu venituri promise
> sau garantate. Nu este consultanță financiară sau de investiții.

Linkul de dezabonare nu e opțional: fără el încalci și GDPR, și regulile Resend, iar rata de
spam-report urcă — ceea ce îți strică livrabilitatea pentru toată lista.

---

## Ordinea în care le scrii, dacă n-ai timp de toate

1. **A1** — două rânduri, recuperează cel mai mult.
2. **B** — există deja, doar schimbi 290 în 99.
3. **C1–C4** — nu vând nimic și sunt cele care țin lista vie.
4. Restul.

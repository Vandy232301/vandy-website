const DYNASTY_URL = 'https://dynasty.vandy.ro/';
const WHOP_URL = 'https://whop.com/dynasty001/dynasty-trades-premium-99/';
const TELEGRAM_URL = 'https://t.me/VANDY_001_Official';

// Helpers pentru email - folosite inline in continut
const S = {
  h1: 'color:#ffffff;font-size:24px;font-weight:700;line-height:1.35;margin:0 0 16px;font-family:Arial,sans-serif',
  h2: 'color:#ffffff;font-size:19px;font-weight:700;line-height:1.35;margin:0 0 12px;font-family:Arial,sans-serif',
  h3: 'color:#ffffff;font-size:16px;font-weight:700;line-height:1.35;margin:0 0 8px;font-family:Arial,sans-serif',
  p:  'color:#a3a3a3;font-size:15px;line-height:1.7;margin:0 0 14px;font-family:Arial,sans-serif',
  pW: 'color:#ffffff;font-size:15px;line-height:1.7;margin:0 0 14px;font-family:Arial,sans-serif',
  green: 'color:#34d399',
  gold:  'color:#fbbf24',
  bold:  'color:#ffffff;font-weight:700',
  pill: 'display:inline-block;background:#111111;border:1px solid #333333;border-radius:50px;padding:5px 14px;font-size:11px;font-weight:700;color:#34d399;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;font-family:Arial,sans-serif',
  pillGold: 'display:inline-block;background:#1a1500;border:1px solid #4d3800;border-radius:50px;padding:5px 14px;font-size:11px;font-weight:700;color:#fbbf24;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;font-family:Arial,sans-serif',
};

function card(content, extraStyle = '') {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;border-radius:14px;overflow:hidden;${extraStyle}"><tr><td bgcolor="#111111" style="background-color:#111111;border:1px solid #222222;border-radius:14px;padding:22px;font-family:Arial,sans-serif">${content}</td></tr></table>`;
}

function cardGreen(content) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0"><tr><td bgcolor="#050f09" style="background-color:#050f09;border:1px solid rgba(52,211,153,0.25);border-radius:14px;padding:22px;font-family:Arial,sans-serif">${content}</td></tr></table>`;
}

function quote(text, author, color = '#34d399') {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0"><tr><td style="border-left:3px solid ${color};padding:14px 18px;background-color:#0a0a0a;font-family:Arial,sans-serif"><p style="margin:0 0 8px;font-style:italic;color:#d4d4d4;font-size:15px;line-height:1.65;font-family:Arial,sans-serif">${text}</p><span style="color:${color};font-size:13px;font-weight:700;font-family:Arial,sans-serif">${author}</span></td></tr></table>`;
}

function step(num, title, body, numColor = '#34d399') {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0"><tr><td width="44" valign="top" style="padding-right:14px"><div style="width:36px;height:36px;border-radius:50%;border:2px solid ${numColor};text-align:center;line-height:32px;font-weight:800;font-size:14px;color:${numColor};background-color:#111111;font-family:Arial,sans-serif">${num}</div></td><td valign="top"><p style="margin:0 0 4px;color:#ffffff;font-size:15px;font-weight:700;font-family:Arial,sans-serif">${title}</p><p style="margin:0;color:#a3a3a3;font-size:14px;line-height:1.6;font-family:Arial,sans-serif">${body}</p></td></tr></table>`;
}

function divider() {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0"><tr><td style="height:1px;background-color:#333333;font-size:1px;line-height:1px">&nbsp;</td></tr></table>`;
}

function ctaBtn(text, url) {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:8px auto"><tr><td align="center" bgcolor="#ffffff" style="background-color:#ffffff;border-radius:50px;padding:0"><a href="${url}" style="display:inline-block;background-color:#ffffff;color:#000000;font-size:15px;font-weight:800;padding:15px 40px;border-radius:50px;text-decoration:none;letter-spacing:0.3px;font-family:Arial,sans-serif">${text}</a></td></tr></table>`;
}

function ulItems(items) {
  return items.map(i => `<p style="margin:0 0 8px;color:#a3a3a3;font-size:15px;line-height:1.6;font-family:Arial,sans-serif"><span style="color:#34d399;font-weight:700;margin-right:8px">&#x2192;</span>${i}</p>`).join('');
}

function baseTemplate(content, preheader) {
  return `<!DOCTYPE html>
<html lang="ro" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>VANDY</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#000000;line-height:1px">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000;margin:0;padding:0">
  <tr>
    <td align="center" bgcolor="#000000" style="background-color:#000000;padding:32px 16px">
      <!-- Content table -->
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%">
        <tr>
          <td bgcolor="#000000" style="background-color:#000000;padding:0">

            <!-- Logo -->
            <a href="https://vandy.ro" style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:3px;text-decoration:none;font-family:Arial,sans-serif">VANDY</a>

            ${divider()}

            <!-- Content -->
            ${content}

            ${divider()}

            <!-- Footer -->
            <p style="text-align:center;color:#525252;font-size:12px;line-height:1.6;margin:0 0 6px;font-family:Arial,sans-serif">&copy; 2026 VANDY. Toate drepturile rezervate.</p>
            <p style="text-align:center;color:#525252;font-size:12px;line-height:1.6;margin:0 0 16px;font-family:Arial,sans-serif">Primești acest email pentru că te-ai înscris pe <a href="https://vandy.ro" style="color:#525252;text-decoration:underline">vandy.ro</a>.</p>
            <p style="color:#404040;font-size:11px;line-height:1.7;margin:0;font-family:Arial,sans-serif;padding-top:14px;border-top:1px solid #1a1a1a"><strong style="color:#525252">Disclaimer:</strong> Trading-ul și investițiile în active financiare implică riscuri semnificative și pot duce la pierderea parțială sau totală a capitalului investit. Performanțele trecute nu garantează rezultate viitoare. Informațiile prezentate în acest email au caracter exclusiv educațional și informativ și nu reprezintă sfaturi financiare, recomandări de investiții sau îndemnuri de a cumpăra sau vinde active financiare. Înainte de a lua orice decizie financiară, consultați un consilier financiar autorizat și investiți doar sumele pe care vă puteți permite să le pierdeți.</p>

          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function email1Welcome(name) {
  return {
    subject: `${name}, îți arăt cele 3 oportunități care îți pot schimba viața financiară.`,
    html: baseTemplate(`
      <p style="${S.h1}">${name}, bun venit în comunitatea VANDY.</p>
      <p style="${S.p}">Mă bucur că ești aici. În următoarele 4 zile îți voi arăta <strong style="${S.bold}">3 oportunități concrete</strong> prin care oameni obișnuiți fac bani reali în 2026 &mdash; indiferent de punctul de start.</p>

      ${quote('&ldquo;Nu contează de unde pornești. Contează <strong style="color:#34d399">dacă ai un sistem, disciplina să-l urmezi</strong> și oamenii potriviți lângă tine.&rdquo;', '&mdash; VANDY')}

      <p style="${S.p}">Iată ce urmează:</p>

      ${card(`
        ${step('1', '<span style="color:#34d399">Mâine: Memecoin Trading</span>', 'Cum poți face între <strong style="color:#ffffff">100$ și 300$ pe zi</strong> cu cea mai mare oportunitate a momentului &mdash; pas cu pas, fără experiență anterioară.')}
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background-color:#333333;font-size:1px;line-height:1px;padding:0;margin:8px 0">&nbsp;</td></tr></table>
        ${step('2', '<span style="color:#fbbf24">Ziua 2: Futures Trading</span>', 'Cum poți transforma <strong style="color:#ffffff">100$ în 1.000.000$</strong> cu strategia de profit compus &mdash; matematica din spatele celor mai mari câștiguri.', '#fbbf24')}
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background-color:#333333;font-size:1px;line-height:1px;padding:0;margin:8px 0">&nbsp;</td></tr></table>
        ${step('3', '<span style="color:#a78bfa">Ziua 3: Portofoliu de Investiții</span>', 'Cum îți construiești un portofoliu în <strong style="color:#ffffff">Crypto, Stocks, Companii în trend și Real Estate</strong> pentru Abundență și Libertate Financiară.', '#a78bfa')}
      `, 'border:1px solid rgba(52,211,153,0.3)')}

      <p style="${S.p}">Eu sunt <strong style="${S.bold}">VANDY</strong> &mdash; trader, investitor și antreprenor cu peste <strong style="${S.bold}">11 ani de experiență</strong> în piețele financiare. Am construit un sistem prin care am trecut de la zero la libertate financiară completă.</p>
      <p style="${S.p}">Acum îl predau în comunitatea <strong style="${S.bold}">DYNASTY</strong> &mdash; și primii pași încep chiar de mâine, în inbox-ul tău.</p>

      <p style="${S.p}">Până atunci, intră în comunitatea mea <strong style="${S.green}">100% gratuită</strong> de pe Telegram unde postez oportunități zilnice:</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0"><tr><td align="center">${ctaBtn('Intră pe Telegram gratuit &rarr;', TELEGRAM_URL)}</td></tr></table>

      <p style="${S.pW}">Ne vedem mâine,<br/>VANDY</p>
    `, `${name}, bun venit! Iată cele 3 oportunități care îți vor schimba perspectiva despre bani...`)
  };
}

function email2Value(name) {
  return {
    subject: `${name}, cum faci 100$-300$ pe zi cu Memecoin Trading.`,
    html: baseTemplate(`
      <span style="${S.pill}">Oportunitatea #1 &mdash; Memecoin Trading</span>
      <p style="${S.h1}">Cea mai mare oportunitate a momentului. Și aproape nimeni nu o înțelege.</p>
      <p style="${S.p}">Salut, ${name}.</p>
      <p style="${S.p}">Înainte să îți explic cum funcționează, lasă-mă să îți arăt <strong style="${S.bold}">ce e posibil</strong>:</p>

      ${card(`
        <p style="margin:0 0 8px;font-size:13px;color:#525252;text-transform:uppercase;letter-spacing:1px;text-align:center;font-family:Arial,sans-serif">Exemplu real din comunitate</p>
        <p style="margin:0;color:#ffffff;font-size:16px;line-height:1.6;text-align:center;font-family:Arial,sans-serif"><span style="color:#34d399;font-size:24px;font-weight:800">+340%</span> în 48 de ore pe un memecoin identificat în Dynasty.<br/>Cu 300$ capital inițial &rarr; <strong style="color:#ffffff">1,320$ profit net.</strong></p>
      `, 'border:1px solid rgba(52,211,153,0.3)')}

      <p style="${S.p}">Nu e noroc. E un <strong style="${S.bold}">sistem repetat zi de zi</strong>. Hai să îți explic exact cum:</p>

      ${card(`
        <p style="${S.h2}">&#x1F4B9; Ce sunt Memecoins și de ce mișcă atât de mult?</p>
        <p style="${S.p}">Memecoins sunt criptomonede cu capitalizare mică, conduse de <strong style="${S.bold}">narrative și comunitate</strong> &mdash; nu de tehnologie. Tocmai de asta sunt volatile: o singură știre, un tweet, un trend poate mișca prețul cu <strong style="${S.green}">+100% sau mai mult în câteva ore.</strong></p>
        <p style="margin:0;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Pentru traderii care știu să citească piața, asta înseamnă oportunitate zilnică. De aceea <strong style="${S.bold}">educația și comunitatea</strong> fac toată diferența.</p>
      `)}

      ${card(`
        <p style="${S.h2}">&#x1F4CA; Matematica din spate: 100$-300$/zi</p>
        <p style="${S.p}">Cum arată concret un target de 100$-300$/zi?</p>
        ${step('Ex', '<strong style="color:#ffffff">Capital: 500$</strong>', 'Trade pe memecoin cu +40% mișcare &rarr; <strong style="color:#34d399">+200$ profit</strong><br/>2-3 astfel de trades pe săptămână = <strong style="color:#ffffff">400$-600$/săptămână</strong>', '#fbbf24')}
        <p style="${S.p}">Nu trebuie să prinzi fiecare mișcare. Trebuie să <strong style="${S.bold}">prinzi cele corecte</strong> &mdash; cele cu cel mai bun raport risc/recompensă.</p>
        <p style="margin:0;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Asta este exact ceea ce facem în Dynasty: <strong style="${S.green}">filtrăm zgomotul și oferim call-uri clare, executabile.</strong></p>
      `)}

      ${card(`
        <p style="${S.h2}">&#x1F50D; Cum identifici oportunitatea înainte să explodeze?</p>
        ${ulItems([
          '<strong style="color:#ffffff">Narrativele</strong> &mdash; ce temă domină piața: AI coins, gaming, meme culture? Banii urmează narrativul',
          '<strong style="color:#ffffff">Volumul</strong> &mdash; o creștere bruscă de volum înainte de mișcare e semnalul cel mai clar',
          '<strong style="color:#ffffff">Comunitatea</strong> &mdash; activitate organică pe Twitter/Telegram e combustibilul prețului',
          '<strong style="color:#ffffff">Early entry</strong> &mdash; intri la începutul mișcării, nu după ce toată lumea știe',
        ])}
      `)}

      ${cardGreen(`
        <p style="margin:0 0 10px;color:#34d399;font-size:16px;font-weight:700;font-family:Arial,sans-serif">Ce primești în Dynasty pe Memecoin Trading:</p>
        ${ulItems([
          '<strong style="color:#ffffff">Call-uri zilnice</strong> cu entry, stop loss și target &mdash; executabile în 60 de secunde',
          '<strong style="color:#ffffff">Analiză de narrative</strong> &mdash; ce monede urmărim și de ce, înainte să explodeze',
          '<strong style="color:#ffffff">Alertă în timp real</strong> când apare oportunitatea &mdash; nu după ce trendul a trecut',
          '<strong style="color:#ffffff">Educație completă</strong> &mdash; de la cum cumperi prima monedă la strategii avansate',
          '<strong style="color:#ffffff">Risk management</strong> &mdash; niciodată nu intri fără să știi exact cât poți pierde',
        ])}
      `)}

      ${quote('&ldquo;Memecoins sunt riscante pentru cei care nu știu ce fac. Pentru cei care știu &mdash; sunt <strong style="color:#fbbf24">cea mai rapidă sursă de cashflow din piață.</strong>&rdquo;', '&mdash; VANDY', '#fbbf24')}

      <p style="${S.p}">Mâine îți arăt a doua oportunitate: cum poți transforma <strong style="${S.bold}">100$ în 1 milion de dolari</strong> prin Futures Trading și strategia de profit compus. E emailul care schimbă complet modul în care te uiți la bani.</p>
      <p style="${S.pW}">Stay sharp,<br/>VANDY</p>
    `, `${name}, cum faci 100$-300$/zi cu Memecoin Trading — sistemul concret...`)
  };
}

function email3SocialProof(name) {
  return {
    subject: `${name}, cum transformi 100$ în 1.000.000$ cu Futures Trading.`,
    html: baseTemplate(`
      <span style="${S.pill}">Oportunitatea #2 &mdash; Futures Trading</span>
      <p style="${S.h1}">Einstein a numit-o &ldquo;a opta minune a lumii&rdquo;. Noi o aplicăm zilnic.</p>
      <p style="${S.p}">Salut, ${name}.</p>
      <p style="${S.p}">Vorbim despre <strong style="${S.bold}">dobânda compusă</strong> &mdash; cel mai puternic concept financiar din lume. Și în Futures Trading, combinată cu disciplina corectă, <strong style="${S.green}">produce rezultate care par imposibile.</strong></p>

      ${card(`
        <p style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#525252;text-align:center;font-family:Arial,sans-serif">Matematica profitului compus în Futures</p>
        <p style="color:#ffffff;font-size:15px;line-height:1.9;margin:0;text-align:center;font-family:Arial,sans-serif">
          Start: <strong style="color:#fbbf24;font-size:18px">100$</strong><br/>
          +10% profit/săptămână reinvestit compus<br/>
          <span style="font-size:13px;color:#737373">Lună 3 &rarr; <span style="color:#fff">133$</span> &nbsp;|&nbsp; Lună 6 &rarr; <span style="color:#fff">177$</span> &nbsp;|&nbsp; Lună 12 &rarr; <span style="color:#fff">315$</span></span><br/>
          <span style="font-size:13px;color:#737373">An 2 &rarr; <span style="color:#fff">1,000$</span> &nbsp;|&nbsp; An 3 &rarr; <span style="color:#fff">3,200$</span> &nbsp;|&nbsp; An 5 &rarr; <strong style="color:#34d399">32,000$</strong></span><br/>
          <span style="font-size:13px;color:#737373">An 7 &rarr; <strong style="color:#fbbf24">320,000$</strong> &nbsp;|&nbsp; An 10 &rarr; <strong style="color:#fbbf24">1,000,000$+</strong></span>
        </p>
      `, 'border:1px solid rgba(251,191,36,0.3)')}

      <p style="${S.p}">Acesta nu e un scenariu de vis. E <strong style="${S.bold}">matematica pură</strong> a compunerii. Și Futures Trading e vehiculul care face posibil targetul de 10%/săptămână &mdash; cu strategia și disciplina corecte.</p>

      ${card(`
        <p style="${S.h2}">&#x1F525; Ce e Futures Trading și de ce e atât de puternic?</p>
        <p style="${S.p}">Futures îți permit să tranzacționezi cu <strong style="${S.bold}">leverage</strong> &mdash; adică să controlezi o poziție mai mare decât capitalul pe care îl ai efectiv.</p>
        ${ulItems([
          '<strong style="color:#ffffff">Long și Short</strong> &mdash; faci bani și când piața crește și când scade. Nu există direcție greșită dacă ai analiză corectă',
          '<strong style="color:#ffffff">Leverage x5 &mdash; x10</strong> &mdash; cu 100$ controlezi o poziție de 500$-1,000$ (profitul se calculează la poziție, nu la capital)',
          '<strong style="color:#ffffff">Lichiditate maximă</strong> &mdash; intri și ieși instant, fără să miști piața',
          '<strong style="color:#ffffff">24/7</strong> &mdash; piața crypto nu doarme. Oportunități zi și noapte',
        ])}
      `)}

      ${card(`
        <p style="${S.h2}">&#x1F4CB; Strategia de profit compus: cum o aplicăm</p>
        ${step('1', 'Definești capitalul de risc', 'Suma pe care ești dispus să o lucrezi. Nu mai mult de 10-20% din economii. Restul &mdash; în investiții sigure.')}
        ${step('2', 'Setezi regula de risc per trade', 'Maximum 1-2% din capital pe un singur trade. Cu 500$ capital, riști maxim 10$ pe trade. Pierzi 10 trades la rând &rarr; pierzi 10% din capital. Sustenabil.')}
        ${step('3', 'Reinvestești 100% din profit', 'Fiecare dolar câștigat merge înapoi în capital. Asta activează compunerea. Asta construiește averea.')}
        ${step('4', 'Retragi periodic pentru investiții', 'La fiecare prag (de ex. la 5,000$) retragi 50% în portofoliul de investiții. Protejezi câștigurile în active reale.')}
      `)}

      ${cardGreen(`
        <p style="margin:0 0 10px;color:#34d399;font-size:16px;font-weight:700;font-family:Arial,sans-serif">Ce primești în Dynasty pe Futures Trading:</p>
        ${ulItems([
          '<strong style="color:#ffffff">Setups zilnice</strong> cu entry, leverage recomandat, stop loss și take profit exact',
          '<strong style="color:#ffffff">Analize macro</strong> &mdash; înțelegi direcția pieței înainte să deschizi un trade',
          '<strong style="color:#ffffff">Calculator de compunere</strong> personalizat pe capitalul tău',
          '<strong style="color:#ffffff">Reguli clare de risk management</strong> &mdash; ca să nu lichidezi niciodată dintr-o mișcare emoțională',
          '<strong style="color:#ffffff">Mentorat direct</strong> &mdash; fiecare trade explicat, fiecare greșeală analizată',
        ])}
      `)}

      ${quote('&ldquo;Nu ai nevoie de capital mare. Ai nevoie de <strong style="color:#34d399">timp, disciplină și un sistem care funcționează</strong>. Compunerea face restul.&rdquo;', '&mdash; VANDY')}

      <p style="${S.p}">Mâine închei seria cu a treia oportunitate: cum îți construiești un <strong style="${S.bold}">Portofoliu de Investiții</strong> în Crypto, Stocks, Companii în trend și Real Estate &mdash; pentru Abundență și Libertate Financiară pe termen lung.</p>
      <p style="${S.pW}">VANDY</p>
    `, `${name}, cum transformi 100$ în 1.000.000$ cu Futures Trading și profit compus...`)
  };
}

function email4Objections(name) {
  return {
    subject: `${name}, cum îți construiești Abundența și Libertatea Financiară.`,
    html: baseTemplate(`
      <span style="${S.pill}">Oportunitatea #3 &mdash; Portofoliu de Investiții</span>
      <p style="${S.h1}">Trading-ul generează banii. Investițiile generează libertatea.</p>
      <p style="${S.p}">Salut, ${name}.</p>
      <p style="${S.p}">În ultimele două emailuri ți-am arătat cum să faci bani prin Memecoin Trading și cum să îi multiplici prin Futures și profit compus. Acum îți arăt <strong style="${S.bold}">ce faci cu banii după ce i-ai câștigat.</strong></p>

      ${quote('&ldquo;Averea se câștigă prin trading. <strong style="color:#34d399">Libertatea financiară se construiește prin investiții.</strong> Fă-le pe amândouă.&rdquo;', '&mdash; VANDY')}

      <p style="${S.p}">Un portofoliu de investiții serios are <strong style="${S.bold}">4 piloni</strong>. Fiecare cu rolul lui:</p>

      ${card(`
        <p style="${S.h2}">&#x20BF; Pilonul 1: Crypto &mdash; Creștere accelerată</p>
        <p style="${S.p}">Nu vorbim de memecoins aici. Vorbim de <strong style="${S.bold}">active fundamentale</strong> pe care le acumulezi pe termen lung:</p>
        ${ulItems([
          '<strong style="color:#ffffff">Bitcoin</strong> &mdash; aurul digital. De la $1 la $100,000+ în 15 ani. Cine a ținut, a câștigat',
          '<strong style="color:#ffffff">Ethereum</strong> &mdash; infrastructura Web3. Fiecare aplicație descentralizată rulează pe el',
          '<strong style="color:#ffffff">Proiecte în trend</strong> &mdash; AI coins, DePIN, RWA &mdash; sectoarele care vor defini următorul bull run',
        ])}
        <p style="margin:8px 0 0;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Strategia: <strong style="color:#34d399">DCA lunar</strong> (investești fix indiferent de preț) + portofoliu transparent în Dynasty pe care îl urmărești și replici.</p>
      `)}

      ${card(`
        <p style="${S.h2}">&#x1F4C8; Pilonul 2: Stocks &mdash; Stabilitate și dividende</p>
        <p style="${S.p}"><strong style="${S.bold}">Acțiunile</strong> sunt coloana vertebrală a oricărui portofoliu serios. Mai puțin spectaculoase decât crypto, dar <strong style="${S.green}">predictibile și consistente.</strong></p>
        ${ulItems([
          '<strong style="color:#ffffff">S&amp;P 500</strong> &mdash; ~10% anual în ultimii 90 de ani. Bate 95% din fondurile de investiții',
          '<strong style="color:#ffffff">Dividend stocks</strong> &mdash; bani care îți intră în cont lunar fără să faci nimic',
          '<strong style="color:#ffffff">Companii în trend</strong> &mdash; NVIDIA, Microsoft, Meta &mdash; AI, tech, viitorul economiei globale',
        ])}
        <p style="margin:8px 0 0;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Target: <strong style="${S.bold}">30% din portofoliu în stocks</strong> pentru stabilitate și income pasiv.</p>
      `)}

      ${card(`
        <p style="${S.h2}">&#x1F916; Pilonul 3: Companii în trend &mdash; Avantajul primului val</p>
        <p style="${S.p}">Există momente în istorie când o industrie explodează și <strong style="${S.bold}">primii care intră câștigă de 10x-100x</strong> față de cei care intră mai târziu.</p>
        ${ulItems([
          '<strong style="color:#ffffff">Artificial Intelligence</strong> &mdash; cel mai mare Gold Rush al deceniului. Infrastructure, applications, models',
          '<strong style="color:#ffffff">Clean Energy</strong> &mdash; tranziția globală energetică creează companii de trilioane',
          '<strong style="color:#ffffff">Biotech &amp; Longevity</strong> &mdash; medicina viitorului, finanțată de cei mai mari investitori din lume',
        ])}
        <p style="margin:8px 0 0;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">În Dynasty urmărim <strong style="${S.green}">companiile emergente cu cel mai mare potențial</strong> înainte să devină mainstream.</p>
      `)}

      ${card(`
        <p style="${S.h2}">&#x1F3E0; Pilonul 4: Real Estate &mdash; Temelia imperiilor financiare</p>
        <p style="${S.p}"><strong style="${S.bold}">Imobiliarele</strong> sunt cel mai vechi și mai sigur mod de a construi avere generațională.</p>
        ${ulItems([
          '<strong style="color:#ffffff">Valoare în timp</strong> &mdash; terenul e o resursă finită. Prețul merge întotdeauna în sus pe termen lung',
          '<strong style="color:#ffffff">Cash flow din chirii</strong> &mdash; venit pasiv real, lunar, indiferent de ce face piața',
          '<strong style="color:#ffffff">Leverage bancar</strong> &mdash; cumperi cu banii băncii, profitul e al tău',
        ])}
        <p style="margin:8px 0 0;color:#a3a3a3;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">Real estate e temelia pe care se construiesc imperiile financiare. <strong style="${S.green}">Îl introducem în strategie din momentul în care ai construit primii tăi 10-20K&euro; din trading și crypto.</strong></p>
      `)}

      ${card(`
        <p style="margin:0 0 14px;text-align:center"><span style="${S.pill}">Portofoliul complet VANDY</span></p>
        ${step('30%', 'Crypto pe termen lung', 'BTC, ETH + proiecte fundamentale în trend')}
        ${step('30%', 'Stocks &amp; ETF-uri', 'S&amp;P 500, dividend stocks, growth tech')}
        ${step('20%', 'Companii în trend', 'AI, clean energy, biotech &mdash; primii în val')}
        ${step('20%', 'Real Estate', 'Proprietăți fizice sau REIT-uri &mdash; cash flow lunar')}
        ${divider()}
        <p style="text-align:center;margin:0;color:#a3a3a3;font-size:15px;font-family:Arial,sans-serif"><strong style="${S.bold}">Rezultatul:</strong> <strong style="${S.green}">Abundență și Libertate Financiară pentru tine și generațiile viitoare.</strong></p>
      `, 'border:1px solid rgba(52,211,153,0.3)')}

      <p style="${S.p}">Mâine îți trimit <strong style="${S.bold}">ultimul email</strong> din această serie &mdash; unde îți arăt cum ai acces la toate cele 3 oportunități într-un singur loc. Va fi cel mai important email pe care îl primești de la mine.</p>
      <p style="${S.pW}">VANDY</p>
    `, `${name}, cum îți construiești portofoliul de investiții pentru Abundență și Libertate Financiară...`)
  };
}

function email5CTA(name) {
  return {
    subject: `${name}, cele 3 oportunități. Un singur loc. Decizia ta.`,
    html: baseTemplate(`
      <span style="${S.pill}">Ziua 4 &mdash; Ultimul email</span>
      <p style="${S.h1}">Ai văzut ce e posibil. Acum e rândul tău.</p>
      <p style="${S.p}">Salut, ${name}.</p>
      <p style="${S.p}">În ultimele 4 zile ți-am arătat 3 oportunități concrete prin care oameni obișnuiți fac bani reali în 2026:</p>

      ${step('1', 'Memecoin Trading', 'Cum faci <strong style="color:#34d399">100$-300$/zi</strong> cu cea mai mare oportunitate a momentului')}
      ${step('2', 'Futures Trading + Profit Compus', 'Cum transformi <strong style="color:#fbbf24">100$ în 1.000.000$</strong> prin strategia de compunere aplicată disciplinat', '#fbbf24')}
      ${step('3', 'Portofoliu de Investiții', 'Crypto + Stocks + Companii în trend + Real Estate &rarr; <strong style="color:#a78bfa">Abundență &amp; Libertate Financiară</strong>', '#a78bfa')}

      <p style="${S.p}">Acum, o singură întrebare:</p>
      <p style="text-align:center;font-size:22px;font-weight:800;color:#34d399;margin:20px 0;font-family:Arial,sans-serif">Vrei să știi. Sau vrei să faci?</p>

      <p style="${S.p}">Există o diferență uriașă între a înțelege o oportunitate și a o executa. <strong style="${S.bold}">Execuția necesită sistem, comunitate și ghidaj zilnic.</strong> Exact asta oferă Dynasty.</p>

      ${card(`
        <p style="text-align:center;margin:0 0 6px;font-size:28px;font-weight:800;color:#ffffff;font-family:Arial,sans-serif">DYNASTY</p>
        <p style="text-align:center;color:#34d399;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;font-family:Arial,sans-serif">Comunitate de Trading, Investiții &amp; Libertate Financiară</p>

        <p style="margin:0 0 10px;color:#34d399;font-size:14px;font-weight:700;font-family:Arial,sans-serif">&#x1F4B9; MEMECOIN TRADING &mdash; 100$-300$/zi</p>
        ${ulItems([
          'Call-uri zilnice cu <strong style="color:#ffffff">entry, stop loss și target</strong> &mdash; executabile în 60 de secunde',
          'Analiză de narrative &mdash; identificăm oportunitatea <strong style="color:#ffffff">înainte să explodeze</strong>',
          'Educație completă de la zero &mdash; de la prima cumpărătură la strategie avansată',
        ])}

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0"><tr><td style="height:1px;background-color:#333333;font-size:1px;line-height:1px">&nbsp;</td></tr></table>

        <p style="margin:0 0 10px;color:#fbbf24;font-size:14px;font-weight:700;font-family:Arial,sans-serif">&#x1F525; FUTURES TRADING &mdash; Strategia de profit compus</p>
        ${ulItems([
          'Setups zilnice cu <strong style="color:#ffffff">leverage recomandat, entry și exit exact</strong>',
          'Calculator de compunere personalizat pe capitalul tău',
          'Risk management strict &mdash; <strong style="color:#ffffff">niciodată nu lichidezi dintr-o emoție</strong>',
        ])}

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0"><tr><td style="height:1px;background-color:#333333;font-size:1px;line-height:1px">&nbsp;</td></tr></table>

        <p style="margin:0 0 10px;color:#a78bfa;font-size:14px;font-weight:700;font-family:Arial,sans-serif">&#x1F4CA; PORTOFOLIU DE INVESTIȚII &mdash; Abundență pe termen lung</p>
        ${ulItems([
          'Portofoliu transparent <strong style="color:#ffffff">Crypto + Stocks + Companii în trend</strong> pe care îl replici',
          'Strategie de Real Estate &mdash; când și cum intri',
          'Acces direct la <strong style="color:#ffffff">VANDY și echipă</strong> pentru orice întrebare',
        ])}
      `, 'border:1px solid #34d399')}

      ${card(`
        <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#ef4444;font-weight:700;text-align:center;font-family:Arial,sans-serif">&#x23F0; Ofertă cu acces limitat</p>
        <p style="margin:0;color:#ffffff;font-size:15px;line-height:1.6;text-align:center;font-family:Arial,sans-serif">Locurile în Dynasty sunt limitate pentru a menține calitatea comunității.<br/>Odată ce capacitatea e atinsă, accesul se închide.</p>
      `, 'border:1px solid rgba(239,68,68,0.4);background-color:#0d0505')}

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;text-align:center">
        <tr><td align="center">
          <p style="margin:0 0 4px;font-size:13px;color:#525252;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif">Acces complet Dynasty</p>
          <p style="margin:0 0 4px;font-family:Arial,sans-serif"><span style="font-size:15px;color:#525252;text-decoration:line-through">149&euro; / lun&acirc;</span></p>
          <p style="margin:0 0 16px;font-family:Arial,sans-serif"><span style="font-size:36px;font-weight:800;color:#ffffff">99&euro;</span><span style="color:#737373;font-size:15px"> / lun&acirc;</span> &nbsp;<span style="background-color:#34d399;color:#000000;font-size:11px;font-weight:800;padding:3px 8px;border-radius:50px;text-transform:uppercase;letter-spacing:0.5px">-34%</span></p>
          ${ctaBtn('Intră în Dynasty acum &rarr;', WHOP_URL)}
          <p style="font-size:12px;color:#525252;margin:10px 0 0;font-family:Arial,sans-serif">Anulezi oricând. Fără contracte.</p>
        </td></tr>
      </table>

      ${divider()}

      <p style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#525252;font-weight:700;text-align:center;font-family:Arial,sans-serif">Ce spun membrii Dynasty</p>
      <p style="margin:0 0 16px;text-align:center;font-family:Arial,sans-serif"><span style="color:#fbbf24;font-size:20px">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span> <strong style="color:#ffffff;font-size:16px">5.0</strong> <span style="color:#525252;font-size:13px">(4 recenzii verificate pe Whop)</span></p>

      ${card(`
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="46" valign="top"><div style="width:36px;height:36px;border-radius:50%;background-color:#059669;text-align:center;line-height:36px;font-weight:800;color:#000000;font-size:14px;font-family:Arial,sans-serif">D</div></td>
          <td valign="top"><p style="margin:0 0 2px;color:#ffffff;font-weight:600;font-size:13px;font-family:Arial,sans-serif">Daniel Hortopan</p><span style="color:#fbbf24;font-size:13px">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span></td>
        </tr></table>
        <p style="margin:10px 0 0;font-size:14px;font-style:italic;color:#a3a3a3;font-family:Arial,sans-serif">&ldquo;Super informații! 💪&rdquo;</p>
      `)}

      ${card(`
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="46" valign="top"><div style="width:36px;height:36px;border-radius:50%;background-color:#d97706;text-align:center;line-height:36px;font-weight:800;color:#000000;font-size:14px;font-family:Arial,sans-serif">O</div></td>
          <td valign="top"><p style="margin:0 0 2px;color:#ffffff;font-weight:600;font-size:13px;font-family:Arial,sans-serif">Ovidiu C.</p><span style="color:#fbbf24;font-size:13px">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span></td>
        </tr></table>
        <p style="margin:10px 0 0;font-size:14px;font-style:italic;color:#a3a3a3;font-family:Arial,sans-serif">&ldquo;💪🏻 The best!&rdquo;</p>
      `)}

      ${divider()}

      ${quote('&ldquo;Cel mai scump lucru din lume nu e un Lamborghini sau o vilă. E <strong style="color:#34d399">timpul pierdut pe oportunități ratate</strong>. Fiecare zi în care amâni e o zi în care altcineva construiește averea pe care tu o visezi.&rdquo;', '&mdash; VANDY')}

      <p style="${S.p}">Nu există <em>&ldquo;o să încep mâine&rdquo;</em>. Există doar <strong style="${S.bold}">acum</strong> sau <strong style="${S.bold}">niciodată</strong>.</p>
      <p style="${S.p}">Dynasty e primul pas. Restul parcursului vine natural.</p>
      <p style="${S.p}">Ne vedem înăuntru.</p>
      <p style="color:#ffffff;font-weight:700;font-size:18px;font-family:Arial,sans-serif">VANDY &#x1F5A4;</p>
    `, `${name}, cele 3 oportunități — Memecoin, Futures, Investiții — toate într-un singur loc. Dynasty te așteaptă.`)
  };
}

const EMAIL_SCHEDULE = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
};

function getEmail(step, firstName) {
  switch (step) {
    case 1: return email1Welcome(firstName);
    case 2: return email2Value(firstName);
    case 3: return email3SocialProof(firstName);
    case 4: return email4Objections(firstName);
    case 5: return email5CTA(firstName);
    default: return null;
  }
}

export { getEmail, EMAIL_SCHEDULE };

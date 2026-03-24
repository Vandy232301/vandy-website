const DYNASTY_URL = 'https://dynasty.vandy.ro/';

function baseTemplate(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="dark"/>
<meta name="supported-color-schemes" content="dark"/>
<title>VANDY</title>
<style>
  body{margin:0;padding:0;background:#000;color:#e5e5e5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
  .wrapper{max-width:560px;margin:0 auto;padding:40px 24px}
  .logo{font-size:20px;font-weight:800;color:#fff;letter-spacing:2px;text-decoration:none}
  .divider{height:1px;background:linear-gradient(90deg,transparent,#333,transparent);margin:28px 0}
  h1{color:#fff;font-size:26px;font-weight:700;line-height:1.3;margin:0 0 16px}
  h2{color:#fff;font-size:20px;font-weight:700;line-height:1.3;margin:0 0 12px}
  p{color:#a3a3a3;font-size:15px;line-height:1.7;margin:0 0 16px}
  .highlight{color:#fff;font-weight:600}
  .green{color:#34d399}
  .cta-btn{display:inline-block;background:#fff;color:#000;font-size:15px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;letter-spacing:0.3px;margin:8px 0}
  .cta-btn:hover{background:#e5e5e5}
  .secondary-btn{display:inline-block;background:transparent;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:50px;text-decoration:none;border:1px solid #333}
  .card{background:#111;border:1px solid #222;border-radius:16px;padding:24px;margin:20px 0}
  .pill{display:inline-block;background:#111;border:1px solid #333;border-radius:50px;padding:6px 14px;font-size:11px;font-weight:700;color:#34d399;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px}
  .footer{text-align:center;padding-top:32px;color:#525252;font-size:12px;line-height:1.6}
  .footer a{color:#525252;text-decoration:underline}
  .preheader{display:none!important;max-height:0;overflow:hidden;mso-hide:all}
  ul{padding-left:0;list-style:none;margin:0}
  ul li{padding:8px 0;font-size:15px;color:#a3a3a3;line-height:1.6}
  ul li::before{content:'→';color:#34d399;font-weight:700;margin-right:10px}
  .stat{text-align:center;padding:16px}
  .stat-num{font-size:32px;font-weight:800;color:#34d399;display:block}
  .stat-label{font-size:13px;color:#737373;text-transform:uppercase;letter-spacing:1px}
</style>
</head>
<body>
<div class="preheader">${preheader}</div>
<div class="wrapper">
  <a href="https://vandy.ro" class="logo">VANDY</a>
  <div class="divider"></div>
  ${content}
  <div class="divider"></div>
  <div class="footer">
    <p>© 2026 VANDY. Toate drepturile rezervate.</p>
    <p>Primești acest email pentru că te-ai înscris pe <a href="https://vandy.ro">vandy.ro</a>.</p>
  </div>
</div>
</body>
</html>`;
}

export function getEmail(step: number, firstName: string): { subject: string; html: string } | null {
  switch (step) {
    case 1:
      return email1Welcome(firstName);
    case 2:
      return email2Value(firstName);
    case 3:
      return email3SocialProof(firstName);
    case 4:
      return email4Objections(firstName);
    case 5:
      return email5CTA(firstName);
    default:
      return null;
  }
}

function email1Welcome(name: string) {
  return {
    subject: `Bine ai venit, ${name}! Aici începe totul.`,
    html: baseTemplate(`
      <h1>Salut, ${name}! 👋</h1>
      <p>Mă bucur enorm că ai ales să faci parte din comunitatea mea. Ai luat una dintre cele mai bune decizii.</p>
      <p>Sunt <span class="highlight">VANDY</span> — antreprenor în serie, trader și investitor cu peste <span class="highlight">11 ani de experiență</span> în branding strategic, marketing și tehnologie.</p>
      
      <div class="card">
        <span class="pill">Ce urmează</span>
        <p style="margin-bottom:0">În următoarele zile vei primi de la mine:</p>
        <ul>
          <li>Lecții pe care le-am învățat din <span class="highlight">mii de trade-uri</span></li>
          <li>Greșelile care m-au costat cel mai mult</li>
          <li>Strategii care funcționează <span class="highlight">acum</span>, nu acum 5 ani</li>
          <li>Cum poți face parte din <span class="highlight">Dynasty</span> — cea mai puternică comunitate de trading</li>
        </ul>
      </div>

      <p>Între timp, intră în comunitatea mea <span class="green">gratuită</span> de pe Telegram unde primești zilnic analize, știri filtrate și oportunități:</p>
      
      <div style="text-align:center;margin:24px 0">
        <a href="https://t.me/VANDY_001_Official" class="cta-btn">Intră pe Telegram gratuit →</a>
      </div>

      <p>Fii atent la inbox — următorul email vine cu o lecție care a schimbat totul pentru mine.</p>
      <p style="color:#fff;font-weight:600">Talk soon,<br/>VANDY</p>
    `, 'Bine ai venit în comunitate! Iată ce urmează...')
  };
}

function email2Value(name: string) {
  return {
    subject: `${name}, 3 greșeli care distrug conturile de trading`,
    html: baseTemplate(`
      <h1>3 greșeli fatale pe care le fac 90% din traderi</h1>
      <p>Salut, ${name}.</p>
      <p>Am pierdut bani. Mulți. Și nu pentru că nu aveam strategie — ci pentru că <span class="highlight">făceam aceste 3 greșeli</span> pe care aproape toată lumea le face.</p>

      <div class="card">
        <h2>❌ Greșeala #1: Trading emoțional</h2>
        <p style="margin-bottom:0">Intri într-un trade pentru că "simți" că o să crească. Ieși prea devreme din frică. FOMO te face să cumperi la vârf. Soluția? <span class="highlight">Un plan clar ÎNAINTE de a deschide orice poziție.</span></p>
      </div>

      <div class="card">
        <h2>❌ Greșeala #2: Fără risk management</h2>
        <p style="margin-bottom:0">Un singur trade prost poate șterge câștigurile din 10 trade-uri bune. Regula mea: <span class="highlight">nu risca niciodată mai mult de 1-2% din portofoliu pe un singur trade.</span></p>
      </div>

      <div class="card">
        <h2>❌ Greșeala #3: Informație de pe TikTok</h2>
        <p style="margin-bottom:0">Urmărești "guru" care nu au tranzacționat niciodată cu bani reali. <span class="highlight">Ai nevoie de o comunitate care face bani REAL</span>, nu de influenceri care vând cursuri.</p>
      </div>

      <p>Exact de asta am construit <span class="green">Dynasty</span> — o comunitate unde fiecare analiză, fiecare call, vine din <span class="highlight">experiență reală</span>.</p>

      <p>În 2 zile îți arăt exact ce rezultate au obținut membrii Dynasty.</p>
      <p style="color:#fff;font-weight:600">Stay sharp,<br/>VANDY</p>
    `, '3 greșeli fatale în trading pe care probabil le faci și tu...')
  };
}

function email3SocialProof(name: string) {
  return {
    subject: `Rezultatele vorbesc de la sine, ${name}`,
    html: baseTemplate(`
      <h1>Ce spun membrii Dynasty</h1>
      <p>Salut, ${name}.</p>
      <p>Pot să vorbesc cât vreau despre cât de bună e comunitatea Dynasty. Dar <span class="highlight">rezultatele membrilor mei vorbesc mai tare decât orice cuvânt.</span></p>

      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:24px 0">
        <div class="card" style="flex:1;min-width:140px">
          <div class="stat">
            <span class="stat-num">1,200+</span>
            <span class="stat-label">Membrii activi</span>
          </div>
        </div>
        <div class="card" style="flex:1;min-width:140px">
          <div class="stat">
            <span class="stat-num">85%</span>
            <span class="stat-label">Win rate call-uri</span>
          </div>
        </div>
        <div class="card" style="flex:1;min-width:140px">
          <div class="stat">
            <span class="stat-num">24/7</span>
            <span class="stat-label">Suport & analize</span>
          </div>
        </div>
      </div>

      <div class="card">
        <p><span class="green">★★★★★</span></p>
        <p><em>"Am intrat în Dynasty acum 3 luni cu 500€. Acum sunt la 2,800€. Nu mulțumesc norocului — mulțumesc strategiilor și disciplinei pe care am învățat-o aici."</em></p>
        <p style="color:#fff;font-weight:600;margin-bottom:0">— Membru Dynasty</p>
      </div>

      <div class="card">
        <p><span class="green">★★★★★</span></p>
        <p><em>"Cea mai bună investiție pe care am făcut-o nu a fost într-un coin — a fost în comunitatea Dynasty. Calitatea analizelor e de alt nivel."</em></p>
        <p style="color:#fff;font-weight:600;margin-bottom:0">— Membru Dynasty</p>
      </div>

      <p>Dynasty nu e pentru toată lumea. E pentru cei care vor <span class="highlight">rezultate reale</span>, nu promisiuni goale.</p>
      
      <div style="text-align:center;margin:24px 0">
        <a href="${DYNASTY_URL}" class="secondary-btn">Află mai multe despre Dynasty →</a>
      </div>

      <p>Peste 2 zile îți răspund la cea mai mare întrebare pe care o au oamenii despre trading.</p>
      <p style="color:#fff;font-weight:600">Talk soon,<br/>VANDY</p>
    `, 'Iată ce rezultate au obținut membrii Dynasty...')
  };
}

function email4Objections(name: string) {
  return {
    subject: `${name}, asta te oprește?`,
    html: baseTemplate(`
      <h1>Cele mai mari temeri — demontate</h1>
      <p>Salut, ${name}.</p>
      <p>Știu la ce te gândești. Am auzit aceleași lucruri de sute de ori. Și toate sunt <span class="highlight">valide</span> — dar niciuna nu e un motiv real să nu acționezi.</p>

      <div class="card">
        <h2>💬 "Nu am suficienți bani să încep"</h2>
        <p style="margin-bottom:0">Nu ai nevoie de mii de euro. Mulți membri Dynasty au început cu <span class="highlight">100-300€</span>. Important e să înveți să gestionezi riscul, nu să arunci sume mari. <span class="green">Disciplina bate capitalul.</span></p>
      </div>

      <div class="card">
        <h2>💬 "Nu am experiență în trading"</h2>
        <p style="margin-bottom:0">Exact pentru asta există Dynasty. <span class="highlight">Primești analize gata făcute</span>, explicații pas cu pas, și educație continuă. Înveți din mers, cu bani reali, ghidat de profesioniști.</p>
      </div>

      <div class="card">
        <h2>💬 "Am mai fost păcălit de comunități"</h2>
        <p style="margin-bottom:0">Înțeleg perfect. De asta Dynasty are <span class="highlight">track record public</span>. Nu promitem x100 peste noapte. Livrăm <span class="green">consistență, analize de calitate și transparență totală</span>.</p>
      </div>

      <div class="card">
        <h2>💬 "Nu am timp"</h2>
        <p style="margin-bottom:0">Dynasty vine cu <span class="highlight">call-uri clare și concise</span>. Entry, stop loss, take profit — totul în 30 de secunde. Nu trebuie să stai lipit de ecran. <span class="green">5 minute pe zi e suficient.</span></p>
      </div>

      <p>Singurul lucru care te separă de rezultate e <span class="highlight">decizia de a începe</span>.</p>
      <p>Mâine-poimâine îți trimit ceva special. Fii cu ochii pe inbox.</p>
      <p style="color:#fff;font-weight:600">VANDY</p>
    `, 'Cele mai mari temeri despre trading — demontate una câte una.')
  };
}

function email5CTA(name: string) {
  return {
    subject: `🔥 ${name}, e momentul. Intră în Dynasty.`,
    html: baseTemplate(`
      <span class="pill">Ofertă limitată</span>
      <h1>E momentul tău, ${name}.</h1>
      <p>Ai văzut greșelile pe care le fac traderii. Ai văzut rezultatele membrilor Dynasty. Ți-am răspuns la cele mai mari întrebări.</p>
      <p>Acum e <span class="highlight">momentul să iei o decizie</span>.</p>

      <div class="card" style="border-color:#34d399;background:linear-gradient(135deg,#0a0a0a,#111)">
        <div style="text-align:center">
          <h2 style="margin-bottom:4px">DYNASTY</h2>
          <p style="color:#34d399;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px">Cea mai puternică comunitate de trading</p>
        </div>
        <ul>
          <li>Call-uri zilnice pe <span class="highlight">Memecoin, Futures & Spot</span></li>
          <li>Analize tehnice + fundamentale de la traderi cu experiență</li>
          <li>Educație continuă — de la începător la avansat</li>
          <li>Portofoliu de investiții pe termen mediu & lung</li>
          <li>Comunitate privată cu suport 24/7</li>
          <li>Track record transparent și verificabil</li>
        </ul>
      </div>

      <div style="text-align:center;margin:32px 0">
        <a href="${DYNASTY_URL}" class="cta-btn" style="font-size:16px;padding:16px 40px">Intră în Dynasty acum →</a>
        <p style="font-size:12px;color:#525252;margin-top:12px">Locurile sunt limitate pentru a menține calitatea.</p>
      </div>

      <p>Fiecare zi în care amâni e o zi în care <span class="highlight">pierzi oportunități</span> pe care alții le valorifică.</p>
      <p>Ne vedem în Dynasty.</p>
      <p style="color:#fff;font-weight:600;font-size:18px">VANDY 🖤</p>
    `, `${name}, Dynasty te așteaptă. Intră acum.`)
  };
}

export const EMAIL_SCHEDULE: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 6,
  5: 8,
};

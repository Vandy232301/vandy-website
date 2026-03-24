const DYNASTY_URL = 'https://dynasty.vandy.ro/';

function baseTemplate(content, preheader) {
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
  .secondary-btn{display:inline-block;background:transparent;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:50px;text-decoration:none;border:1px solid #333}
  .card{background:#111;border:1px solid #222;border-radius:16px;padding:24px;margin:20px 0}
  .pill{display:inline-block;background:#111;border:1px solid #333;border-radius:50px;padding:6px 14px;font-size:11px;font-weight:700;color:#34d399;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px}
  .footer{text-align:center;padding-top:32px;color:#525252;font-size:12px;line-height:1.6}
  .footer a{color:#525252;text-decoration:underline}
  .preheader{display:none!important;max-height:0;overflow:hidden;mso-hide:all}
  ul{padding-left:0;list-style:none;margin:0}
  ul li{padding:8px 0;font-size:15px;color:#a3a3a3;line-height:1.6}
  ul li::before{content:'\\2192';color:#34d399;font-weight:700;margin-right:10px}
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
    <p>&copy; 2026 VANDY. Toate drepturile rezervate.</p>
    <p>Prime\\u0219ti acest email pentru c\\u0103 te-ai \\u00eenscris pe <a href="https://vandy.ro">vandy.ro</a>.</p>
  </div>
</div>
</body>
</html>`;
}

function email1Welcome(name) {
  return {
    subject: `Bine ai venit, ${name}! Aici incepe totul.`,
    html: baseTemplate(`
      <h1>Salut, ${name}! &#x1F44B;</h1>
      <p>Ma bucur enorm ca ai ales sa faci parte din comunitatea mea. Ai luat una dintre cele mai bune decizii.</p>
      <p>Sunt <span class="highlight">VANDY</span> &mdash; antreprenor in serie, trader si investitor cu peste <span class="highlight">11 ani de experienta</span> in branding strategic, marketing si tehnologie.</p>
      <div class="card">
        <span class="pill">Ce urmeaza</span>
        <p style="margin-bottom:0">In urmatoarele zile vei primi de la mine:</p>
        <ul>
          <li>Lectii pe care le-am invatat din <span class="highlight">mii de trade-uri</span></li>
          <li>Greselile care m-au costat cel mai mult</li>
          <li>Strategii care functioneaza <span class="highlight">acum</span>, nu acum 5 ani</li>
          <li>Cum poti face parte din <span class="highlight">Dynasty</span> &mdash; cea mai puternica comunitate de trading</li>
        </ul>
      </div>
      <p>Intre timp, intra in comunitatea mea <span class="green">gratuita</span> de pe Telegram unde primesti zilnic analize, stiri filtrate si oportunitati:</p>
      <div style="text-align:center;margin:24px 0">
        <a href="https://t.me/VANDY_001_Official" class="cta-btn">Intra pe Telegram gratuit &rarr;</a>
      </div>
      <p>Fii atent la inbox &mdash; urmatorul email vine cu o lectie care a schimbat totul pentru mine.</p>
      <p style="color:#fff;font-weight:600">Talk soon,<br/>VANDY</p>
    `, 'Bine ai venit in comunitate! Iata ce urmeaza...')
  };
}

function email2Value(name) {
  return {
    subject: `${name}, 3 greseli care distrug conturile de trading`,
    html: baseTemplate(`
      <h1>3 greseli fatale pe care le fac 90% din traderi</h1>
      <p>Salut, ${name}.</p>
      <p>Am pierdut bani. Multi. Si nu pentru ca nu aveam strategie &mdash; ci pentru ca <span class="highlight">faceam aceste 3 greseli</span> pe care aproape toata lumea le face.</p>
      <div class="card">
        <h2>&#x274C; Greseala #1: Trading emotional</h2>
        <p style="margin-bottom:0">Intri intr-un trade pentru ca &ldquo;simti&rdquo; ca o sa creasca. Iesi prea devreme din frica. FOMO te face sa cumperi la varf. Solutia? <span class="highlight">Un plan clar INAINTE de a deschide orice pozitie.</span></p>
      </div>
      <div class="card">
        <h2>&#x274C; Greseala #2: Fara risk management</h2>
        <p style="margin-bottom:0">Un singur trade prost poate sterge castigurile din 10 trade-uri bune. Regula mea: <span class="highlight">nu risca niciodata mai mult de 1-2% din portofoliu pe un singur trade.</span></p>
      </div>
      <div class="card">
        <h2>&#x274C; Greseala #3: Informatie de pe TikTok</h2>
        <p style="margin-bottom:0">Urmaresti &ldquo;guru&rdquo; care nu au tranzactionat niciodata cu bani reali. <span class="highlight">Ai nevoie de o comunitate care face bani REAL</span>, nu de influenceri care vand cursuri.</p>
      </div>
      <p>Exact de asta am construit <span class="green">Dynasty</span> &mdash; o comunitate unde fiecare analiza, fiecare call, vine din <span class="highlight">experienta reala</span>.</p>
      <p>In 2 zile iti arat exact ce rezultate au obtinut membrii Dynasty.</p>
      <p style="color:#fff;font-weight:600">Stay sharp,<br/>VANDY</p>
    `, '3 greseli fatale in trading pe care probabil le faci si tu...')
  };
}

function email3SocialProof(name) {
  return {
    subject: `Rezultatele vorbesc de la sine, ${name}`,
    html: baseTemplate(`
      <h1>Ce spun membrii Dynasty</h1>
      <p>Salut, ${name}.</p>
      <p>Pot sa vorbesc cat vreau despre cat de buna e comunitatea Dynasty. Dar <span class="highlight">rezultatele membrilor mei vorbesc mai tare decat orice cuvant.</span></p>
      <div style="text-align:center;margin:24px 0">
        <div class="card" style="display:inline-block;min-width:140px;margin:8px">
          <div class="stat">
            <span class="stat-num">1,200+</span>
            <span class="stat-label">Membrii activi</span>
          </div>
        </div>
        <div class="card" style="display:inline-block;min-width:140px;margin:8px">
          <div class="stat">
            <span class="stat-num">85%</span>
            <span class="stat-label">Win rate call-uri</span>
          </div>
        </div>
        <div class="card" style="display:inline-block;min-width:140px;margin:8px">
          <div class="stat">
            <span class="stat-num">24/7</span>
            <span class="stat-label">Suport &amp; analize</span>
          </div>
        </div>
      </div>
      <div class="card">
        <p><span class="green">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span></p>
        <p><em>&ldquo;Am intrat in Dynasty acum 3 luni cu 500&euro;. Acum sunt la 2,800&euro;. Nu multumesc norocului &mdash; multumesc strategiilor si disciplinei pe care am invatat-o aici.&rdquo;</em></p>
        <p style="color:#fff;font-weight:600;margin-bottom:0">&mdash; Membru Dynasty</p>
      </div>
      <div class="card">
        <p><span class="green">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span></p>
        <p><em>&ldquo;Cea mai buna investitie pe care am facut-o nu a fost intr-un coin &mdash; a fost in comunitatea Dynasty. Calitatea analizelor e de alt nivel.&rdquo;</em></p>
        <p style="color:#fff;font-weight:600;margin-bottom:0">&mdash; Membru Dynasty</p>
      </div>
      <p>Dynasty nu e pentru toata lumea. E pentru cei care vor <span class="highlight">rezultate reale</span>, nu promisiuni goale.</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${DYNASTY_URL}" class="secondary-btn">Afla mai multe despre Dynasty &rarr;</a>
      </div>
      <p>Peste 2 zile iti raspund la cea mai mare intrebare pe care o au oamenii despre trading.</p>
      <p style="color:#fff;font-weight:600">Talk soon,<br/>VANDY</p>
    `, 'Iata ce rezultate au obtinut membrii Dynasty...')
  };
}

function email4Objections(name) {
  return {
    subject: `${name}, asta te opreste?`,
    html: baseTemplate(`
      <h1>Cele mai mari temeri &mdash; demontate</h1>
      <p>Salut, ${name}.</p>
      <p>Stiu la ce te gandesti. Am auzit aceleasi lucruri de sute de ori. Si toate sunt <span class="highlight">valide</span> &mdash; dar niciuna nu e un motiv real sa nu actionezi.</p>
      <div class="card">
        <h2>&#x1F4AC; &ldquo;Nu am suficienti bani sa incep&rdquo;</h2>
        <p style="margin-bottom:0">Nu ai nevoie de mii de euro. Multi membri Dynasty au inceput cu <span class="highlight">100-300&euro;</span>. Important e sa inveti sa gestionezi riscul, nu sa arunci sume mari. <span class="green">Disciplina bate capitalul.</span></p>
      </div>
      <div class="card">
        <h2>&#x1F4AC; &ldquo;Nu am experienta in trading&rdquo;</h2>
        <p style="margin-bottom:0">Exact pentru asta exista Dynasty. <span class="highlight">Primesti analize gata facute</span>, explicatii pas cu pas, si educatie continua. Inveti din mers, cu bani reali, ghidat de profesionisti.</p>
      </div>
      <div class="card">
        <h2>&#x1F4AC; &ldquo;Am mai fost pacalit de comunitati&rdquo;</h2>
        <p style="margin-bottom:0">Inteleg perfect. De asta Dynasty are <span class="highlight">track record public</span>. Nu promitem x100 peste noapte. Livram <span class="green">consistenta, analize de calitate si transparenta totala</span>.</p>
      </div>
      <div class="card">
        <h2>&#x1F4AC; &ldquo;Nu am timp&rdquo;</h2>
        <p style="margin-bottom:0">Dynasty vine cu <span class="highlight">call-uri clare si concise</span>. Entry, stop loss, take profit &mdash; totul in 30 de secunde. Nu trebuie sa stai lipit de ecran. <span class="green">5 minute pe zi e suficient.</span></p>
      </div>
      <p>Singurul lucru care te separa de rezultate e <span class="highlight">decizia de a incepe</span>.</p>
      <p>Maine-poimaine iti trimit ceva special. Fii cu ochii pe inbox.</p>
      <p style="color:#fff;font-weight:600">VANDY</p>
    `, 'Cele mai mari temeri despre trading demontate una cate una.')
  };
}

function email5CTA(name) {
  return {
    subject: `${name}, e momentul. Intra in Dynasty.`,
    html: baseTemplate(`
      <span class="pill">Oferta limitata</span>
      <h1>E momentul tau, ${name}.</h1>
      <p>Ai vazut greselile pe care le fac traderii. Ai vazut rezultatele membrilor Dynasty. Ti-am raspuns la cele mai mari intrebari.</p>
      <p>Acum e <span class="highlight">momentul sa iei o decizie</span>.</p>
      <div class="card" style="border-color:#34d399;background:linear-gradient(135deg,#0a0a0a,#111)">
        <div style="text-align:center">
          <h2 style="margin-bottom:4px">DYNASTY</h2>
          <p style="color:#34d399;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px">Cea mai puternica comunitate de trading</p>
        </div>
        <ul>
          <li>Call-uri zilnice pe <span class="highlight">Memecoin, Futures &amp; Spot</span></li>
          <li>Analize tehnice + fundamentale de la traderi cu experienta</li>
          <li>Educatie continua &mdash; de la incepator la avansat</li>
          <li>Portofoliu de investitii pe termen mediu &amp; lung</li>
          <li>Comunitate privata cu suport 24/7</li>
          <li>Track record transparent si verificabil</li>
        </ul>
      </div>
      <div style="text-align:center;margin:32px 0">
        <a href="${DYNASTY_URL}" class="cta-btn" style="font-size:16px;padding:16px 40px">Intra in Dynasty acum &rarr;</a>
        <p style="font-size:12px;color:#525252;margin-top:12px">Locurile sunt limitate pentru a mentine calitatea.</p>
      </div>
      <p>Fiecare zi in care amani e o zi in care <span class="highlight">pierzi oportunitati</span> pe care altii le valorifica.</p>
      <p>Ne vedem in Dynasty.</p>
      <p style="color:#fff;font-weight:600;font-size:18px">VANDY &#x1F5A4;</p>
    `, `${name}, Dynasty te asteapta. Intra acum.`)
  };
}

const EMAIL_SCHEDULE = {
  1: 0,
  2: 2,
  3: 4,
  4: 6,
  5: 8,
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

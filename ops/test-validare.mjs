/**
 * Regulile formularului de pe /mentorat, trecute prin cazurile care contează.
 * Rulează: npm run test:validare
 *
 * Nu e un framework, e un fișier. Două dintre regulile de mai jos au fost
 * greșite prima oară — pragul de cifre crescătoare respingea 0721234567,
 * un număr perfect valid, iar cel de cifre repetate lăsa să treacă
 * 0700000000. Lista de mai jos le-a prins pe amândouă.
 */
import {
  validNume, validEmail, validTelefon, validDescriere, curataTelefon, formateazaTelefon,
} from '../src/lib/validare.ts';

const cazuri = [
  ['nume', validNume, [
    ['Andrei Popescu', null], ['Ion Popa-Vasilescu', null], ['Ștefan Ioniță', null],
    ["Mihai O'Brien", null], ['Ana Maria Pop', null],
    ['Andrei123', 'EROARE'], ['Andrei', 'EROARE'], ['aaa aaa', 'EROARE'],
    ['asdf qwerty', 'EROARE'], ['test test', 'EROARE'], ['A B', 'EROARE'], ['', 'EROARE'],
  ]],
  ['email', validEmail, [
    ['andrei@gmail.com', null], ['a.b+c@firma.co.uk', null], ['nume@exemplu.ro', null],
    ['andrei@mailinator.com', 'EROARE'], ['andrei@@gmail.com', 'EROARE'],
    ['andrei@gmail', 'EROARE'], ['a..b@gmail.com', 'EROARE'], ['qwerty@gmail.com', 'EROARE'],
  ]],
  ['telefon', validTelefon, [
    ['0721234567', null], ['0721 234 567', null], ['+40721234567', null],
    ['0040721234567', null], ['+33612345678', 'EROARE'], ['+33687452310', null], ['0744444444', null], ['0213334455', null],
    ['0700000000', 'EROARE'], ['0123456789', 'EROARE'], ['07212345', 'EROARE'],
    ['072123456789', 'EROARE'], ['abcdefghij', 'EROARE'], ['', 'EROARE'],
  ]],
  ['descriere', validDescriere, [
    ['Am o firmă de instalații și vreau o aplicație care preia cererile de ofertă.', null],
    ['vreau sa fac bani', 'EROARE'],
    ['asdfasdfasdfasdfasdfasdfasdf', 'EROARE'],
    ['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'EROARE'],
    ['1234567890123456789012345678', 'EROARE'],
  ]],
];

let rele = 0;
for (const [nume, fn, lista] of cazuri) {
  console.log(`\n── ${nume} ──`);
  for (const [intrare, asteptat] of lista) {
    const r = fn(intrare);
    const ok = asteptat === null ? r === null : r !== null;
    if (!ok) rele++;
    console.log(`${ok ? '  ok ' : ' RĂU '} ${JSON.stringify(intrare).padEnd(34)} → ${r ?? 'valid'}`);
  }
}
console.log('\n── normalizare telefon ──');
for (const t of ['0721 234 567', '+40 721 234 567', '0040721234567', '40721234567'])
  console.log(`  ${t.padEnd(18)} → ${curataTelefon(t)}  →  ${formateazaTelefon(t)}`);
console.log(rele === 0 ? '\n✅ toate cazurile trec' : `\n❌ ${rele} cazuri greșite`);
process.exit(rele === 0 ? 0 : 1);

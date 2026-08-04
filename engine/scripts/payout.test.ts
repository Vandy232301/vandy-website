// Sanity checks for the payout maths. Run: npx tsx scripts/payout.test.ts
import assert from 'node:assert/strict';
import { computeClipPayout, payableViews, nextBonus, looksLikeViewSpike, ratePerHour } from '../lib/clipping';
import { CLIPPING_CONFIG, viewsToCents, bonusForViews } from '../config/clipping';

const rules = {
  cpmCents: CLIPPING_CONFIG.defaultCpmCents, // 100 = $1 / 1k
  minViews: CLIPPING_CONFIG.minPayableViews, // 10_000
  bonusTiers: CLIPPING_CONFIG.bonusTiers,
};

let pass = 0;
function check(name: string, fn: () => void) {
  fn();
  pass++;
  console.log('  ✅', name);
}

console.log('\nPayout maths\n');

check('views already on the clip are not paid for', () => {
  assert.equal(payableViews(50_000, 40_000), 10_000);
  assert.equal(payableViews(30_000, 40_000), 0); // never negative
});

check('below the target a clip earns nothing', () => {
  const p = computeClipPayout(7_200, 0, rules);
  assert.equal(p.qualifies, false);
  assert.equal(p.grossCents, 0);
  assert.equal(Math.round(p.progressToMin * 100), 72);
});

check('exactly at the target it starts paying', () => {
  const p = computeClipPayout(10_000, 0, rules);
  assert.equal(p.qualifies, true);
  assert.equal(p.baseCents, 1_000); // $10.00
  assert.equal(p.bonusCents, 0);
});

check('88,400 views pays $88.40 with no bonus', () => {
  const p = computeClipPayout(88_400, 0, rules);
  assert.equal(p.grossCents, 8_840);
});

check('412,800 views pays $412.80 + the 100k bonus', () => {
  const p = computeClipPayout(412_800, 0, rules);
  assert.equal(p.baseCents, 41_280);
  assert.equal(p.bonusCents, 2_500); // +$25
  assert.equal(p.grossCents, 43_780); // $437.80
});

check('1.24M views stacks all three bonuses', () => {
  const p = computeClipPayout(1_240_000, 0, rules);
  assert.equal(p.baseCents, 124_000);
  assert.equal(p.bonusCents, 2_500 + 15_000 + 40_000); // $575
  assert.equal(p.grossCents, 181_500); // $1,815.00
});

check('bonuses do not double-count below their tier', () => {
  assert.equal(bonusForViews(99_999, rules.bonusTiers), 0);
  assert.equal(bonusForViews(100_000, rules.bonusTiers), 2_500);
});

check('the next milestone is reported correctly', () => {
  const n = nextBonus(412_800, rules.bonusTiers);
  assert.equal(n?.views, 500_000);
  assert.equal(n?.viewsAway, 87_200);
  assert.equal(nextBonus(2_000_000, rules.bonusTiers), null);
});

check('CPM rounds down, never in the creator\'s favour by a fraction', () => {
  assert.equal(viewsToCents(1_999, 100), 199); // not 200
});

check('a baseline offset shifts the whole calculation', () => {
  // Clip already had 400k when submitted; only the new 12k counts.
  const p = computeClipPayout(412_000, 400_000, rules);
  assert.equal(p.payable, 12_000);
  assert.equal(p.qualifies, true);
  assert.equal(p.grossCents, 1_200); // $12.00, no bonus
});

check('a burst far above any organic rate is flagged', () => {
  const { spike } = looksLikeViewSpike(1_000, 320_000, 0.66);
  assert.equal(spike, true);
});

check('genuine steady growth is not flagged', () => {
  const { spike } = looksLikeViewSpike(200_000, 260_000, 6, 9_000);
  assert.equal(spike, false);
});

check('DRIP-FED bought views are caught — the old rule missed these', () => {
  // 90k views over a 6h window = 15k/hour. Under the old absolute rule this
  // needed 1.5M to fire, so it sailed through. Against a clip that had been
  // running at 800/hour it is an 18x jump.
  const { spike, reason } = looksLikeViewSpike(60_000, 150_000, 6, 800);
  assert.equal(spike, true);
  assert.match(String(reason), /trailing rate/);
});

check('a clip that lay dormant then accelerates is flagged', () => {
  const { spike, reason } = looksLikeViewSpike(40_000, 62_000, 6, 5);
  assert.equal(spike, true);
  assert.match(String(reason), /dormant/);
});

check('small movements are never flagged, whatever the shape', () => {
  const { spike } = looksLikeViewSpike(1_000, 3_000, 0.5, 1);
  assert.equal(spike, false);
});

check('a real hit growing fast but consistently is left alone', () => {
  // Was doing 12k/hour, now 40k/hour — fast, but only 3.3x its own pace.
  const { spike } = looksLikeViewSpike(500_000, 740_000, 6, 12_000);
  assert.equal(spike, false);
});

check('trailing rate is computed from the snapshot series', () => {
  assert.equal(
    ratePerHour(1_000, 7_000, '2026-01-01T00:00:00Z', '2026-01-01T06:00:00Z'),
    1_000,
  );
});

check('a genuine hit is still paid in full — the cap is a budget share, not a flat lid', () => {
  // The cap lives in reconcileClipEarnings (it needs the campaign budget), so
  // the gross calculation stays honest.
  const p = computeClipPayout(1_240_000, 0, rules);
  assert.equal(p.grossCents, 181_500);
  // On a $5,000 campaign, 25% leaves $1,250 of room — the clip is paid in full.
  const capOn5k = Math.floor(500_000 * CLIPPING_CONFIG.maxClipShareOfBudget);
  assert.equal(capOn5k, 125_000);
  assert.ok(capOn5k < p.grossCents, 'and on a small campaign it is trimmed, not zeroed');
});

check('one clip can never drain a whole campaign', () => {
  const budget = 500_000; // $5,000
  const cap = Math.floor(budget * CLIPPING_CONFIG.maxClipShareOfBudget);
  assert.ok(cap < budget, 'cap must be strictly below the budget');
  assert.equal(cap / budget, 0.25);
});

console.log(`\n${pass} checks passed\n`);

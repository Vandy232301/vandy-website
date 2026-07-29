// Sanity checks for the payout maths. Run: npx tsx scripts/payout.test.ts
import assert from 'node:assert/strict';
import { computeClipPayout, payableViews, nextBonus, looksLikeViewSpike } from '../lib/clipping';
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

check('an impossible view burst is flagged', () => {
  const { spike } = looksLikeViewSpike(1_000, 320_000, 0.66);
  assert.equal(spike, true);
});

check('genuine steady growth is not flagged', () => {
  const { spike } = looksLikeViewSpike(200_000, 260_000, 6);
  assert.equal(spike, false);
});

console.log(`\n${pass} checks passed\n`);

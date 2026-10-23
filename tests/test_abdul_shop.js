const fs = require('fs');
const assert = require('assert');

console.log('====================================================');
console.log('   ABDUL ALL-IN-ONE STORE UI & LOGIC AUDIT SUITE    ');
console.log('====================================================');

const html = fs.readFileSync('public/index.html', 'utf8');
const css = fs.readFileSync('public/css/style.css', 'utf8');
const shopJs = fs.readFileSync('public/js/shop.js', 'utf8');
const worldJs = fs.readFileSync('public/js/world.js', 'utf8');
const world3dJs = fs.readFileSync('public/js/world3d.js', 'utf8');

let passCount = 0;
function test(desc, fn) {
  try {
    fn();
    console.log(`  [PASS] ${desc}`);
    passCount++;
  } catch (e) {
    console.error(`  [FAIL] ${desc}: ${e.message}`);
    process.exit(1);
  }
}

// 1. DOM & Brand Verification
test("Shop Modal contains Abdul's All-in-One Store branding and Hindi subtitle", () => {
  assert(html.includes("Abdul's All-in-One Store"), "Missing English title");
  assert(html.includes("अब्दुल की दुकान"), "Missing Hindi title");
  assert(html.includes("GOKULDHAM SOCIETY • ALL-IN-ONE STORE"), "Missing society store tag");
  assert(html.includes('id="abdulShopQuote"'), "Missing quote text container");
});

test("Shop Modal contains all 4 tabs including Soda & Sweets, Crackers, Diyas, and Decor", () => {
  assert(html.includes('data-category="soda_sweets"'), "Missing soda_sweets tab");
  assert(html.includes('data-category="fireworks"'), "Missing fireworks tab");
  assert(html.includes('data-category="lights"'), "Missing lights tab");
  assert(html.includes('data-category="decor"'), "Missing decor tab");
});

test("Shop Modal contains coin balance pill and Quick Earn Coins button", () => {
  assert(html.includes('id="shopModalCoins"'), "Missing shopModalCoins ID");
  assert(html.includes('id="shopEarnCoinsBtn"'), "Missing shopEarnCoinsBtn ID");
});

// 2. Catalog and Logic Verification
test("shop.js includes Abdul's iconic specials: Masala Jeera Soda, Nimbu Soda, Mithai & Puja Thali", () => {
  assert(shopJs.includes("'jeera_soda'"), "Missing jeera_soda in catalog");
  assert(shopJs.includes("'nimbu_soda'"), "Missing nimbu_soda in catalog");
  assert(shopJs.includes("'mithai_box'"), "Missing mithai_box in catalog");
  assert(shopJs.includes("'motichoor'"), "Missing motichoor in catalog");
  assert(shopJs.includes("'puja_thali'"), "Missing puja_thali in catalog");
});

test("shop.js dynamically updates Abdul's quote banner and owned count pills", () => {
  assert(shopJs.includes('abdulShopQuote'), "abdulShopQuote banner reference missing");
  assert(shopJs.includes('item-owned-count'), "item-owned-count class missing");
  assert(shopJs.includes('✓ Khareed Liya!'), "Visual purchase confirmation missing");
});

// 3. Styling & Mobile Responsiveness
test("style.css contains Abdul Shop glassmorphism card and banner styles", () => {
  assert(css.includes('.abdul-shop-dialog'), "Missing .abdul-shop-dialog");
  assert(css.includes('.abdul-brand-group'), "Missing .abdul-brand-group");
  assert(css.includes('.abdul-greeting-banner'), "Missing .abdul-greeting-banner");
  assert(css.includes('.abdul-items-grid'), "Missing .abdul-items-grid");
  assert(css.includes('.item-owned-pill'), "Missing .item-owned-pill");
});

test("style.css mobile rules ensure 2-column grid and 44px touch targets", () => {
  assert(css.includes('.abdul-items-grid {') && css.includes('grid-template-columns: repeat(2, 1fr) !important;'), "Missing 2-column mobile grid");
  assert(css.includes('.btn-buy {') && css.includes('min-height: 44px !important;'), "Missing 44px mobile touch target");
});

// 4. World Prompts
test("world.js and world3d.js prompts reference Abdul's All-in-One Store", () => {
  assert(worldJs.includes("Abdul's All-in-One Store"), "world.js stall name not updated");
  assert(world3dJs.includes("ABDUL'S ALL-IN-ONE STORE"), "world3d.js signboard not updated");
  assert(world3dJs.includes("Press [E] to Visit Abdul's All-in-One Store"), "world3d.js prompt not updated");
});

console.log('====================================================');
console.log(`TOTAL ABDUL SHOP TESTS: ${passCount} | PASSED: ${passCount} | FAILED: 0`);
console.log('====================================================');

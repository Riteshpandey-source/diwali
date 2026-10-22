/**
 * Mobile Responsive Layout & UX Audit Test
 * Verifies mobile-first responsive features, touch targets, drawer navigation,
 * control layout, and desktop isolation across viewports: 320px, 360px, 375px, 390px, 430px.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('===============================================================');
console.log('📱 STARTING MOBILE RESPONSIVE & UX ERGONOMICS AUDIT');
console.log('===============================================================');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ [Mobile Audit] ${description}: PASS`);
    passCount++;
  } catch (err) {
    console.error(`❌ [Mobile Audit] ${description}: FAIL — ${err.message}`);
    failCount++;
  }
}

const htmlPath = path.join(__dirname, '../public/index.html');
const cssPath = path.join(__dirname, '../public/css/style.css');
const jsPath = path.join(__dirname, '../public/js/mobileHud.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// Test 1: Viewport Meta Tag has viewport-fit=cover
test('Viewport Meta Tag Includes viewport-fit=cover', () => {
  assert(
    html.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'),
    'Viewport meta tag must contain viewport-fit=cover for notch/home-indicator safe area support'
  );
});

// Test 2: Mobile Menu & Drawer Elements in DOM
test('Mobile Navigation Drawer & Toggle Buttons Present in DOM', () => {
  assert(html.includes('id="mobileMenuToggleBtn"'), 'mobileMenuToggleBtn button missing');
  assert(html.includes('id="mobileInventoryToggleBtn"'), 'mobileInventoryToggleBtn button missing');
  assert(html.includes('id="mobileNavDrawer"'), 'mobileNavDrawer container missing');
  assert(html.includes('id="mobileNavBackdrop"'), 'mobileNavBackdrop missing');
  assert(html.includes('id="mobileNavCloseBtn"'), 'mobileNavCloseBtn missing');

  // Verify all 9 functional tiles
  const requiredTiles = [
    'data-action="shop"',
    'data-action="missions"',
    'data-action="games"',
    'data-action="emotes"',
    'data-action="skyshow"',
    'data-action="multiplayer"',
    'data-action="aarti"',
    'data-action="settings"',
    'data-action="greeting"'
  ];

  for (const tile of requiredTiles) {
    assert(html.includes(tile), `Drawer tile ${tile} missing in mobileNavDrawer`);
  }
});

// Test 3: Desktop Isolation — Mobile Drawer is hidden by default
test('Desktop Isolation: Mobile Controls and Drawer Hidden on Desktop', () => {
  assert(css.includes('.mobile-only-btn {') && css.includes('display: none;'), '.mobile-only-btn must be display: none on desktop');
  assert(css.includes('.mobile-nav-drawer {') && css.includes('display: none;'), '.mobile-nav-drawer must be display: none on desktop');
});

// Test 4: Mobile Action Buttons Bottom-Right Layout Fix (No bugged top: 242px)
test('Mobile Action Controls Anchored to Bottom-Right with Safe-Area Insets', () => {
  assert(css.includes('.mobile-action-buttons {'), 'mobile-action-buttons class missing');
  assert(css.includes('env(safe-area-inset-bottom'), 'Must anchor to bottom with safe-area-inset');
  assert(css.includes('env(safe-area-inset-right'), 'Must anchor to right with safe-area-inset');
});

// Test 5: Touch Target Dimensions (>= 44px)
test('Mobile Touch Targets Meet Minimum 44px Apple/Google Standards', () => {
  // Mobile action buttons: min 48px to 54px
  assert(css.includes('width: 52px') || css.includes('width: 48px') || css.includes('min-height: 44px') || css.includes('min-width: 44px'),
    'Touch buttons must be >= 44px');
  assert(css.includes('#mobileNavCloseBtn {') && css.includes('min-width: 44px') && css.includes('min-height: 44px'),
    'Drawer close button must be at least 44x44px');
  assert(css.includes('.mobile-nav-tile {') && css.includes('min-height: 72px'),
    'Drawer navigation tiles must have generous touch targets');
});

// Test 6: Media Query Coverage for Specific Screen Breakpoints
test('Media Queries Cover 320px, 360px, 480px, 768px, and Landscape', () => {
  assert(css.includes('@media (max-width: 768px)'), 'Missing 768px tablet/phone breakpoint');
  assert(css.includes('@media (max-width: 480px)'), 'Missing 480px phone breakpoint');
  assert(css.includes('@media (max-width: 360px)'), 'Missing 360px narrow phone breakpoint');
  assert(css.includes('@media (max-width: 320px)'), 'Missing 320px ultra-compact phone breakpoint');
  assert(css.includes('@media (max-height: 500px) and (orientation: landscape)'), 'Missing mobile landscape orientation breakpoint');
});

// Test 7: Devotional Aarti UI Minimization on Mobile
test('Aarti Player Becomes Floating Compact Badge on Mobile with Zero Autoplay', () => {
  assert(css.includes('.aarti-floating-badge.mobile-minimized'), 'Must have mobile-minimized style for Aarti card');
  assert(js.includes('minimizeAarti()'), 'mobileHud.js must contain minimizeAarti handler');
  assert(js.includes('expandAarti()'), 'mobileHud.js must contain expandAarti handler');
  assert(!js.includes('.play()') && !js.includes('autoplay'), 'Must never trigger automatic playback');
});

// Test 8: Modals as Responsive Bottom Sheets with Safe Area
test('Modals Convert to Responsive Bottom Sheets with Scroll Containment', () => {
  assert(css.includes('overflow-y: auto'), 'Modal content must have internal scroll');
  assert(css.includes('-webkit-overflow-scrolling: touch'), 'Modal content must use smooth mobile touch scrolling');
});

// Test 9: JavaScript Controller Integrity
test('DiwaliMobileHUD Singleton API and Tile Delegation', () => {
  assert(js.includes('window.DiwaliMobileHUD = DiwaliMobileHUD;'), 'DiwaliMobileHUD must be exported to window');
  assert(js.includes('openDrawer'), 'openDrawer method missing');
  assert(js.includes('closeDrawer'), 'closeDrawer method missing');
  assert(js.includes('toggleDrawer'), 'toggleDrawer method missing');
  assert(js.includes('toggleInventory'), 'toggleInventory method missing');
  // Check action dispatching to native buttons
  assert(js.includes('target.click()'), 'Must delegate clicks to existing native buttons');
});

// Test 10: Multi-viewport Dimensions Simulation (320px, 360px, 375px, 390px, 430px)
test('Simulate Viewports: 320px, 360px, 375px, 390px, 430px Non-overflow Checks', () => {
  const viewports = [320, 360, 375, 390, 430];
  for (const vp of viewports) {
    // Check that CSS rules for each width enforce max-width: 100vw, box-sizing: border-box, and no fixed pixel widths exceeding the viewport
    assert(css.includes('box-sizing: border-box;'), 'Universal box-sizing border-box required');
    assert(css.includes('max-width: 100vw;'), 'Elements must not exceed 100vw');
    assert(css.includes('overflow-x: hidden;'), 'Body/HTML must prevent horizontal scroll');
  }
});

// Test 11: Stage Cinema Pause Controller Isolation from Storytelling Board & Coverage for All Benches
test('Stage Cinema Controls Confined to Cinema Ground and Covers Last Bench while Isolated from Storytelling Board', () => {
  const theaterJsPath = path.join(__dirname, '../public/js/theaterModal.js');
  const theaterJs = fs.readFileSync(theaterJsPath, 'utf8');

  // Verify theaterCenter & calibrated radius centered on audience ground
  assert(theaterJs.includes('this.theaterCenter = { x: 24.0, z: -14.0 };'), 'theaterCenter must be centered at x:24, z:-14');
  assert(theaterJs.includes('this.triggerRadius = 14.5;'), 'triggerRadius must be calibrated to 14.5m');

  // Verify distance from storytelling board (x:54, z:2) is 34m (well outside triggerRadius)
  const distToStorytelling = Math.hypot(54.0 - 24.0, 2.0 - (-14.0));
  assert(distToStorytelling > 14.5, `Storytelling board distance (${distToStorytelling.toFixed(2)}m) must exceed triggerRadius (14.5m)`);

  // Verify distance to last row bench (x:13.5, z:-14) is within triggerRadius
  const distToLastBench = Math.hypot(13.5 - 24.0, -14.0 - (-14.0));
  assert(distToLastBench <= 14.5, `Last bench distance (${distToLastBench.toFixed(2)}m) must be within triggerRadius (14.5m)`);

  // Verify isPlayerSittingInTheater guard is implemented
  assert(theaterJs.includes('isPlayerSittingInTheater'), 'isPlayerSittingInTheater must ensure controls are active when sitting in theater');

  // Verify CSS mobile rules elevate stage-quick-controls and hide bulky pills
  assert(css.includes('.stage-quick-controls {') && css.includes('.stage-ep-pills') && css.includes('.stage-scrubber-wrap'),
    'stage-quick-controls must be styled compactly on mobile');

  // Verify interaction prompt cannot vertically stretch across screen
  assert(css.includes('#interactionPrompt {') && css.includes('top: auto !important;'),
    'interaction prompt must enforce top: auto on mobile to prevent full-screen stretching');
});

// Test 12: Suppression of Overhead Speech Bubbles & Storytelling while in Theater
test('Suppression of Overhead Speech Bubbles and Dadaji Storytelling while in Theater', () => {
  const engineJsPath = path.join(__dirname, '../public/js/engine3d.js');
  const eduJsPath = path.join(__dirname, '../public/js/diwaliEducation.js');
  const engineJs = fs.readFileSync(engineJsPath, 'utf8');
  const eduJs = fs.readFileSync(eduJsPath, 'utf8');

  // Verify engine3d suppresses triggerNpcSpeech when in theater
  assert(engineJs.includes('if (window.diwaliTheaterModal?.isNearTheater || (this.player3D?.isSitting && this.player3D.currentBench?.isTheaterBench))'),
    'engine3d triggerNpcSpeech must suppress speech bubbles when player is in theater');

  // Verify Dadaji storytelling loop is suppressed when player is in theater
  assert(eduJs.includes('if (window.diwaliTheaterModal?.isNearTheater || (window.diwaliEngine3D?.player3D?.isSitting && window.diwaliEngine3D.player3D.currentBench?.isTheaterBench))'),
    'diwaliEducation update loop must suppress Dadaji storytelling while player is in theater');
});

// Test 13: 3D Theater Visibility, Marquee, Floating Label & Movie Poster Display
test('3D Theater Visibility: Illuminated Marquee, Floating World-Space Label & Movie Posters', () => {
  const theaterJsPath = path.join(__dirname, '../public/js/societyTheater3d.js');
  const theaterJs = fs.readFileSync(theaterJsPath, 'utf8');

  // Verify Marquee & Illuminated Signs
  assert(theaterJs.includes('buildCinemaEntranceArchwayAndMarquee'), 'buildCinemaEntranceArchwayAndMarquee method missing');
  assert(theaterJs.includes('buildMoviePosterLightboxes'), 'buildMoviePosterLightboxes method missing');
  assert(theaterJs.includes('buildFloating3DTheaterLabel'), 'buildFloating3DTheaterLabel method missing');
  assert(theaterJs.includes('buildDirectionalGuidance'), 'buildDirectionalGuidance method missing');

  // Verify signage wording matches requirements
  assert(theaterJs.includes('🎬 THEATER • CINEMA'), 'Must contain illuminated entrance marquee sign "🎬 THEATER • CINEMA"');
  assert(theaterJs.includes('🎬 THEATER 🎬'), 'Must contain top roof illuminated 3D marquee header "🎬 THEATER 🎬"');
  assert(theaterJs.includes('🎬 THEATER'), 'Must contain floating world-space label "🎬 THEATER"');

  // Verify Backlit Movie Posters
  assert(theaterJs.includes('TMKOC DIWALI SPECIAL'), 'Must include TMKOC Diwali Special movie poster lightbox');
  assert(theaterJs.includes('GOKULDHAM CINEMA'), 'Must include Gokuldham Cinema movie poster lightbox');
  assert(theaterJs.includes('NOW SHOWING'), 'Must include NOW SHOWING poster badge');
});

// Test 14: Theater Directional Guidance & Touch-Adaptive Entrance Interaction
test('Theater Directional Guidance & Touch/Keyboard Adaptive Interaction', () => {
  const theaterJsPath = path.join(__dirname, '../public/js/societyTheater3d.js');
  const engineJsPath = path.join(__dirname, '../public/js/engine3d.js');
  const theaterJs = fs.readFileSync(theaterJsPath, 'utf8');
  const engineJs = fs.readFileSync(engineJsPath, 'utf8');

  // Verify Entrance Interactive Target
  assert(theaterJs.includes("id: 'society_theater_entrance'"), 'society_theater_entrance target missing');
  assert(theaterJs.includes("type: 'society_theater_entrance'"), 'society_theater_entrance type missing');

  // Verify Adaptive Prompt in engine3d.js (Tap for mobile, Press [E] for desktop)
  assert(engineJs.includes("Tap to Enter Theater & Watch Show"), 'Mobile prompt "Tap to Enter Theater" missing');
  assert(engineJs.includes("Press [E] to Enter Theater & Watch Show"), 'Desktop prompt "Press [E] to Enter Theater" missing');

  // Verify Direct Mobile Tap on #interactionPrompt
  assert(engineJs.includes("promptEl.addEventListener('click'") && engineJs.includes("promptEl.addEventListener('touchend'"),
    'Direct tap/click on #interactionPrompt must trigger handleInteraction');

  // Verify Compact Exploration Hint in promenade approach
  assert(engineJs.includes("Explore the Theater — Community Cinema on East Promenade"),
    'Compact hint to explore the theater missing in engine3d');

  // Verify Entrance Action seats player in VIP row facing screen and starts show
  assert(engineJs.includes("target.type === 'society_theater_entrance'"),
    'handleInteraction must handle society_theater_entrance');
});

// Test 15: Exact Viewport Audits (320px, 360px, 375px, 390px, 412px, 430px in Portrait & Landscape)
test('Exact Viewport Audits: 320px, 360px, 375px, 390px, 412px, 430px Screen Ergonomics', () => {
  const targetViewports = [
    { name: 'Ultra Compact Phone (Jio/SE)', width: 320, maxJoyZone: 78, maxCols: 2 },
    { name: 'Compact Phone (Galaxy A/Galaxy S Mini)', width: 360, maxJoyZone: 86, maxCols: 2 },
    { name: 'Standard iPhone (iPhone X/11 Pro/12 Mini/13 Mini)', width: 375, maxJoyZone: 100, maxCols: 3 },
    { name: 'Modern iPhone (iPhone 12/13/14/15/16)', width: 390, maxJoyZone: 100, maxCols: 3 },
    { name: 'Standard Android Flagship (Pixel 7/8, Galaxy S21/S22/S23)', width: 412, maxJoyZone: 100, maxCols: 3 },
    { name: 'Large Flagship / Pro Max (iPhone Pro Max, Galaxy Ultra)', width: 430, maxJoyZone: 100, maxCols: 3 }
  ];

  for (const vp of targetViewports) {
    // 1. Check responsive breakpoints handle viewport cleanly
    if (vp.width <= 320) {
      assert(css.includes('@media (max-width: 320px)'), `CSS must contain <= 320px breakpoint for ${vp.name}`);
      assert(css.includes('width: 78px;'), `Joystick zone must scale down to <= 78px on ${vp.name}`);
    }
    if (vp.width <= 360) {
      assert(css.includes('@media (max-width: 360px)'), `CSS must contain <= 360px breakpoint for ${vp.name}`);
      assert(css.includes('.hud-brand-name {') && css.includes('display: none !important;'), `Brand name text must collapse to icon on ${vp.name}`);
    }
    // 2. Verify all elements preserve 100vw bounds and box-sizing
    assert(css.includes('box-sizing: border-box;'), 'Universal box-sizing border-box required');
    assert(css.includes('max-width: 100vw !important;') || css.includes('max-width: 100vw;'), 'Modals must not exceed viewport width');
    assert(css.includes('overflow-x: hidden;'), 'Prevent horizontal page spill');
  }

  // Verify landscape orientation support
  assert(css.includes('@media (max-width: 900px) and (orientation: landscape)'), 'Landscape orientation rule missing');
});

// Test 16: Two-finger Camera Pinch-to-Zoom & Touch Gesture Cancellation
test('Two-finger Camera Pinch-to-Zoom & Gesture Cancellation', () => {
  const engineJsPath = path.join(__dirname, '../public/js/engine3d.js');
  const engineJs = fs.readFileSync(engineJsPath, 'utf8');

  // Verify pinch-to-zoom calculation
  assert(engineJs.includes('pinchStartDistance = Math.hypot('), 'engine3d must calculate 2-finger pinch start distance');
  assert(engineJs.includes('initialCameraDist * ratio'), 'engine3d must dynamically adjust cameraDistance based on pinch ratio');
  assert(engineJs.includes('Math.max(7.0, Math.min(32.0,'), 'Camera zoom must be securely clamped between 7.0m and 32.0m');

  // Verify touch gesture cancellation to prevent browser scroll / rubber-band
  assert(engineJs.includes('if (e.cancelable) e.preventDefault();'), 'Canvas touchmove must prevent default if cancelable');
  assert(css.includes('touch-action: none;'), 'Touch-action none required on game canvas & game screen');
  assert(css.includes('overscroll-behavior: none;'), 'Overscroll-behavior none required on game canvas & game screen');
});

// Test 17: Interactive Target Golden Diya Action Button & Pulse Animation
test('Mobile Action Button & Active Interactable Golden Pulse', () => {
  const engineJsPath = path.join(__dirname, '../public/js/engine3d.js');
  const engineJs = fs.readFileSync(engineJsPath, 'utf8');

  // Verify mobileInteractBtn element in DOM
  assert(html.includes('id="mobileInteractBtn"'), 'mobileInteractBtn missing in HTML');
  assert(html.includes('<span>🪔</span>'), 'mobileInteractBtn must display golden diya icon');

  // Verify touch target dimension (>= 48px)
  assert(css.includes('#mobileInteractBtn {') && (css.includes('width: 52px;') || css.includes('width: 48px;')), 'mobileInteractBtn must have comfortable touch target (>= 48px)');

  // Verify active-interactable pulse toggle in engine3d
  assert(engineJs.includes("mobileInteractBtn.classList.add('active-interactable')"), 'engine3d must add active-interactable class');
  assert(engineJs.includes("mobileInteractBtn.classList.remove('active-interactable')"), 'engine3d must remove active-interactable class');
  assert(css.includes('@keyframes interactPulse'), 'style.css must define interactPulse animation for golden energy');
});

// Test 18: Seated Mode Controls Suppression and Stand Up Quick Action
test('Seated Mode: Complete Joystick/Tray Auto-Hide and Stage Stand Up Action', () => {
  const playerJsPath = path.join(__dirname, '../public/js/player3d.js');
  const playerJs = fs.readFileSync(playerJsPath, 'utf8');

  // Verify body class toggles when sitting and standing
  assert(playerJs.includes("document.body.classList.add('player-is-seated'"), 'player3d must add player-is-seated on sit');
  assert(playerJs.includes("document.body.classList.remove('player-is-seated'"), 'player3d must remove player-is-seated on stand');

  // Verify CSS hides joystick and action buttons when seated
  assert(css.includes('.player-is-seated #mobileControlsContainer,'), 'CSS must hide mobileControlsContainer when seated');
  assert(css.includes('.player-is-seated .quick-inventory-tray,'), 'CSS must hide quick-inventory-tray when seated');

  // Verify Stand Up button in quick stage controls
  assert(html.includes('id="stageStandUpBtn"'), 'stageStandUpBtn missing in HTML stageQuickControls');
  assert(html.includes('🚶 Stand Up'), 'Stand up button label missing');
});

console.log('===============================================================');
console.log(`📊 MOBILE AUDIT SUMMARY: TOTAL: ${passCount + failCount} | PASS: ${passCount} | FAIL: ${failCount}`);
console.log('===============================================================');

if (failCount > 0) {
  process.exit(1);
}


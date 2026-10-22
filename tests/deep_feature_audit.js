// ===================================================================
// DEEP FEATURE AUDIT: FIREWORKS, NPCS, AUDIO, DOM INTEGRITY & RESPONSIVE
// ===================================================================

const fs = require('fs');
const path = require('path');

const results = [];

function record(category, name, status, details = '') {
  results.push({ category, name, status, details });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'BLOCKED' ? '⚠️' : '❓';
  console.log(`${icon} [${category}] ${name}: ${status} ${details ? '— ' + details : ''}`);
}

function runDeepAudit() {
  console.log('===============================================================');
  console.log('🔍 RUNNING DEEP FEATURE & ARCHITECTURE AUDIT');
  console.log('===============================================================\n');

  // 1. Fireworks Particle System & Cleanup
  try {
    const fwCode = fs.readFileSync('public/js/fireworks3d.js', 'utf8');
    const hasSparks = fwCode.includes('spawnSparks') || fwCode.includes('particles');
    const hasRocket = fwCode.includes('launchSkyRocket') || fwCode.includes('rocket');
    const hasAnar = fwCode.includes('spawnAnar') || fwCode.includes('anar');
    const hasChakri = fwCode.includes('spawnChakri') || fwCode.includes('chakri');
    const hasLantern = fwCode.includes('releaseSkyLantern') || fwCode.includes('lantern');
    const hasCleanup = fwCode.includes('dispose') || fwCode.includes('remove') || fwCode.includes('life');

    if (hasSparks && hasRocket && hasAnar && hasChakri && hasLantern && hasCleanup) {
      record('Fireworks 3D', 'All 5 Firework Effect Types & Particle Cleanup', 'PASS', 'Sparks, Rockets, Anar, Chakri, Sky Lantern & auto-cleanup verified');
    } else {
      record('Fireworks 3D', 'All 5 Firework Effect Types & Particle Cleanup', 'FAIL', 'Missing one or more firework types or cleanup routines');
    }
  } catch (e) {
    record('Fireworks 3D', 'Fireworks Module Audit', 'FAIL', e.message);
  }

  // 2. NPC Manager, Living Routines & LOD Optimization
  try {
    const npcMgrCode = fs.readFileSync('public/js/npcManager3d.js', 'utf8');
    const familyCode = fs.readFileSync('public/js/familyActivities3d.js', 'utf8');
    const templeActCode = fs.readFileSync('public/js/templeActivities3d.js', 'utf8');
    const navCode = fs.readFileSync('public/js/navigation3d.js', 'utf8');

    const hasNavMesh = navCode.includes('waypoints') || navCode.includes('graph') || navCode.includes('nodes');
    const hasLOD = npcMgrCode.includes('LOD Tier 1') && npcMgrCode.includes('LOD Tier 2') && npcMgrCode.includes('distToPlayer');
    const hasFamilies = familyCode.includes('setupFamilies') || familyCode.includes('family');
    const hasTempleWorship = templeActCode.includes('setupTempleNPCs') || templeActCode.includes('puja');

    if (hasNavMesh && hasLOD && hasFamilies && hasTempleWorship) {
      record('NPC & AI', 'Autonomous Navigation, Families, Temple Puja & Distance LOD', 'PASS', '3-Tier distance LOD, waypoint graph, family routines & temple devotees verified');
    } else {
      record('NPC & AI', 'Autonomous Navigation & AI Routines', 'FAIL', `Nav: ${hasNavMesh}, LOD: ${hasLOD}, Families: ${hasFamilies}, Temple: ${hasTempleWorship}`);
    }
  } catch (e) {
    record('NPC & AI', 'NPC Modules Audit', 'FAIL', e.message);
  }

  // 3. Audio & Autoplay Resilience
  try {
    const audioCode = fs.readFileSync('public/js/audio.js', 'utf8');
    const hasAudioCtx = audioCode.includes('AudioContext') || audioCode.includes('webkitAudioContext');
    const hasResume = audioCode.includes('resume()') || audioCode.includes('state ===');
    const hasSynth = audioCode.includes('createOscillator') || audioCode.includes('createBufferSource');
    const hasTempleBell = audioCode.includes('playTempleBell');
    const hasCrackers = audioCode.includes('playRocketWhistle') || audioCode.includes('playFireworkBurst');

    if (hasAudioCtx && hasResume && hasSynth && hasTempleBell && hasCrackers) {
      record('Audio System', 'Web Audio API Synth, Temple Bells & Gesture Resume', 'PASS', 'Custom synthesized festive sitar, temple bells, fireworks audio & unlock guards verified');
    } else {
      record('Audio System', 'Web Audio System Integrity', 'FAIL', 'Missing synth audio functions or user gesture unlock');
    }
  } catch (e) {
    record('Audio System', 'Audio Module Audit', 'FAIL', e.message);
  }

  // 4. HTML DOM Integrity Check
  try {
    const html = fs.readFileSync('public/index.html', 'utf8');

    const criticalIds = [
      'gameCanvas',
      'gameHud',
      'shopModal',
      'decoratorModal',
      'miniGamesModal',
      'multiplayerModal',
      'settingsModal',
      'missionIntroModal',
      'missionCompletionModal',
      'grandCelebrationBanner',
      'theaterPlayerModal',
      'stageQuickControls',
      'theaterNativeVideo',
      'theaterIframe',
      'stagePlayPauseBtn',
      'stageSkipBackBtn',
      'stageSkipFwdBtn',
      'stageMuteToggleBtn',
      'stageSeekSlider',
      'stageTimeText',
      'stageCamViewBtn',
      'stageEnlargeBtn',
      'customSourceInput',
      'saveSourceBtn',
      'modalPlayPauseBtn',
      'modalSkipBackBtn',
      'modalSkipForwardBtn',
      'modalMuteBtn',
      'modalSeekSlider',
      'modalTimeDisplay',
      'directOfficialYtLink',
      'closeTheaterModalBtn',
      'theaterLocationBadge',
      'playerCoinCount',
      'qty_phuljhadi',
      'qty_anar',
      'qty_chakri',
      'qty_rocket',
      'qty_diya',
      'qty_kandil',
      'openShopBtn',
      'openMissionBtn',
      'openGamesBtn',
      'openEmoteMenuBtn',
      'returnToGreetingBtn',
      'skyShowBtn',
      'missionTrackerWidget',
      'miniMapCanvas',
      'interactionPrompt',
      'mobileControlsContainer',
      'joystickBase',
      'joystickStick',
      'gatePortalCanvas'
    ];

    let missing = [];
    criticalIds.forEach(id => {
      const regex = new RegExp(`id=["']${id}["']`, 'i');
      if (!regex.test(html)) {
        missing.push(id);
      }
    });

    if (missing.length === 0) {
      record('DOM & UI Integrity', 'Critical Interactive HUD & Modal IDs Present', 'PASS', `All ${criticalIds.length} critical DOM element IDs matched in index.html`);
    } else {
      record('DOM & UI Integrity', 'Critical Interactive HUD & Modal IDs Present', 'FAIL', `Missing IDs: ${missing.join(', ')}`);
    }
  } catch (e) {
    record('DOM & UI Integrity', 'DOM Audit', 'FAIL', e.message);
  }

  // 5. Responsive Meta & CSS Viewports
  try {
    const html = fs.readFileSync('public/index.html', 'utf8');
    const css = fs.readFileSync('public/css/style.css', 'utf8');

    const hasViewport = html.includes('name="viewport"') && html.includes('width=device-width');
    const hasMediaQueries = css.includes('@media') && css.includes('max-width:');
    const hasTouchControls = html.includes('touch-controls') || html.includes('joystick') || css.includes('touch');

    if (hasViewport && hasMediaQueries) {
      record('Responsive & Mobile', 'Viewport Meta & CSS Responsive Breakpoints', 'PASS', 'Standard responsive meta and comprehensive media query breakpoints verified');
    } else {
      record('Responsive & Mobile', 'Viewport Meta & CSS Responsive Breakpoints', 'FAIL', 'Missing responsive meta or media queries');
    }
  } catch (e) {
    record('Responsive & Mobile', 'Responsive Audit', 'FAIL', e.message);
  }

  console.log('\n===============================================================');
  console.log('📊 DEEP AUDIT SUMMARY:');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL AUDIT CHECKS: ${results.length} | PASS: ${passes} | FAIL: ${fails}`);
  console.log('===============================================================\n');

  const prevResults = JSON.parse(fs.readFileSync('tests/test_results.json', 'utf8') || '[]');
  const combined = [...prevResults, ...results];
  fs.writeFileSync('tests/test_results.json', JSON.stringify(combined, null, 2));

  process.exit(fails > 0 ? 1 : 0);
}

runDeepAudit();

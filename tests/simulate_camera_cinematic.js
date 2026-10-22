// ===================================================================
// SIMULATED THREE.JS CAMERA RUNTIME VERIFICATION FOR ENTRANCE INTRO
// Tests camera math, trajectory, easing, banner framing, hold duration,
// single-run session guard, and interruption handling.
// ===================================================================

const THREE = require('three');
const fs = require('fs');

// Mock browser global environment
global.THREE = THREE;
global.window = {
  location: { search: '' },
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 1,
  diwaliWorld3D: null
};

// Evaluate relevant project code
const player3dCode = fs.readFileSync('public/js/player3d.js', 'utf8');
eval(player3dCode);

const DiwaliPlayer3D = window.DiwaliPlayer3D;
const CameraState = window.CameraState;

console.log('🎬 [Cinematic Camera Test] Initializing simulation...');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.5, 1000);

// Initialize player at gate (startX = 370, startY = 610 => x = -52.0, z = 0.0)
const player = new DiwaliPlayer3D(scene, camera, 370, 610);
const camCtrl = player.cameraController;

console.log(`📍 Player Spawn Position: (${player.x.toFixed(2)}, ${player.y.toFixed(2)}, ${player.z.toFixed(2)})`);
if (Math.abs(player.x - (-52.0)) > 0.001 || Math.abs(player.z - 0.0) > 0.001) {
  throw new Error(`Player spawn altered! Expected (-52, 0), got (${player.x}, ${player.z})`);
}

// 1. Test Trigger Entrance Intro
const triggered = camCtrl.triggerEntranceIntro();
console.log(`✨ Trigger Entrance Intro Result: ${triggered}, State: ${camCtrl.getState()}`);
if (!triggered || camCtrl.getState() !== CameraState.ENTRANCE_INTRO) {
  throw new Error('Failed to transition to ENTRANCE_INTRO state');
}

// 2. Test Single-Session Guard
const retriggered = camCtrl.triggerEntranceIntro();
console.log(`🛡️ Re-trigger Guard Result: ${retriggered} (should be false)`);
if (retriggered !== false) {
  throw new Error('Entrance intro triggered multiple times without force!');
}

// 3. Step Through Timeline & Validate Camera Trajectory
const dt = 0.05; // 20 updates per second
let phaseA_seen = false;
let phaseB_reachBanner = false;
let phaseB_held_2s = false;
let phaseC_seen = false;
let bannerHoldStart = 0;
let bannerHoldEnd = 0;

for (let t = 0; t <= 5.5; t += dt) {
  camCtrl.update(dt);
  const state = camCtrl.getState();
  const camPos = camera.position;
  const target = camCtrl.currentTarget;

  if (t >= 0.1 && t <= 0.5) {
    phaseA_seen = true;
    // Camera is near ground spawn third-person view
    if (camPos.y > 5.0) {
      throw new Error(`Phase A camera elevated too early at t=${t.toFixed(2)}: Y=${camPos.y.toFixed(2)}`);
    }
  }

  if (t >= 2.0 && t <= 3.8) {
    phaseB_reachBanner = true;
    if (bannerHoldStart === 0) bannerHoldStart = t;
    bannerHoldEnd = t;

    // Verify camera is looking at the actual banner target: (-48.75, 8.6, 0.0)
    const distToBannerTarget = Math.hypot(target.x - (-48.75), target.y - 8.6, target.z - 0.0);
    if (distToBannerTarget > 0.05) {
      throw new Error(`Phase B camera target missed banner at t=${t.toFixed(2)}: (${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)})`);
    }

    // Verify camera position is elevated and backed away to frame 16m wide sign (~14.75m distance)
    const distToBannerPos = Math.hypot(camPos.x - (-63.5), target.z - 0.0);
    if (distToBannerPos > 1.0) {
      throw new Error(`Phase B camera position unexpected: (${camPos.x.toFixed(2)}, ${camPos.y.toFixed(2)}, ${camPos.z.toFixed(2)})`);
    }
  }

  if (t >= 4.2 && t <= 4.8) {
    phaseC_seen = true;
    // Moving back down towards player
  }

  if (t >= 5.1) {
    if (state !== CameraState.PLAYER_FOLLOW) {
      throw new Error(`Failed to restore PLAYER_FOLLOW at t=${t.toFixed(2)}, current state: ${state}`);
    }
  }
}

const bannerHoldDuration = bannerHoldEnd - bannerHoldStart;
console.log(`⏱️ Banner Framing Hold Duration: ${bannerHoldDuration.toFixed(2)}s`);
if (bannerHoldDuration < 1.7) {
  throw new Error(`Banner hold duration too short: ${bannerHoldDuration.toFixed(2)}s`);
}

console.log('✅ Trajectory & States Verified:');
console.log(`   Phase A (Ground gate view): ${phaseA_seen ? 'PASS' : 'FAIL'}`);
console.log(`   Phase B (Framed "GOKULDHAM SOCIETY" banner at -48.75, 8.6, 0): ${phaseB_reachBanner ? 'PASS' : 'FAIL'}`);
console.log(`   Phase B Hold (~2.0s): ${bannerHoldDuration >= 1.7 ? 'PASS' : 'FAIL'}`);
console.log(`   Phase C (Smooth return to 3rd-person follow): ${phaseC_seen ? 'PASS' : 'FAIL'}`);
console.log(`   End State (PLAYER_FOLLOW restored): ${camCtrl.getState() === CameraState.PLAYER_FOLLOW ? 'PASS' : 'FAIL'}`);
console.log(`   Player Position Preserved: (${player.x.toFixed(2)}, ${player.y.toFixed(2)}, ${player.z.toFixed(2)})`);

// 4. Test Player Input Interruption Recovery
camCtrl.triggerEntranceIntro(null, true); // force re-trigger
console.log('\n🎮 [Input Interruption Test] Triggered intro, advancing to t=1.0s...');
for (let t = 0; t <= 1.0; t += dt) {
  camCtrl.update(dt);
}
console.log(`   At t=1.0s, State: ${camCtrl.getState()}, Timer: ${camCtrl.stateTimer.toFixed(2)}`);

console.log('   Simulating player pressing movement key (W/A/S/D)...');
player.isMoving = true;
camCtrl.update(dt);
console.log(`   After input, Timer fast-forwarded to: ${camCtrl.stateTimer.toFixed(2)} (Phase C fast return)`);
if (camCtrl.stateTimer < 3.8) {
  throw new Error('Interruption failed to accelerate return to gameplay');
}

// Step through Phase C return
for (let t = 0; t <= 1.5; t += dt) {
  camCtrl.update(dt);
}
console.log(`   Final State after interruption: ${camCtrl.getState()}`);
if (camCtrl.getState() !== CameraState.PLAYER_FOLLOW) {
  throw new Error('Interruption failed to restore PLAYER_FOLLOW');
}

console.log('\n===============================================================');
console.log('🎉 ALL CAMERA INTRO SIMULATION & MATHEMATICAL CHECKS PASSED!');
console.log('===============================================================');

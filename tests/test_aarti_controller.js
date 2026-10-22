// ===================================================================
// UNIT & SIMULATION TEST FOR MANDIR AARTI DEVOTIONAL CONTROLLER
// Validates state transitions, user controls, volume clamping,
// single-stream stream protection, proximity detection, and YouTube link.
// ===================================================================

const fs = require('fs');

// Mock browser DOM environment
class MockElement {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName;
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c)
    };
    this.textContent = '';
    this.value = '75';
    this.innerHTML = '';
    this.listeners = {};
    this.volume = 0.75;
    this.currentTime = 0;
    this.src = '';
  }

  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  appendChild(el) {
    // no-op
  }

  play() {
    return Promise.resolve();
  }

  pause() {
    // no-op
  }
}

const domElements = {
  aartiMusicCard: new MockElement('aartiMusicCard'),
  aartiCardBody: new MockElement('aartiCardBody'),
  aartiFloatingBadge: new MockElement('aartiFloatingBadge'),
  aartiBadgePlayIndicator: new MockElement('aartiBadgePlayIndicator'),
  aartiMinimizeBtn: new MockElement('aartiMinimizeBtn', 'button'),
  aartiMinimizeIcon: new MockElement('aartiMinimizeIcon', 'span'),
  aartiPlayBtn: new MockElement('aartiPlayBtn', 'button'),
  aartiPlayIcon: new MockElement('aartiPlayIcon', 'span'),
  aartiPlayText: new MockElement('aartiPlayText', 'span'),
  aartiStopBtn: new MockElement('aartiStopBtn', 'button'),
  aartiMuteBtn: new MockElement('aartiMuteBtn', 'button'),
  aartiVolumeSlider: new MockElement('aartiVolumeSlider', 'input'),
  aartiVolumeIcon: new MockElement('aartiVolumeIcon', 'span'),
  aartiVolumeValue: new MockElement('aartiVolumeValue', 'span'),
  aartiStatusDot: new MockElement('aartiStatusDot', 'span'),
  aartiStatusText: new MockElement('aartiStatusText', 'span'),
  aartiYtDirectLink: new MockElement('aartiYtDirectLink', 'a'),
  aartiPlayerHost: new MockElement('aartiPlayerHost'),
  aartiYtFrameWrapper: new MockElement('aartiYtFrameWrapper'),
  aartiLocalAudio: new MockElement('aartiLocalAudio', 'audio')
};

global.document = {
  getElementById: (id) => domElements[id] || null,
  querySelector: () => null,
  createElement: (tag) => new MockElement('created_' + tag, tag),
  getElementsByTagName: () => [{ parentNode: { insertBefore: () => {} } }],
  head: { appendChild: () => {} }
};

global.window = {
  location: { origin: 'http://localhost:3000' },
  document: global.document,
  diwaliEngine: { showToastNotice: () => {} }
};

// Evaluate aartiController.js
const code = fs.readFileSync('public/js/aartiController.js', 'utf8');
eval(code);

console.log('🪔 [Aarti Controller Test] Starting test suite...');

const ctrl = new window.DiwaliAartiController();

// 1. Initial State Check
console.log(`1. Initial state: ${ctrl.state} (Expected: STOPPED)`);
console.log(`   User interacted: ${ctrl.hasUserInteracted} (Expected: false)`);
console.log(`   YouTube Video ID: ${ctrl.ytVideoId} (Expected: SyqgAt-T0iQ)`);
console.log(`   YouTube Direct URL: ${ctrl.ytUrl}`);
if (ctrl.state !== 'STOPPED' || ctrl.hasUserInteracted !== false || ctrl.ytVideoId !== 'SyqgAt-T0iQ') {
  throw new Error('Initial state validation failed');
}

// 2. User Playback Actions
console.log('2. Testing user play() action...');
ctrl.play();
if (ctrl.state !== 'PLAYING' || ctrl.hasUserInteracted !== true) {
  throw new Error(`Expected PLAYING state, got: ${ctrl.state}`);
}
console.log(`   State after play(): ${ctrl.state}, Play button text: ${domElements.aartiPlayText.textContent}`);

console.log('3. Testing user pause() action...');
ctrl.pause();
if (ctrl.state !== 'PAUSED') {
  throw new Error(`Expected PAUSED state, got: ${ctrl.state}`);
}
console.log(`   State after pause(): ${ctrl.state}, Play button text: ${domElements.aartiPlayText.textContent}`);

console.log('4. Testing user stop() action...');
ctrl.stop();
if (ctrl.state !== 'STOPPED') {
  throw new Error(`Expected STOPPED state, got: ${ctrl.state}`);
}
console.log(`   State after stop(): ${ctrl.state}, Play button text: ${domElements.aartiPlayText.textContent}`);

// 5. Volume Controls & Clamping
console.log('5. Testing volume slider and bounds clamping...');
ctrl.setVolume(50);
if (ctrl.volume !== 50 || domElements.aartiVolumeValue.textContent !== '50%') {
  throw new Error(`Volume update failed: ${ctrl.volume}`);
}
ctrl.setVolume(150);
if (ctrl.volume !== 100) {
  throw new Error(`Upper volume clamp failed: ${ctrl.volume}`);
}
ctrl.setVolume(-20);
if (ctrl.volume !== 0) {
  throw new Error(`Lower volume clamp failed: ${ctrl.volume}`);
}
ctrl.setVolume(80);
console.log(`   Volume set & clamped cleanly: ${ctrl.volume}%`);

// 6. Mute Toggle
console.log('6. Testing mute toggle...');
const muted = ctrl.toggleMute();
if (!muted || !ctrl.isMuted) throw new Error('Mute toggle failed to enable mute');
const unmuted = ctrl.toggleMute();
if (unmuted || ctrl.isMuted) throw new Error('Mute toggle failed to disable mute');
console.log('   Mute / unmute verified');

// 7. Minimize / Expand Toggle
console.log('7. Testing minimize / expand card toggle...');
ctrl.toggleMinimize();
if (!ctrl.isMinimized || !domElements.aartiMusicCard.classList.contains('minimized')) {
  throw new Error('Minimize toggle failed');
}
ctrl.toggleMinimize();
if (ctrl.isMinimized || domElements.aartiMusicCard.classList.contains('minimized')) {
  throw new Error('Expand toggle failed');
}
console.log('   Minimize & expand verified');

// 8. Proximity Detection (Entrance & Temple)
console.log('8. Testing spatial proximity detection...');
// At society gate spawn (-52, 0)
ctrl.updateProximity(-52.0, 0.0);
if (!ctrl.isNearEntrance) {
  throw new Error('Failed to detect entrance proximity at (-52, 0)');
}
console.log(`   Near Entrance at (-52, 0): ${ctrl.isNearEntrance}`);

// At temple (70, 8)
ctrl.updateProximity(70.0, 8.0);
if (!ctrl.isNearTemple) {
  throw new Error('Failed to detect temple proximity at (70, 8)');
}
console.log(`   Near Temple at (70, 8): ${ctrl.isNearTemple}`);

// 9. Single-Stream Temple Integration Protection
console.log('9. Testing temple puja single-stream protection...');
ctrl.play(); // Start playback
console.log(`   Currently state: ${ctrl.state}`);
// Trigger temple aarti while playing: must not duplicate or interrupt
ctrl.onTempleAartiStarted('player');
if (ctrl.state !== 'PLAYING') {
  throw new Error('Temple aarti interrupted existing playback');
}
console.log('   Temple aarti safely maintained single playback stream without duplicate audio');

console.log('\n===============================================================');
console.log('🎉 ALL AARTI CONTROLLER TESTS PASSED SUCCESSFULLY!');
console.log('===============================================================');

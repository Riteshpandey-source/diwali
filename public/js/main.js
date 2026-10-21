// ========================================================
// DIWALI VIRTUAL WORLD - MASTER BOOTSTRAPPER & UI WIRING
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('✨ Shubh Deepawali - Initializing Virtual World ✨');

  // 1. Audio Unlock Notice on First Interaction
  const audioNotice = document.getElementById('audioNotice');
  const unlockAudio = () => {
    window.festiveAudio.ensureContext();
    if (audioNotice) audioNotice.classList.add('hidden');
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);

  // 2. Audio Mute Toggle Button
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const isMuted = window.festiveAudio.toggleMute();
      if (audioIcon) {
        audioIcon.textContent = isMuted ? '🔇' : '🔊';
      }
      if (isMuted) {
        audioToggleBtn.classList.add('muted');
      } else {
        audioToggleBtn.classList.remove('muted');
      }
    });
  }

  // 3. Settings Modal
  const settingsBtn = document.getElementById('settingsModalBtn');
  const settingsModal = document.getElementById('settingsModal');
  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => {
      settingsModal.classList.remove('hidden');
    });
  }

  document.querySelectorAll('[data-close="settingsModal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (settingsModal) settingsModal.classList.add('hidden');
    });
  });

  // Volume slider
  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      window.festiveAudio.setVolume(parseFloat(e.target.value));
    });
  }

  // Sound FX toggle
  const checkSoundEffects = document.getElementById('checkSoundEffects');
  if (checkSoundEffects) {
    checkSoundEffects.addEventListener('change', (e) => {
      window.festiveAudio.fxEnabled = e.target.checked;
    });
  }

  // Ambient music toggle
  const checkFestiveMusic = document.getElementById('checkFestiveMusic');
  if (checkFestiveMusic) {
    checkFestiveMusic.addEventListener('change', (e) => {
      window.festiveAudio.musicEnabled = e.target.checked;
      if (e.target.checked) {
        window.festiveAudio.startFestiveAmbientMusic();
      } else {
        window.festiveAudio.stopFestiveAmbientMusic();
      }
    });
  }

  // Reduced motion toggle
  const checkReducedMotion = document.getElementById('checkReducedMotion');
  if (checkReducedMotion) {
    checkReducedMotion.addEventListener('change', (e) => {
      if (window.diwaliFireworks) {
        window.diwaliFireworks.setReducedMotion(e.target.checked);
      }
    });
  }

  // FPS Counter toggle
  const checkShowFps = document.getElementById('checkShowFps');
  if (checkShowFps) {
    checkShowFps.addEventListener('change', (e) => {
      if (window.diwaliEngine) {
        window.diwaliEngine.showFps = e.target.checked;
      }
    });
  }

  // 4. Sky Fireworks Show Button
  const skyShowBtn = document.getElementById('skyShowBtn');
  if (skyShowBtn) {
    skyShowBtn.addEventListener('click', () => {
      window.festiveAudio.ensureContext();
      if (window.diwaliFireworks) {
        window.diwaliFireworks.startSkyFireworksShow(20000);
      }
    });
  }

  // 5. Sync player name when sender name changes in greeting
  const senderInput = document.getElementById('senderInput');
  if (senderInput) {
    senderInput.addEventListener('input', (e) => {
      const name = e.target.value.trim();
      if (name && window.diwaliPlayer) {
        window.diwaliPlayer.name = name;
        const mpNameDisplay = document.getElementById('mpPlayerNameDisplay');
        if (mpNameDisplay) mpNameDisplay.textContent = name;
      }
    });
  }

  // Auto-set initial player name from greeting controller
  setTimeout(() => {
    if (window.greetingController && window.greetingController.senderName && window.diwaliPlayer) {
      if (window.greetingController.senderName !== 'Your Well Wisher') {
        window.diwaliPlayer.name = window.greetingController.senderName;
        const mpNameDisplay = document.getElementById('mpPlayerNameDisplay');
        if (mpNameDisplay) mpNameDisplay.textContent = window.greetingController.senderName;
      }
    }
  }, 300);

  console.log('🪔 Shubh Deepawali System Ready! May your life be illuminated with joy!');
});

// ========================================================
// DIWALI GREETING PAGE INTERACTION & CUSTOMIZATION
// ========================================================

class GreetingController {
  constructor() {
    this.canvas = document.getElementById('greetingCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.sparkles = [];
    this.litDiyas = new Set();
    this.totalDiyas = 5;
    this.senderName = 'Your Well Wisher';
    this.recipientName = 'My Dear Friend';
  }

  init() {
    this.setupParams();
    this.setupCanvas();
    this.setupDiyaAltar();
    this.setupSharing();
    this.setupScreenSwitching();
    this.animateBackground();
  }

  setupParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    const toParam = urlParams.get('to');

    if (fromParam) this.senderName = decodeURIComponent(fromParam).substring(0, 30);
    if (toParam) this.recipientName = decodeURIComponent(toParam).substring(0, 30);

    const senderInput = document.getElementById('senderInput');
    const recipientInput = document.getElementById('recipientInput');
    if (senderInput) senderInput.value = this.senderName !== 'Your Well Wisher' ? this.senderName : '';
    if (recipientInput) recipientInput.value = this.recipientName !== 'My Dear Friend' ? this.recipientName : '';

    this.updateGreetingText();
  }

  updateGreetingText() {
    const sDisplay = document.getElementById('senderDisplay');
    const rDisplay = document.getElementById('recipientDisplay');
    if (sDisplay) sDisplay.textContent = this.senderName;
    if (rDisplay) rDisplay.textContent = this.recipientName;
  }

  setupCanvas() {
    if (!this.canvas) return;
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed sparkles
    this.sparkles = [];
    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) {
      this.sparkles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2.5 + 1,
        speedY: -Math.random() * 0.4 - 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        hue: Math.random() > 0.3 ? 42 : 12 // Golden or saffron embers
      });
    }
  }

  animateBackground() {
    if (!this.ctx) return;
    const render = () => {
      // Only render if greeting screen is active
      const screen = document.getElementById('greetingScreen');
      if (screen && screen.classList.contains('active')) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let s of this.sparkles) {
          s.y += s.speedY;
          s.x += s.speedX;
          s.alpha += Math.sin(Date.now() * s.pulseSpeed) * 0.01;

          if (s.y < -10) {
            s.y = this.canvas.height + 10;
            s.x = Math.random() * this.canvas.width;
          }

          this.ctx.beginPath();
          this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          this.ctx.fillStyle = `hsla(${s.hue}, 95%, 65%, ${Math.max(0.1, Math.min(1, s.alpha))})`;
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = `hsla(${s.hue}, 95%, 55%, 0.8)`;
          this.ctx.fill();
        }
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  setupDiyaAltar() {
    const diyaElements = document.querySelectorAll('.diya-item');
    const counterDisplay = document.getElementById('diyasLitCount');
    const blessingBanner = document.getElementById('altarBlessingBanner');

    diyaElements.forEach((diya) => {
      diya.addEventListener('click', () => {
        window.festiveAudio.ensureContext();
        const index = diya.getAttribute('data-index');

        if (!this.litDiyas.has(index)) {
          this.litDiyas.add(index);
          diya.classList.add('lit');
          window.festiveAudio.playDiyaChime();

          if (counterDisplay) {
            counterDisplay.textContent = this.litDiyas.size;
          }

          // Check if all are lit
          if (this.litDiyas.size === this.totalDiyas) {
            if (blessingBanner) {
              blessingBanner.classList.remove('hidden');
            }
            window.festiveAudio.playTempleBell();
            
            // Auto earn coins for virtual world!
            if (window.diwaliShop) {
              window.diwaliShop.addCoins(50, 'Sacred Diya Lighting Blessing');
            }
          }
        }
      });
    });
  }

  setupSharing() {
    const updateBtn = document.getElementById('updateGreetingBtn');
    const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');
    const copyLinkBtn = document.getElementById('copyShareLinkBtn');
    const toast = document.getElementById('shareToast');

    const showToast = (msg) => {
      if (!toast) return;
      toast.textContent = msg;
      setTimeout(() => {
        toast.textContent = '';
      }, 3500);
    };

    const getShareUrl = () => {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('from', this.senderName);
      url.searchParams.set('to', this.recipientName);
      return url.toString();
    };

    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        const sVal = document.getElementById('senderInput').value.trim();
        const rVal = document.getElementById('recipientInput').value.trim();
        this.senderName = sVal || 'Your Well Wisher';
        this.recipientName = rVal || 'My Dear Friend';
        this.updateGreetingText();

        const newUrl = getShareUrl();
        window.history.replaceState({}, '', newUrl);
        showToast('✨ Personalized greeting updated! You can now share this custom link.');
      });
    }

    if (shareWhatsAppBtn) {
      shareWhatsAppBtn.addEventListener('click', () => {
        const url = getShareUrl();
        const text = `🪔 *Shubh Deepawali Wishes!* ✨\n\nWishing you and your family infinite joy, health, and prosperity!\n\nOpen your personalized festive greeting & step into the 3D Diwali Virtual Colony:\n${url}`;
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
      });
    }

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        const url = getShareUrl();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            showToast('🔗 Shareable link copied to clipboard!');
          }).catch(() => {
            showToast(`Copy link: ${url}`);
          });
        } else {
          showToast(`Copy link: ${url}`);
        }
      });
    }
  }

  enterGokuldhamSociety() {
    window.festiveAudio.ensureContext();
    window.festiveAudio.playTempleBell();
    window.festiveAudio.startFestiveAmbientMusic();

    const portal = document.getElementById('gokuldhamGatePortal');
    if (portal) {
      portal.classList.add('entering-gate');
    }

    const doSwitch = () => {
      document.getElementById('greetingScreen').classList.remove('active');
      document.getElementById('gameScreen').classList.add('active');

      if (portal) portal.classList.remove('entering-gate');

      // Stop gate portal 3D loop to free GPU and prevent dual WebGL renderer contention
      if (window.diwaliGatePortal3D && typeof window.diwaliGatePortal3D.stop === 'function') {
        window.diwaliGatePortal3D.stop();
      }

      // Initialize virtual world game engine
      if (window.diwaliEngine && !window.diwaliEngine.isRunning) {
        window.diwaliEngine.start();
      }

      // Welcome message toast during gate banner reveal (concise duration to prevent obstructing scenery)
      setTimeout(() => {
        if (window.diwaliSocietyInteractions) {
          window.diwaliSocietyInteractions.showToast('✨ Welcome to Gokuldham Society! Shubh Deepawali! ✨', 3200);
        }
      }, 1000);

      // Show Mission Introduction after entrance banner cinematic concludes (~5.2s)
      if (window.diwaliMission && !window.diwaliMission.state.started) {
        setTimeout(() => {
          window.diwaliMission.openIntroModal();
        }, 5300);
      }
    };

    if (window.diwaliGatePortal3D && window.diwaliGatePortal3D.isRunning) {
      window.diwaliGatePortal3D.triggerGateEntranceAnimation(() => {
        doSwitch();
      });
    } else {
      setTimeout(doSwitch, 380);
    }
  }

  setupScreenSwitching() {
    const enterWorldBtn = document.getElementById('enterWorldBtn');
    const returnToGreetingBtn = document.getElementById('returnToGreetingBtn');
    const gatePortal = document.getElementById('gokuldhamGatePortal');

    if (enterWorldBtn) {
      enterWorldBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.enterGokuldhamSociety();
      });
    }

    if (gatePortal) {
      gatePortal.addEventListener('click', (e) => {
        // If clicked on input or button, let button handle
        if (e.target.closest('button')) return;
        this.enterGokuldhamSociety();
      });
    }

    if (returnToGreetingBtn) {
      returnToGreetingBtn.addEventListener('click', () => {
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('greetingScreen').classList.add('active');
        if (window.diwaliGatePortal3D) {
          window.diwaliGatePortal3D.start();
        }
      });
    }

    // Auto-enter world immediately if room invite or play mode is set in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('room') || urlParams.has('play') || urlParams.get('mode') === 'world') {
      const gScreen = document.getElementById('greetingScreen');
      const gmScreen = document.getElementById('gameScreen');
      if (gScreen) gScreen.classList.remove('active');
      if (gmScreen) gmScreen.classList.add('active');
      if (window.diwaliGatePortal3D && typeof window.diwaliGatePortal3D.stop === 'function') {
        window.diwaliGatePortal3D.stop();
      }
      if (window.diwaliEngine && !window.diwaliEngine.isRunning) {
        window.diwaliEngine.start();
      }
    }
  }
}

// Instantiate and initialize
window.greetingController = new GreetingController();
window.addEventListener('DOMContentLoaded', () => {
  window.greetingController.init();
});

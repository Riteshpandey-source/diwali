// ===================================================================
// DIWALI SOCIETY MANDIR AARTI DEVOTIONAL CONTROLLER
// Dedicated single-instance playback controller for Diwali Lakshmi Aarti
// Reference: Anuradha Paudwal - Om Jai Lakshmi Mata (T-Series)
// YouTube: https://youtu.be/SyqgAt-T0iQ (ID: SyqgAt-T0iQ)
// Provides user-controlled playback, YouTube embedding with fallback,
// optional local audio support, volume controls, and temple synchronization.
// ===================================================================

class DiwaliAartiController {
  constructor() {
    this.ytVideoId = 'SyqgAt-T0iQ';
    this.ytUrl = 'https://youtu.be/SyqgAt-T0iQ';
    this.trackTitle = 'ॐ जय लक्ष्मी माता';
    this.artist = 'Anuradha Paudwal • T-Series';
    this.localAudioSrc = 'assets/audio/aarti_lakshmi.mp3';

    // Playback State: 'STOPPED' | 'PLAYING' | 'PAUSED'
    this.state = 'STOPPED';
    this.volume = 75; // 0 - 100
    this.isMuted = false;
    this.isMinimized = false;
    this.hasUserInteracted = false;

    // Stream instances (guaranteed single playback stream)
    this.ytPlayer = null;
    this.ytIframe = null;
    this.ytApiReady = false;
    this.ytEmbedError = false;
    this.localAudio = null;
    this.activeSourceType = 'none'; // 'youtube' | 'local' | 'external' | 'none'

    // Proximity flags
    this.isNearEntrance = true;
    this.isNearTemple = false;

    // Cache DOM Elements on initialization
    this.initDOM();
  }

  initDOM() {
    if (typeof document === 'undefined') return;

    this.card = document.getElementById('aartiMusicCard');
    this.cardBody = document.getElementById('aartiCardBody');
    this.badge = document.getElementById('aartiFloatingBadge');
    this.badgeIndicator = document.getElementById('aartiBadgePlayIndicator');
    this.minimizeBtn = document.getElementById('aartiMinimizeBtn');
    this.minimizeIcon = document.getElementById('aartiMinimizeIcon');

    this.playBtn = document.getElementById('aartiPlayBtn');
    this.playIcon = document.getElementById('aartiPlayIcon');
    this.playText = document.getElementById('aartiPlayText');
    this.stopBtn = document.getElementById('aartiStopBtn');
    this.muteBtn = document.getElementById('aartiMuteBtn');
    this.volumeSlider = document.getElementById('aartiVolumeSlider');
    this.volumeIcon = document.getElementById('aartiVolumeIcon');
    this.volumeValue = document.getElementById('aartiVolumeValue');

    this.statusDot = document.getElementById('aartiStatusDot');
    this.statusText = document.getElementById('aartiStatusText');
    this.directLink = document.getElementById('aartiYtDirectLink');
    this.playerHost = document.getElementById('aartiPlayerHost');
    this.ytFrameWrapper = document.getElementById('aartiYtFrameWrapper');
    this.localAudio = document.getElementById('aartiLocalAudio');

    this.bindEvents();
    this.setupYouTubeAPI();

    // Check if optional local audio file exists
    if (this.localAudio) {
      this.localAudio.volume = this.volume / 100;
      this.localAudio.addEventListener('ended', () => {
        this.stop();
      });
      this.localAudio.addEventListener('error', () => {
        // Local audio not present or errored; gracefully fallback to YouTube stream
        this.localAudio = null;
      });
    }
  }

  bindEvents() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        if (this.state === 'PLAYING') {
          this.pause();
        } else {
          this.play();
        }
      });
    }

    if (this.stopBtn) {
      this.stopBtn.addEventListener('click', () => {
        this.stop();
      });
    }

    if (this.minimizeBtn) {
      this.minimizeBtn.addEventListener('click', () => {
        this.toggleMinimize();
      });
    }

    if (this.badge) {
      this.badge.addEventListener('click', () => {
        this.toggleMinimize();
      });
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.setVolume(val);
      });
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        this.toggleMute();
      });
    }
  }

  setupYouTubeAPI() {
    // If YouTube IFrame API script is already loaded or requested
    if (window.YT && window.YT.Player) {
      this.ytApiReady = true;
      return;
    }

    // Lazy load the YouTube IFrame API only if document is present
    if (typeof document !== 'undefined') {
      const existingTag = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingTag) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(tag, firstScript);
        } else {
          document.head.appendChild(tag);
        }
      }

      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        this.ytApiReady = true;
        if (typeof prevOnReady === 'function') prevOnReady();
        if (this.hasUserInteracted && this.state === 'PLAYING') {
          this.createYouTubePlayer();
        }
      };
    }
  }

  createYouTubePlayer() {
    if (this.ytPlayer) return;

    // Check if YT is defined
    if (window.YT && window.YT.Player && this.ytFrameWrapper) {
      try {
        const container = document.createElement('div');
        container.id = 'aartiYtPlayerTarget';
        this.ytFrameWrapper.innerHTML = '';
        this.ytFrameWrapper.appendChild(container);

        this.ytPlayer = new window.YT.Player('aartiYtPlayerTarget', {
          height: '140',
          width: '240',
          videoId: this.ytVideoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (e) => {
              this.activeSourceType = 'youtube';
              e.target.setVolume(this.isMuted ? 0 : this.volume);
              if (this.state === 'PLAYING') {
                e.target.playVideo();
              }
            },
            onStateChange: (e) => {
              if (window.YT && window.YT.PlayerState) {
                if (e.data === window.YT.PlayerState.PLAYING) {
                  this.updateState('PLAYING');
                } else if (e.data === window.YT.PlayerState.PAUSED) {
                  this.updateState('PAUSED');
                } else if (e.data === window.YT.PlayerState.ENDED) {
                  this.updateState('STOPPED');
                }
              }
            },
            onError: (e) => {
              console.warn('[DiwaliAartiController] YouTube Player event error:', e.data);
              this.ytEmbedError = true;
              this.handleEmbeddingFallback();
            }
          }
        });
        return;
      } catch (err) {
        console.warn('[DiwaliAartiController] Error initializing YouTube player:', err);
      }
    }

    // Direct Iframe fallback with postMessage API
    this.createIframeFallback();
  }

  createIframeFallback() {
    if (!this.ytFrameWrapper) return;
    this.ytFrameWrapper.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.id = 'aartiDirectIframe';
    iframe.width = '240';
    iframe.height = '140';
    iframe.src = `https://www.youtube-nocookie.com/embed/${this.ytVideoId}?enablejsapi=1&autoplay=1&origin=${encodeURIComponent(window.location.origin)}`;
    iframe.title = 'Diwali Lakshmi Aarti';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = false;
    this.ytFrameWrapper.appendChild(iframe);
    this.ytIframe = iframe;
    this.activeSourceType = 'youtube';

    // Show embedded frame inside the host
    if (this.playerHost) {
      this.playerHost.classList.remove('hidden');
    }
    this.updateState('PLAYING');
  }

  handleEmbeddingFallback() {
    // If YouTube restricts embedding for this music video (e.g. copyright 101/150),
    // provide clear guidance with direct YouTube link
    if (this.statusText) {
      this.statusText.textContent = 'Stream on YouTube ↗';
    }
    if (this.statusDot) {
      this.statusDot.className = 'status-dot warning';
    }
    if (this.directLink) {
      this.directLink.classList.add('highlight-link');
    }
    if (window.diwaliEngine && typeof window.diwaliEngine.showToastNotice === 'function') {
      window.diwaliEngine.showToastNotice('🪔 Click "Listen on YouTube" to hear Anuradha Paudwal\'s Lakshmi Aarti');
    }
  }

  // -------------------------------------------------------------
  // USER PLAYBACK CONTROLS
  // -------------------------------------------------------------

  play() {
    this.hasUserInteracted = true;
    this.updateState('PLAYING');

    // 1. If a local audio file was provided and can play
    if (this.localAudio && this.localAudio.src && !this.localAudio.error) {
      try {
        this.localAudio.volume = this.isMuted ? 0 : this.volume / 100;
        const playPromise = this.localAudio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.activeSourceType = 'local';
            return;
          }).catch(() => {
            // Fallback to YouTube
            this.playYouTube();
          });
          return;
        }
      } catch (e) {
        this.playYouTube();
        return;
      }
    }

    // 2. Play via YouTube
    this.playYouTube();
  }

  playYouTube() {
    if (!this.ytPlayer) {
      this.createYouTubePlayer();
      return;
    }

    try {
      if (typeof this.ytPlayer.playVideo === 'function') {
        this.ytPlayer.playVideo();
        this.activeSourceType = 'youtube';
      } else if (this.ytIframe && this.ytIframe.contentWindow) {
        this.ytIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
      }
    } catch (e) {
      console.warn('[DiwaliAartiController] Error triggering playVideo:', e);
      this.handleEmbeddingFallback();
    }
  }

  pause() {
    this.updateState('PAUSED');

    if (this.localAudio && this.activeSourceType === 'local') {
      try {
        this.localAudio.pause();
      } catch (e) {}
    }

    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch (e) {}
    } else if (this.ytIframe && this.ytIframe.contentWindow) {
      try {
        this.ytIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
      } catch (e) {}
    }
  }

  stop() {
    this.updateState('STOPPED');

    if (this.localAudio) {
      try {
        this.localAudio.pause();
        this.localAudio.currentTime = 0;
      } catch (e) {}
    }

    if (this.ytPlayer && typeof this.ytPlayer.stopVideo === 'function') {
      try {
        this.ytPlayer.stopVideo();
      } catch (e) {}
    } else if (this.ytIframe && this.ytIframe.contentWindow) {
      try {
        this.ytIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'stopVideo', args: [] }), '*');
      } catch (e) {}
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(100, Number(val) || 75));
    if (this.volumeValue) {
      this.volumeValue.textContent = `${this.volume}%`;
    }

    const effectiveVol = this.isMuted ? 0 : this.volume;

    if (this.localAudio) {
      try {
        this.localAudio.volume = effectiveVol / 100;
      } catch (e) {}
    }

    if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(effectiveVol);
      } catch (e) {}
    } else if (this.ytIframe && this.ytIframe.contentWindow) {
      try {
        this.ytIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [effectiveVol] }), '*');
      } catch (e) {}
    }

    this.updateVolumeUI();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    this.updateVolumeUI();
    return this.isMuted;
  }

  updateVolumeUI() {
    if (this.volumeIcon) {
      if (this.isMuted || this.volume === 0) {
        this.volumeIcon.textContent = '🔇';
      } else if (this.volume < 45) {
        this.volumeIcon.textContent = '🔉';
      } else {
        this.volumeIcon.textContent = '🔊';
      }
    }
  }

  updateState(newState) {
    this.state = newState;

    if (this.playIcon && this.playText) {
      if (this.state === 'PLAYING') {
        this.playIcon.textContent = '⏸';
        this.playText.textContent = 'Pause';
      } else if (this.state === 'PAUSED') {
        this.playIcon.textContent = '▶';
        this.playText.textContent = 'Resume';
      } else {
        this.playIcon.textContent = '▶';
        this.playText.textContent = 'Play Aarti';
      }
    }

    if (this.statusDot && this.statusText) {
      this.statusDot.className = 'status-dot';
      if (this.state === 'PLAYING') {
        this.statusDot.classList.add('playing');
        this.statusText.textContent = 'Playing Aarti';
      } else if (this.state === 'PAUSED') {
        this.statusDot.classList.add('paused');
        this.statusText.textContent = 'Paused';
      } else {
        this.statusDot.classList.add('stopped');
        this.statusText.textContent = 'Ready to Play';
      }
    }

    if (this.badgeIndicator) {
      if (this.state === 'PLAYING') {
        this.badgeIndicator.classList.add('active');
      } else {
        this.badgeIndicator.classList.remove('active');
      }
    }
  }

  // -------------------------------------------------------------
  // CARD MINIMIZE & PROXIMITY VISIBILITY
  // -------------------------------------------------------------

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;

    if (this.card) {
      if (this.isMinimized) {
        this.card.classList.add('minimized');
      } else {
        this.card.classList.remove('minimized');
      }
    }

    if (this.badge) {
      if (this.isMinimized) {
        this.badge.classList.remove('hidden');
      } else {
        this.badge.classList.add('hidden');
      }
    }

    if (this.minimizeIcon) {
      this.minimizeIcon.textContent = this.isMinimized ? '+' : '−';
    }
  }

  showCard() {
    if (this.card) {
      this.card.classList.remove('hidden');
    }
    if (this.badge && !this.isMinimized) {
      this.badge.classList.add('hidden');
    }
  }

  hideCard() {
    if (this.card) {
      this.card.classList.add('hidden');
    }
    if (this.badge) {
      this.badge.classList.add('hidden');
    }
  }

  // Update proximity based on 3D Player coordinates
  updateProximity(playerX, playerZ) {
    // 1. Entrance Gate zone: x around -48.0, z around 0.0
    const entranceDist = Math.hypot(playerX - (-48.0), playerZ);
    this.isNearEntrance = entranceDist < 30.0;

    // 2. Temple zone: x around 70.0, z around 8.0
    const templeDist = Math.hypot(playerX - 70.0, playerZ - 8.0);
    this.isNearTemple = templeDist < 26.0;

    // At the entrance or near temple, ensure the card or badge is available
    if (this.isNearEntrance || this.isNearTemple) {
      if (this.isMinimized) {
        if (this.badge) this.badge.classList.remove('hidden');
        if (this.card) this.card.classList.add('hidden');
      } else {
        if (this.card) this.card.classList.remove('hidden');
        if (this.badge) this.badge.classList.add('hidden');
      }
    }
  }

  // Hook for when a player starts temple puja interaction
  onTempleAartiStarted(source = 'player') {
    // If Aarti is already playing, prevent duplicate audio stream!
    if (this.state === 'PLAYING') {
      return;
    }

    // Expand the card so user can easily start or observe the Aarti
    if (this.isMinimized) {
      this.toggleMinimize();
    }
    this.showCard();

    if (this.statusText && this.state !== 'PLAYING') {
      this.statusText.textContent = 'Temple Puja • Press Play for Aarti';
    }
  }

  // Support local audio file source customization
  setLocalAudioSource(src) {
    this.localAudioSrc = src;
    if (this.localAudio) {
      this.localAudio.src = src;
    }
  }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
  window.DiwaliAartiController = DiwaliAartiController;
  window.diwaliAartiController = new DiwaliAartiController();
}

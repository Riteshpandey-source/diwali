// ===================================================================
// TMKOC HAPPY DIWALI THEATER - VIDEO PLAYBACK & MODAL CONTROLLER
// Direct in-page HTML5 Video playback of official TMKOC Diwali Special,
// synchronized 3D stage screen projection, responsive cinema controls,
// episode switching, and guaranteed playback right here!
// ===================================================================

class DiwaliTheaterModal {
  constructor() {
    // Curated TMKOC Diwali Episodes (Full Uncut 20+ Minute Television Episodes)
    this.episodes = {
      ep53: {
        id: 'ep53',
        num: 'Ep 53 (Full Episode)',
        title: 'TMKOC • Ep 53: Gokuldham Diwali Laxmi Pujan',
        subtitle: 'Iconic Diwali Celebration & Comedy (Full Episode)',
        desc: 'Jethalal, Daya, Champaklal, and the entire Gokuldham society celebrate their very first iconic Diwali celebration with Laxmi Pujan, festive sweets, and family laughter.',
        videoSrc: 'assets/videos/tmkoc_ep53_full.mp4',
        durationSec: 1456,
        ytUrl: 'https://youtu.be/-j9CKPlPhnU?si=zY8XdtEpkIEVAvjD',
        ytId: '-j9CKPlPhnU'
      },
      ep2598: {
        id: 'ep2598',
        num: 'Ep 2598 (Full Episode)',
        title: 'TMKOC • Ep 2598: Bhai Dooj & Popatlal Ke Patakhe',
        subtitle: 'Bhai Dooj Full Movie • Gokuldham Society Grand Diwali (Full Episode)',
        desc: 'Popatlal brings fireworks to Gokuldham society while Jethalal, Champaklal, and the Tapu Sena celebrate Diwali and Bhai Dooj with the entire society.',
        videoSrc: 'assets/videos/tmkoc_ep2598_full.mp4',
        durationSec: 1788,
        ytUrl: 'https://youtu.be/u-KvFuXWiwE?si=LUUdEIXgW4IdRei0',
        ytId: 'u-KvFuXWiwE'
      },
      ep247: {
        id: 'ep247',
        num: 'Ep 247 (Full Episode)',
        title: 'TMKOC • Ep 247: Classic Gokuldham Diwali',
        subtitle: 'Babita Ka Naya Phone & Society Celebration (Full Episode)',
        desc: 'Taarak Mehta recites festive Diwali poetry while Jethalal relishes fresh hot jalebi fafda and the society distributes sweets.',
        videoSrc: 'assets/videos/tmkoc_ep247_full.mp4',
        durationSec: 1302,
        ytUrl: 'https://youtu.be/ZCC6fnxA8RY?si=GcL-IpnLAMn-Z6Og',
        ytId: 'ZCC6fnxA8RY'
      },
      ep3604: {
        id: 'ep3604',
        num: 'Ep 3604 (Full Episode)',
        title: 'TMKOC • Ep 3604: Gokuldham Deepotsav',
        subtitle: 'Rangoli Pratiyogita & Colorful Illumination (Full Episode)',
        desc: 'Mahila Mandal decorates the society ground with intricate rangoli patterns while Abdul helps illuminate the compound with fairy lights.',
        videoSrc: 'assets/videos/tmkoc_ep3604_full.mp4',
        durationSec: 1221,
        ytUrl: 'https://www.youtube.com/watch?v=oK331RRfQac',
        ytId: 'oK331RRfQac'
      },
      ep4231: {
        id: 'ep4231',
        num: 'Ep 4231 (Full Episode)',
        title: 'TMKOC • Ep 4231: Diwali Ki Taiyyari',
        subtitle: 'Grand Society Garba & Dazzling Sky Fireworks (Full Episode)',
        desc: 'All Gokuldham families gather in traditional festive attire for late-night garba, chakri, and magnificent sky shots.',
        videoSrc: 'assets/videos/tmkoc_ep4231_full.mp4',
        durationSec: 1190,
        ytUrl: 'https://youtu.be/2FuThuwrqeg?si=iSErQOa2HTPNJyB5',
        ytId: '2FuThuwrqeg'
      }
    };

    this.activeEpisodeKey = 'ep53';
    this.currentEp = this.episodes.ep53;

    // Playback State
    this.isOpen = false;
    this.theaterCenter = { x: 24.0, z: -14.0 };
    this.triggerRadius = 14.5;
    this.isNearTheater = false;

    // Cache DOM Elements
    this.modal = document.getElementById('theaterPlayerModal');
    this.video = document.getElementById('theaterNativeVideo');
    if (this.video) {
      this.video.loop = true;
      this.video.muted = false;
      this.video.volume = 1.0;
    }
    this.iframe = document.getElementById('theaterIframe');
    this.playOverlay = document.getElementById('theaterPlayOverlay');
    this.bigPlayBtn = document.getElementById('theaterBigPlayBtn');
    this.playPauseBtn = document.getElementById('modalPlayPauseBtn');
    this.skipBackBtn = document.getElementById('modalSkipBackBtn');
    this.skipForwardBtn = document.getElementById('modalSkipForwardBtn');
    this.skipIndicator = document.getElementById('theaterSkipIndicator');
    this.skipText = document.getElementById('theaterSkipText');
    this.muteBtn = document.getElementById('modalMuteBtn');
    this.seekSlider = document.getElementById('modalSeekSlider');
    this.timeDisplay = document.getElementById('modalTimeDisplay');
    this.fullscreenBtn = document.getElementById('modalFullscreenBtn');
    this.directYtLink = document.getElementById('directOfficialYtLink');
    this.locationBadge = document.getElementById('theaterLocationBadge');

    // Stage Quick Controls Elements
    this.stageVideoHost = document.getElementById('stageVideoHost');
    this.theaterVideoWrapper = document.getElementById('theaterVideoWrapper');
    this.stageQuickControls = document.getElementById('stageQuickControls');
    this.stagePlayPauseBtn = document.getElementById('stagePlayPauseBtn');
    this.stagePlayPauseIcon = document.getElementById('stagePlayPauseIcon');
    this.stagePlayPauseText = document.getElementById('stagePlayPauseText');
    this.stageSkipBackBtn = document.getElementById('stageSkipBackBtn');
    this.stageSkipFwdBtn = document.getElementById('stageSkipFwdBtn');
    this.stageMuteToggleBtn = document.getElementById('stageMuteToggleBtn');
    this.stageMuteIcon = document.getElementById('stageMuteIcon');
    this.stageMuteText = document.getElementById('stageMuteText');
    this.stageSeekSlider = document.getElementById('stageSeekSlider');
    this.stageTimeText = document.getElementById('stageTimeText');
    this.stageEnlargeBtn = document.getElementById('stageEnlargeBtn');

    this.initVideoEventListeners();
    this.initControlsListeners();
    this.initYouTubePlayer();

    // Auto-bind to 3D theater screen if ready
    setTimeout(() => {
      if (window.diwaliWorld3D?.societyTheater?.bindVideoTexture && this.video) {
        window.diwaliWorld3D.societyTheater.bindVideoTexture(this.video);
      }
    }, 600);
  }

  // Initialize YouTube Iframe API for Real-Time Seek & Controls Sync
  initYouTubePlayer() {
    if (this.ytPlayer) return;

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      try {
        this.ytPlayer = new window.YT.Player('theaterIframe', {
          events: {
            onReady: (event) => {
              this.isYtReady = true;
              if (this.isOpen) {
                try { event.target.playVideo(); } catch (_) {}
              }
            },
            onStateChange: (event) => {
              // 1 = PLAYING, 2 = PAUSED
              if (event.data === 1) {
                this.isIframePaused = false;
                if (this.playPauseBtn) this.playPauseBtn.innerHTML = '<span class="ctrl-icon">⏸</span>';
                if (this.stagePlayPauseIcon) this.stagePlayPauseIcon.textContent = '⏸️';
                if (this.stagePlayPauseText) this.stagePlayPauseText.textContent = 'PAUSE';
                if (this.stagePlayPauseBtn) this.stagePlayPauseBtn.classList.remove('paused');
              } else if (event.data === 2) {
                this.isIframePaused = true;
                if (this.playPauseBtn) this.playPauseBtn.innerHTML = '<span class="ctrl-icon">▶</span>';
                if (this.stagePlayPauseIcon) this.stagePlayPauseIcon.textContent = '▶️';
                if (this.stagePlayPauseText) this.stagePlayPauseText.textContent = 'RESUME';
                if (this.stagePlayPauseBtn) this.stagePlayPauseBtn.classList.add('paused');
              }
            }
          }
        });
      } catch (err) {
        console.warn('YT Player init failed:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        createPlayer();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    }

    // Polling interval to keep scrub slider and time display 100% in sync with YouTube
    if (!this.ytTimeInterval) {
      this.ytTimeInterval = setInterval(() => {
        if (this.isOpen && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
          try {
            const cur = this.ytPlayer.getCurrentTime() || 0;
            const dur = (typeof this.ytPlayer.getDuration === 'function' && this.ytPlayer.getDuration() > 0)
              ? this.ytPlayer.getDuration()
              : (this.currentEp?.durationSec || 1455);
            if (!this.isUserSeeking) {
              if (this.seekSlider) this.seekSlider.value = cur;
              if (this.stageSeekSlider) this.stageSeekSlider.value = cur;
            }
            this.updateTimeDisplay(cur, dur);
            // Synchronize 3D stage screen video element playhead
            if (this.video && Math.abs((this.video.currentTime || 0) - cur) > 2) {
              try { this.video.currentTime = cur; } catch (_) {}
            }
          } catch (_) {}
        }
      }, 500);
    }
  }

  initVideoEventListeners() {
    if (!this.video) return;

    // When video starts playing
    this.video.addEventListener('play', () => {
      if (this.playPauseBtn) {
        this.playPauseBtn.innerHTML = '<span class="ctrl-icon">⏸</span>';
      }
      if (this.stagePlayPauseIcon) this.stagePlayPauseIcon.textContent = '⏸️';
      if (this.stagePlayPauseText) this.stagePlayPauseText.textContent = 'PAUSE';
      if (this.stagePlayPauseBtn) this.stagePlayPauseBtn.classList.remove('paused');
      if (this.playOverlay) {
        this.playOverlay.classList.add('hidden');
      }
      // Inform 3D theater screen to bind video texture if ready
      if (window.diwaliWorld3D?.societyTheater?.bindVideoTexture) {
        window.diwaliWorld3D.societyTheater.bindVideoTexture(this.video);
      }
    });

    // When video pauses
    this.video.addEventListener('pause', () => {
      if (this.playPauseBtn) {
        this.playPauseBtn.innerHTML = '<span class="ctrl-icon">▶</span>';
      }
      if (this.stagePlayPauseIcon) this.stagePlayPauseIcon.textContent = '▶️';
      if (this.stagePlayPauseText) this.stagePlayPauseText.textContent = 'RESUME';
      if (this.stagePlayPauseBtn) this.stagePlayPauseBtn.classList.add('paused');
      if (this.playOverlay && this.isOpen) {
        this.playOverlay.classList.remove('hidden');
      }
    });

    // Time update (advancing playhead)
    this.video.addEventListener('timeupdate', () => {
      if (!this.video) return;

      const cur = this.video.currentTime || 0;
      const fullDur = this.currentEp?.durationSec || 1455;

      // Update sliders unless user is actively dragging them
      if (!this.isUserSeeking) {
        if (this.seekSlider) this.seekSlider.value = cur;
        if (this.stageSeekSlider) this.stageSeekSlider.value = cur;
      }
      this.updateTimeDisplay(cur, fullDur);
    });

    // Loaded metadata
    this.video.addEventListener('loadedmetadata', () => {
      const fullDur = this.currentEp?.durationSec || 1455;
      if (this.seekSlider) this.seekSlider.max = fullDur;
      if (this.stageSeekSlider) this.stageSeekSlider.max = fullDur;
      this.updateTimeDisplay(this.video ? this.video.currentTime : 0, fullDur);
    });

    // Loop video on end
    this.video.addEventListener('ended', () => {
      this.video.currentTime = 0;
      this.video.play().catch(() => {});
    });

    // Click on video directly to toggle play/pause
    this.video.addEventListener('click', () => {
      this.togglePlayPause();
    });
  }

  initControlsListeners() {
    // 1. Close Modal
    const closeBtn = document.getElementById('closeTheaterModalBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeTheaterModal());

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeTheaterModal();
      });
    }

    // Keyboard Shortcuts: Space=Play/Pause (Push/Resume), Arrows/J/L=Skip 10s, M=Mute
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen && !this.isNearTheater) return;

      if (e.key === 'Escape' && this.isOpen) {
        this.closeTheaterModal();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        this.seekRelative(10);
      } else if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        this.seekRelative(-10);
      } else if (e.key === 'm' || e.key === 'M') {
        this.toggleMute();
      } else if (e.key === 'v' || e.key === 'V') {
        if (window.diwaliPlayer3D && typeof window.diwaliPlayer3D.toggleTheaterCamView === 'function') {
          window.diwaliPlayer3D.toggleTheaterCamView();
        }
      }
    });

    // 2. Play / Pause Buttons
    if (this.bigPlayBtn) {
      this.bigPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlayPause();
      });
    }
    if (this.playOverlay) {
      this.playOverlay.addEventListener('click', () => this.togglePlayPause());
    }
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    }

    // 3. Skip 10 Seconds Backward & Forward Buttons
    if (this.skipBackBtn) {
      this.skipBackBtn.addEventListener('click', () => this.seekRelative(-10));
    }
    if (this.skipForwardBtn) {
      this.skipForwardBtn.addEventListener('click', () => this.seekRelative(10));
    }

    // 4. Mute / Unmute
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => this.toggleMute());
    }

    // 5. Seek Slider
    if (this.seekSlider) {
      this.isUserSeeking = false;
      this.seekSlider.addEventListener('mousedown', () => { this.isUserSeeking = true; });
      this.seekSlider.addEventListener('touchstart', () => { this.isUserSeeking = true; }, { passive: true });

      const onSeekInput = (e) => {
        const val = parseFloat(e.target.value);
        if (Number.isFinite(val)) {
          if (this.isOpen && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
            try { this.ytPlayer.seekTo(val, true); } catch (_) {}
          } else if (this.video) {
            this.video.currentTime = val;
          }
          this.updateTimeDisplay(val, this.currentEp?.durationSec || 1455);
        }
      };

      this.seekSlider.addEventListener('input', onSeekInput);
      this.seekSlider.addEventListener('change', onSeekInput);

      this.seekSlider.addEventListener('mouseup', () => { this.isUserSeeking = false; });
      this.seekSlider.addEventListener('touchend', () => { this.isUserSeeking = false; });
    }

    // 6. Fullscreen Toggle
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // 6. Episode Tabs (Modal Tabs)
    const epTabs = document.querySelectorAll('.ep-tab');
    epTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const epKey = tab.getAttribute('data-ep');
        if (epKey && this.episodes[epKey]) {
          epTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const stagePills = document.querySelectorAll('.stage-pill');
          stagePills.forEach(p => {
            if (p.getAttribute('data-ep') === epKey) p.classList.add('active');
            else p.classList.remove('active');
          });
          this.switchEpisode(epKey);
        }
      });
    });

    // 7. Stage Quick Controls Listeners (Push / Resume directly from Ground)
    if (this.stagePlayPauseBtn) {
      this.stagePlayPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlayPause();
      });
    }

    if (this.stageSkipBackBtn) {
      this.stageSkipBackBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.seekRelative(-10);
      });
    }

    if (this.stageSkipFwdBtn) {
      this.stageSkipFwdBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.seekRelative(10);
      });
    }

    if (this.stageMuteToggleBtn) {
      this.stageMuteToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMute();
      });
    }

    if (this.stageEnlargeBtn) {
      this.stageEnlargeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openTheaterModal();
      });
    }

    const camViewBtn = document.getElementById('stageCamViewBtn');
    if (camViewBtn) {
      camViewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.diwaliPlayer3D && typeof window.diwaliPlayer3D.toggleTheaterCamView === 'function') {
          window.diwaliPlayer3D.toggleTheaterCamView();
        }
      });
    }

    const stageStandUpBtn = document.getElementById('stageStandUpBtn');
    if (stageStandUpBtn) {
      stageStandUpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = window.diwaliPlayer3D || window.diwaliEngine3D?.player3D || window.diwaliEngine?.player3D;
        if (p && typeof p.standUp === 'function') {
          p.standUp();
        }
      });
    }

    if (this.stageSeekSlider) {
      const onStageSeek = (e) => {
        const val = parseFloat(e.target.value);
        if (Number.isFinite(val)) {
          if (this.isOpen && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
            try { this.ytPlayer.seekTo(val, true); } catch (_) {}
          } else if (this.video) {
            this.video.currentTime = val;
          }
          this.updateTimeDisplay(val, this.currentEp?.durationSec || 1455);
        }
      };
      this.stageSeekSlider.addEventListener('mousedown', () => { this.isUserSeeking = true; });
      this.stageSeekSlider.addEventListener('touchstart', () => { this.isUserSeeking = true; }, { passive: true });
      this.stageSeekSlider.addEventListener('input', onStageSeek);
      this.stageSeekSlider.addEventListener('change', onStageSeek);
      this.stageSeekSlider.addEventListener('mouseup', () => { this.isUserSeeking = false; });
      this.stageSeekSlider.addEventListener('touchend', () => { this.isUserSeeking = false; });
    }

    const stagePills = document.querySelectorAll('.stage-pill');
    stagePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const epKey = pill.getAttribute('data-ep');
        if (epKey && this.episodes[epKey]) {
          stagePills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          epTabs.forEach(t => {
            if (t.getAttribute('data-ep') === epKey) t.classList.add('active');
            else t.classList.remove('active');
          });
          this.switchEpisode(epKey);
          this.openTheaterModal();
        }
      });
    });

    const modalYtBtn = document.getElementById('theaterModalYtBtn');
    if (modalYtBtn) {
      modalYtBtn.addEventListener('click', () => this.openOfficialYouTube());
    }

    // 9. Custom Source Configuration Form
    const toggleConfigBtn = document.getElementById('toggleSourceConfigBtn');
    const configPanel = document.getElementById('theaterSourceConfigPanel');
    const saveSourceBtn = document.getElementById('saveSourceBtn');
    const sourceInput = document.getElementById('customSourceInput');

    if (toggleConfigBtn && configPanel) {
      toggleConfigBtn.addEventListener('click', () => {
        configPanel.classList.toggle('hidden');
      });
    }

    if (saveSourceBtn && sourceInput) {
      saveSourceBtn.addEventListener('click', () => {
        const val = sourceInput.value.trim();
        if (val) {
          this.setCustomVideoSource(val);
        }
      });
    }
  }

  // Toggle Video Play / Pause (Push / Resume)
  togglePlayPause() {
    // If modal is open with active YouTube iframe, toggle YouTube playback
    if (this.isOpen && this.iframe && !this.iframe.classList.contains('hidden') && this.iframe.contentWindow) {
      if (this.isIframePaused) {
        try {
          this.iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
        } catch (_) {}
        this.isIframePaused = false;
        if (this.playPauseBtn) this.playPauseBtn.innerHTML = '<span class="ctrl-icon">⏸</span>';
        if (this.stagePlayPauseIcon) this.stagePlayPauseIcon.textContent = '⏸️';
        if (this.stagePlayPauseText) this.stagePlayPauseText.textContent = 'PAUSE';
        if (this.stagePlayPauseBtn) this.stagePlayPauseBtn.classList.remove('paused');
        if (window.diwaliEngine && typeof window.diwaliEngine.showToastNotice === 'function') {
          window.diwaliEngine.showToastNotice('▶️ Full Episode Resumed');
        }
      } else {
        try {
          this.iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
        } catch (_) {}
        this.isIframePaused = true;
        if (this.playPauseBtn) this.playPauseBtn.innerHTML = '<span class="ctrl-icon">▶</span>';
        if (this.stagePlayPauseIcon) this.stagePlayPauseIcon.textContent = '▶️';
        if (this.stagePlayPauseText) this.stagePlayPauseText.textContent = 'RESUME';
        if (this.stagePlayPauseBtn) this.stagePlayPauseBtn.classList.add('paused');
        if (window.diwaliEngine && typeof window.diwaliEngine.showToastNotice === 'function') {
          window.diwaliEngine.showToastNotice('⏸️ Full Episode Paused');
        }
      }
      return;
    }

    if (!this.video) return;

    if (this.video.paused) {
      // Ensure sound is enabled and unmuted on explicit user play
      this.video.muted = false;
      this.video.volume = 1.0;
      if (this.stageMuteIcon) this.stageMuteIcon.textContent = '🔊';
      if (this.stageMuteText) this.stageMuteText.textContent = 'Sound';
      if (this.muteBtn) this.muteBtn.innerHTML = '<span class="ctrl-icon">🔊</span>';

      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error / autoplay blocked, attempting muted fallback:', err);
          // If browser requires muted initial play, start muted and unmute immediately
          this.video.muted = true;
          this.video.play().then(() => {
            setTimeout(() => {
              this.video.muted = false;
              this.video.volume = 1.0;
              if (this.stageMuteIcon) this.stageMuteIcon.textContent = '🔊';
              if (this.stageMuteText) this.stageMuteText.textContent = 'Sound';
            }, 150);
          }).catch(() => {});
        });
      }
      if (window.diwaliEngine && typeof window.diwaliEngine.showToastNotice === 'function') {
        window.diwaliEngine.showToastNotice('▶️ Video Resumed • Sound Playing on Stage');
      }
    } else {
      this.video.pause();
      if (window.diwaliEngine && typeof window.diwaliEngine.showToastNotice === 'function') {
        window.diwaliEngine.showToastNotice('⏸️ Video Paused (Push) • Click Screen or Press Space to Resume');
      }
    }
  }

  // Toggle Mute / Unmute
  toggleMute() {
    if (!this.video) return;

    this.video.muted = !this.video.muted;
    if (this.video.muted) {
      this.video.volume = 0;
    } else {
      this.video.volume = 1.0;
    }

    if (this.muteBtn) {
      this.muteBtn.innerHTML = this.video.muted
        ? '<span class="ctrl-icon">🔇</span>'
        : '<span class="ctrl-icon">🔊</span>';
    }
    if (this.stageMuteIcon) {
      this.stageMuteIcon.textContent = this.video.muted ? '🔇' : '🔊';
    }
    if (this.stageMuteText) {
      this.stageMuteText.textContent = this.video.muted ? 'Muted' : 'Sound';
    }
    if (window.diwaliEngine && typeof window.diwaliEngine.showToastNotice === 'function') {
      window.diwaliEngine.showToastNotice(this.video.muted ? '🔇 Audio Muted' : '🔊 Audio Active');
    }
  }

  // Seek relative seconds (Skip 10s forward or backward)
  seekRelative(deltaSec) {
    let dur = this.currentEp?.durationSec || 1455;
    let newTime = 0;

    // 1. If YouTube player is active in modal, seek YouTube directly!
    if (this.isOpen && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
      try {
        const cur = (typeof this.ytPlayer.getCurrentTime === 'function') ? this.ytPlayer.getCurrentTime() : 0;
        dur = (typeof this.ytPlayer.getDuration === 'function' && this.ytPlayer.getDuration() > 0) ? this.ytPlayer.getDuration() : dur;
        newTime = Math.max(0, Math.min(dur, cur + deltaSec));
        this.ytPlayer.seekTo(newTime, true);
        this.updateTimeDisplay(newTime, dur);
        if (this.seekSlider) this.seekSlider.value = newTime;
        if (this.stageSeekSlider) this.stageSeekSlider.value = newTime;
      } catch (err) {
        console.warn('YT seek error:', err);
      }
    } else if (this.isOpen && this.iframe && this.iframe.contentWindow) {
      try {
        this.estimatedTime = Math.max(0, Math.min(dur, (this.estimatedTime || 0) + deltaSec));
        newTime = this.estimatedTime;
        this.iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [newTime, true]
        }), '*');
        this.updateTimeDisplay(newTime, dur);
      } catch (_) {}
    }

    // 2. Also seek in local video if playing on stage
    if (this.video && !this.isOpen) {
      const vidDur = this.video.duration || 120;
      const vidCur = this.video.currentTime || 0;
      newTime = Math.max(0, Math.min(vidDur, vidCur + deltaSec));
      this.video.currentTime = newTime;
      this.updateTimeDisplay(newTime, dur);
      if (this.seekSlider) this.seekSlider.value = newTime;
      if (this.stageSeekSlider) this.stageSeekSlider.value = newTime;
    }

    // 3. Show instant on-screen skip flash badge
    if (this.skipIndicator && this.skipText) {
      this.skipText.textContent = deltaSec > 0 ? `+${Math.abs(deltaSec)}s ⏩` : `⏪ -${Math.abs(deltaSec)}s`;
      this.skipIndicator.classList.remove('hidden');
      clearTimeout(this.skipTimeout);
      this.skipTimeout = setTimeout(() => {
        if (this.skipIndicator) this.skipIndicator.classList.add('hidden');
      }, 850);
    }
  }

  // Toggle Fullscreen Mode
  toggleFullscreen() {
    const wrapper = document.getElementById('theaterVideoWrapper');
    if (!wrapper) return;

    if (!document.fullscreenElement) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  // Switch Episode
  switchEpisode(epKey) {
    if (!this.episodes[epKey]) return;
    this.activeEpisodeKey = epKey;
    this.currentEp = this.episodes[epKey];

    // Highlight active episode tab
    const epTabs = document.querySelectorAll('.ep-tab');
    epTabs.forEach(t => {
      if (t.getAttribute('data-ep') === epKey) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    const titleEl = document.getElementById('theaterModalTitle');
    const subtitleEl = document.getElementById('theaterModalSubtitle');
    const descEl = document.getElementById('theaterEpisodeDesc');
    const ytBannerTitle = document.getElementById('ytBannerTitle');

    if (titleEl) titleEl.textContent = this.currentEp.title;
    if (subtitleEl) subtitleEl.textContent = this.currentEp.subtitle;
    if (descEl) descEl.textContent = this.currentEp.desc;
    if (ytBannerTitle) ytBannerTitle.textContent = `Watch ${this.currentEp.num} on Official Sony SAB YouTube`;

    if (this.directYtLink) {
      this.directYtLink.href = this.currentEp.ytUrl;
    }

    // When modal is open, play the full 20+ minute episode directly via YouTube embed
    if (this.isOpen) {
      if (this.video) {
        this.video.pause();
        this.video.classList.add('hidden');
      }
      if (this.iframe) {
        this.iframe.classList.remove('hidden');
        this.iframe.src = `https://www.youtube-nocookie.com/embed/${this.currentEp.ytId}?autoplay=1&enablejsapi=1&rel=0`;
      }
      if (this.playOverlay) {
        this.playOverlay.classList.add('hidden');
      }
      this.isIframePaused = false;
    }

    // Always update 3D stage screen video source so the stage matches the selected episode
    if (this.video) {
      if (!this.video.src.includes(this.currentEp.videoSrc)) {
        this.video.src = this.currentEp.videoSrc;
        this.video.load();
      }
      if (!this.isOpen) {
        this.video.currentTime = 0;
        const playPromise = this.video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Episode play interrupted / requires user gesture:', err);
          });
        }
      }
      // Project onto 3D stage screen
      if (window.diwaliWorld3D?.societyTheater?.bindVideoTexture) {
        window.diwaliWorld3D.societyTheater.bindVideoTexture(this.video);
      }
    }

    // Update 3D society theater display & poster
    if (window.diwaliWorld3D?.societyTheater?.updateEpisode) {
      window.diwaliWorld3D.societyTheater.updateEpisode(this.currentEp);
    }

    if (window.diwaliEngine && typeof window.diwaliEngine.showToastNotice === 'function') {
      window.diwaliEngine.showToastNotice(`🎬 Now Playing: ${this.currentEp.num} - ${this.currentEp.subtitle}`);
    }
  }

  // Open Theater Modal & Play Full Episode Right Here!
  openTheaterModal(data = null) {
    this.isOpen = true;
    if (this.modal) {
      this.modal.classList.remove('hidden');
    }

    // Capture current 3D stage playhead so YouTube starts at the exact second
    const curStageTime = Math.floor(this.video?.currentTime || 0);

    // Pause and hide local video so its sound does not clash with the full episode
    if (this.video) {
      this.video.pause();
      this.video.classList.add('hidden');
    }

    // Play the full 20+ minute episode in the iframe
    if (this.iframe && this.currentEp) {
      this.iframe.classList.remove('hidden');
      const startParam = curStageTime > 2 ? `&start=${curStageTime}` : '';
      const targetSrc = `https://www.youtube-nocookie.com/embed/${this.currentEp.ytId}?autoplay=1&enablejsapi=1&rel=0${startParam}`;
      if (!this.iframe.src || !this.iframe.src.includes(this.currentEp.ytId)) {
        this.iframe.src = targetSrc;
      } else if (curStageTime > 2 && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
        try { this.ytPlayer.seekTo(curStageTime, true); } catch (_) {}
      }
    }
    this.isIframePaused = false;

    // Hide play overlay since YouTube iframe controls are interactive
    if (this.playOverlay) {
      this.playOverlay.classList.add('hidden');
    }

    // Update episode details
    const titleEl = document.getElementById('theaterModalTitle');
    const subtitleEl = document.getElementById('theaterModalSubtitle');
    const descEl = document.getElementById('theaterEpisodeDesc');
    const ytBannerTitle = document.getElementById('ytBannerTitle');

    if (titleEl && this.currentEp) titleEl.textContent = this.currentEp.title;
    if (subtitleEl && this.currentEp) subtitleEl.textContent = this.currentEp.subtitle;
    if (descEl && this.currentEp) descEl.textContent = this.currentEp.desc;
    if (ytBannerTitle && this.currentEp) ytBannerTitle.textContent = `Watch ${this.currentEp.num} on Official Sony SAB YouTube`;

    if (this.directYtLink && this.currentEp) {
      this.directYtLink.href = this.currentEp.ytUrl;
    }

    // Notify user
    if (window.diwaliEngine && typeof window.diwaliEngine.showToastNotice === 'function') {
      window.diwaliEngine.showToastNotice(`🎬 Now Playing: ${this.currentEp?.title || 'TMKOC Diwali Special'} (Full Episode)`);
    }
  }

  // Close Modal (Stop YouTube audio & resume 3D stage projection)
  closeTheaterModal() {
    this.isOpen = false;
    if (this.modal) {
      this.modal.classList.add('hidden');
    }

    // Retrieve latest playtime from YouTube so 3D screen continues seamlessly
    let ytCurTime = 0;
    if (this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
      try { ytCurTime = this.ytPlayer.getCurrentTime() || 0; } catch (_) {}
    }

    // Stop YouTube iframe audio immediately on modal close
    if (this.iframe) {
      this.iframe.src = '';
      this.iframe.classList.add('hidden');
    }

    // Return video element to persistent host so it continues active GPU decoding
    if (this.stageVideoHost && this.video && this.video.parentNode !== this.stageVideoHost) {
      this.stageVideoHost.appendChild(this.video);
    }

    // Unhide local video and resume 3D stage screen playback at exact timestamp
    if (this.video) {
      this.video.classList.remove('hidden');
      if (ytCurTime > 0) {
        try { this.video.currentTime = ytCurTime; } catch (_) {}
      }
      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      if (window.diwaliWorld3D?.societyTheater?.bindVideoTexture) {
        window.diwaliWorld3D.societyTheater.bindVideoTexture(this.video);
      }
    }
  }

  openOfficialYouTube() {
    const url = this.currentEp ? this.currentEp.ytUrl : 'https://www.youtube.com/playlist?list=PLSXTaG1fT0cSttPNrUmDlLygONjGdRqNZ';
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  setCustomVideoSource(input) {
    const parsedId = this.extractYouTubeId(input);
    const toast = document.getElementById('theaterNoticeToast');

    if (parsedId) {
      if (this.video) {
        this.video.pause();
        this.video.classList.add('hidden');
      }
      if (this.iframe) {
        this.iframe.classList.remove('hidden');
        this.iframe.src = `https://www.youtube-nocookie.com/embed/${parsedId}?autoplay=1&enablejsapi=1&rel=0`;
      }
      if (toast) {
        toast.textContent = '✅ Playing custom YouTube video!';
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3500);
      }
    } else {
      if (toast) {
        toast.textContent = '⚠️ Invalid YouTube link. Please paste a standard watch?v= or youtu.be URL.';
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3500);
      }
    }
  }

  extractYouTubeId(input) {
    if (!input) return null;
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const vMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch) return vMatch[1];
    const beMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (beMatch) return beMatch[1];
    const embMatch = input.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embMatch) return embMatch[1];
    return null;
  }

  updateTimeDisplay(currentSec, totalSec) {
    if (!this.timeDisplay && !this.stageTimeText) return;

    currentSec = Math.max(0, currentSec || 0);
    const fullDur = this.currentEp?.durationSec || 1455;
    totalSec = fullDur;

    const curMin = Math.floor(currentSec / 60).toString().padStart(2, '0');
    const curS = Math.floor(currentSec % 60).toString().padStart(2, '0');
    const totMin = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const totS = Math.floor(totalSec % 60).toString().padStart(2, '0');

    const str = `${curMin}:${curS} / ${totMin}:${totS}`;
    if (this.timeDisplay) this.timeDisplay.textContent = str;
    if (this.stageTimeText) this.stageTimeText.textContent = str;
  }

  // Real-Time Location & Proximity Tracker
  updateProximity(player3DX, player3DZ) {
    const isPlayerSittingInTheater = Boolean(
      (window.diwaliEngine3D?.player3D?.isSitting && window.diwaliEngine3D?.player3D?.currentBench?.isTheaterBench) ||
      (window.diwaliEngine?.player3D?.isSitting && window.diwaliEngine?.player3D?.currentBench?.isTheaterBench) ||
      (typeof document !== 'undefined' && document.body.classList.contains('theater-seated'))
    );

    const dist = Math.hypot(player3DX - this.theaterCenter.x, player3DZ - this.theaterCenter.z);
    let inRange = isPlayerSittingInTheater || (dist <= this.triggerRadius);

    // Suppress theater stage controls when near or interacting with other features (e.g. storytelling board, temple)
    const curInteract = window.diwaliEngine3D?.currentInteractive || window.diwaliEngine?.currentInteractive;
    if (!isPlayerSittingInTheater && inRange && curInteract && curInteract.type !== 'society_theater') {
      inRange = false;
    }

    if (inRange !== this.isNearTheater) {
      this.isNearTheater = inRange;

      if (this.locationBadge) {
        this.locationBadge.classList.toggle('hidden', !inRange);
      }

      if (this.stageQuickControls) {
        this.stageQuickControls.classList.toggle('hidden', !inRange);
      }

      if (inRange) {
        const bubblesLayer = document.getElementById('emoteBubblesLayer');
        if (bubblesLayer) bubblesLayer.innerHTML = '';
      }
    } else if (isPlayerSittingInTheater && this.stageQuickControls && this.stageQuickControls.classList.contains('hidden')) {
      this.stageQuickControls.classList.remove('hidden');
    }
  }
}

window.DiwaliTheaterModal = DiwaliTheaterModal;

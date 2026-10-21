// ========================================================
// DIWALI NIGHT MISSION — LIGHT UP THE COLONY!
// Cohesive mission manager integrating exploration, collectibles,
// shopping, neighborhood decoration, challenges, and grand finale.
// ========================================================

class DiwaliMissionManager {
  constructor() {
    this.storageKey = 'diwali_mission_progress_v1';
    
    // Defined Coin Collectibles scattered in the colony
    this.coinPickups = [
      { id: 'coin_temple', name: 'Temple Sanctum Blessing', x: 1360, y: 460, radius: 16 },
      { id: 'coin_chowk', name: 'Chowk Promenade Coin', x: 650, y: 490, radius: 16 },
      { id: 'coin_bazaar', name: 'Bazaar Merchant Treasure', x: 1480, y: 810, radius: 16 },
      { id: 'coin_north_lane', name: 'Northern Mohalla Coin', x: 470, y: 270, radius: 16 },
      { id: 'coin_south_lane', name: 'Southern Courtyard Coin', x: 480, y: 920, radius: 16 }
    ];

    // Exploration Waypoints
    this.explorationZones = [
      { id: 'temple', name: 'Shree Shiv-Lakshmi Mandir', x: 1460, y: 440, radius: 120 },
      { id: 'bazaar', name: 'Shubh Deepawali Bazaar', x: 1410, y: 800, radius: 110 },
      { id: 'chowk', name: 'Central Colony Chowk', x: 650, y: 580, radius: 110 },
      { id: 'residential', name: 'Residential Enclave', check: (px, py) => (px < 1150 && (py < 430 || py > 800)) }
    ];

    // Default Mission State
    this.state = {
      started: false,
      startTime: null,
      completed: false,
      completedTime: null,
      rewardClaimed: false,
      explored: {
        temple: false,
        bazaar: false,
        chowk: false,
        residential: false
      },
      coinsCollected: [],
      itemsPurchased: 0,
      itemsUsed: 0,
      housesDecorated: [],
      challengesCompleted: [],
      finaleUnlocked: false
    };

    // Animation timer for coin rendering
    this.coinAnimTick = 0;
  }

  init() {
    this.loadProgress();
    this.setupUI();
    this.updateHUDTracker();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = {
          ...this.state,
          ...parsed,
          explored: { ...this.state.explored, ...(parsed.explored || {}) },
          coinsCollected: Array.isArray(parsed.coinsCollected) ? parsed.coinsCollected : [],
          housesDecorated: Array.isArray(parsed.housesDecorated) ? parsed.housesDecorated : [],
          challengesCompleted: Array.isArray(parsed.challengesCompleted) ? parsed.challengesCompleted : []
        };
      }
    } catch (e) {
      console.warn('Could not load mission progress', e);
    }
  }

  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save mission progress', e);
    }
  }

  startMission() {
    if (!this.state.started) {
      this.state.started = true;
      this.state.startTime = Date.now();
      this.saveProgress();
    }
    this.updateHUDTracker();
    this.closeIntroModal();
    window.festiveAudio.playTempleBell();

    this.showMissionNotification('📜 Mission Started: "Light Up the Colony!" Explore and bring radiance to the mohalla.');
  }

  resetMission() {
    if (confirm('Are you sure you want to restart the Diwali Night Mission? All mission checklist progress will be reset.')) {
      this.state = {
        started: true,
        startTime: Date.now(),
        completed: false,
        completedTime: null,
        rewardClaimed: false,
        explored: {
          temple: false,
          bazaar: false,
          chowk: false,
          residential: false
        },
        coinsCollected: [],
        itemsPurchased: 0,
        itemsUsed: 0,
        housesDecorated: [],
        challengesCompleted: [],
        finaleUnlocked: false
      };
      this.saveProgress();
      this.updateHUDTracker();
      this.renderChecklist();
      window.festiveAudio.playDiyaChime();
      this.showMissionNotification('🔄 Mission reset! Begin fresh by exploring the colony.');
    }
  }

  // Check exploration visits based on player position
  checkExploration(px, py) {
    if (!this.state.started || this.state.completed) return;

    this.explorationZones.forEach(zone => {
      if (!this.state.explored[zone.id]) {
        let visited = false;
        if (zone.check) {
          visited = zone.check(px, py);
        } else {
          const dist = Math.hypot(px - zone.x, py - zone.y);
          visited = dist < zone.radius;
        }

        if (visited) {
          this.state.explored[zone.id] = true;
          this.saveProgress();
          this.updateHUDTracker();
          window.festiveAudio.playDiyaChime();
          this.showMissionNotification(`🧭 Explored: ${zone.name}! (${this.getExplorationCount()}/4 areas visited)`);
          this.checkAllMandatoryObjectives();
        }
      }
    });
  }

  // Check and collect floating coins on canvas
  checkCoinPickups(px, py, playerRadius = 16) {
    if (!this.state.started) return;

    this.coinPickups.forEach(coin => {
      if (!this.state.coinsCollected.includes(coin.id)) {
        const dist = Math.hypot(px - coin.x, py - coin.y);
        if (dist < playerRadius + coin.radius + 6) {
          // Collected!
          this.state.coinsCollected.push(coin.id);
          this.saveProgress();

          // Award virtual coins via existing shop system
          if (window.diwaliShop) {
            window.diwaliShop.addCoins(20, `Collected: ${coin.name}`);
          }
          window.festiveAudio.playCoinChime();
          this.updateHUDTracker();
          this.showMissionNotification(`🪙 Coin Found: ${coin.name}! (+20 Coins, ${this.state.coinsCollected.length}/5 collected)`);
          this.checkAllMandatoryObjectives();
        }
      }
    });
  }

  // Hooked from Shop
  onItemPurchased(item) {
    if (!this.state.started) return;
    this.state.itemsPurchased = (this.state.itemsPurchased || 0) + 1;
    this.saveProgress();
    this.updateHUDTracker();
    this.checkAllMandatoryObjectives();
  }

  onItemUsed(item) {
    if (!this.state.started) return;
    this.state.itemsUsed = (this.state.itemsUsed || 0) + 1;
    this.saveProgress();
    this.updateHUDTracker();
    this.checkAllMandatoryObjectives();
  }

  // Hooked from Decorations
  onHouseDecorated(house) {
    if (!this.state.started) return;

    if (!this.state.housesDecorated.includes(house.id)) {
      this.state.housesDecorated.push(house.id);
      this.saveProgress();
      this.updateHUDTracker();
      this.showMissionNotification(`🏡 House Decorated: ${house.name}! (${this.state.housesDecorated.length}/3 houses completed)`);
      this.checkAllMandatoryObjectives();
    }
  }

  // Hooked from Mini-games
  onChallengeCompleted(challengeId) {
    if (!this.state.started) return;

    if (!this.state.challengesCompleted.includes(challengeId)) {
      this.state.challengesCompleted.push(challengeId);
      this.saveProgress();
      this.updateHUDTracker();
      this.showMissionNotification(`🎯 Festival Challenge Mastered: ${this.formatChallengeName(challengeId)}!`);
      this.checkAllMandatoryObjectives();
    }
  }

  formatChallengeName(id) {
    switch (id) {
      case 'diya_sprint': return 'Diya Lighting Sprint';
      case 'rangoli': return 'Rangoli Artisan';
      case 'quiz': return 'Diwali Cultural Trivia';
      default: return 'Mini-Game';
    }
  }

  getExplorationCount() {
    return Object.values(this.state.explored).filter(Boolean).length;
  }

  // Check if all mandatory prerequisites for the Grand Finale are met
  areMandatoryObjectivesMet() {
    const exploredAll = this.getExplorationCount() >= 4;
    const coinsAll = this.state.coinsCollected.length >= 5;
    const decoratedEnough = this.state.housesDecorated.length >= 3;
    const shoppedOrUsed = (this.state.itemsPurchased > 0) || (this.state.itemsUsed > 0);
    const challengeDone = this.state.challengesCompleted.length >= 1;

    return exploredAll && coinsAll && decoratedEnough && shoppedOrUsed && challengeDone;
  }

  checkAllMandatoryObjectives() {
    if (this.state.completed) return;

    if (this.areMandatoryObjectivesMet() && !this.state.finaleUnlocked) {
      this.state.finaleUnlocked = true;
      this.saveProgress();
      this.updateHUDTracker();
      window.festiveAudio.playTempleBell();
      this.showMissionNotification('✨ GRAND FINALE UNLOCKED! Head to the Central Chowk Altar to initiate Maha Deepotsav! ✨');
    }
  }

  canTriggerMahaDeepotsav() {
    return this.state.finaleUnlocked || this.areMandatoryObjectivesMet();
  }

  // Triggered when player activates Maha Deepotsav at Chowk
  onMahaDeepotsavTriggered() {
    if (!this.state.started) {
      this.state.started = true;
    }

    if (!this.state.completed) {
      this.state.completed = true;
      this.state.completedTime = Date.now();

      // Award Champion Rewards exactly once
      if (!this.state.rewardClaimed) {
        this.state.rewardClaimed = true;
        if (window.diwaliShop) {
          window.diwaliShop.addCoins(250, 'Diwali Champion Grand Finale Reward');
        }
      }

      this.saveProgress();
      this.updateHUDTracker();

      // Trigger coordinated virtual fireworks show
      if (window.diwaliFireworks) {
        window.diwaliFireworks.startSkyFireworksShow(25000);
      }

      // Show Mission Completion modal after a short cinematic pause
      setTimeout(() => {
        this.showCompletionModal();
      }, 3500);
    }
  }

  // Render floating coin collectibles on the canvas
  renderCoinCollectibles(ctx) {
    if (!this.state.started) return;

    this.coinAnimTick += 0.04;
    const time = this.coinAnimTick;

    ctx.save();
    this.coinPickups.forEach(coin => {
      // Only render uncollected coins
      if (!this.state.coinsCollected.includes(coin.id)) {
        const floatY = Math.sin(time * 2 + coin.x) * 4;
        const cy = coin.y + floatY;

        // Ground shadow
        ctx.beginPath();
        ctx.ellipse(coin.x, coin.y + 12, 10, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fill();

        // Glowing halo aura
        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#fbbf24';
        const scaleX = Math.abs(Math.cos(time * 2.5)); // 3D spinning effect

        ctx.translate(coin.x, cy);
        ctx.scale(scaleX, 1);

        // Gold coin body
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner coin ring & icon
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#451a03';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪔', 0, 0);

        ctx.restore();
      }
    });
    ctx.restore();
  }

  // UI Setup & Handlers
  setupUI() {
    // Open Mission Button in bottom HUD
    const openMissionBtn = document.getElementById('openMissionBtn');
    if (openMissionBtn) {
      openMissionBtn.addEventListener('click', () => {
        this.openIntroModal();
      });
    }

    // Tracker widget in top-left
    const trackerWidget = document.getElementById('missionTrackerWidget');
    if (trackerWidget) {
      trackerWidget.addEventListener('click', () => {
        this.openIntroModal();
      });
    }

    // Modal Close & Start Buttons
    document.querySelectorAll('[data-close="missionIntroModal"]').forEach(btn => {
      btn.addEventListener('click', () => this.closeIntroModal());
    });

    const startBtn = document.getElementById('startMissionBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startMission();
      });
    }

    const resetBtn = document.getElementById('resetMissionBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetMission();
      });
    }

    // Completion modal close / play again
    document.querySelectorAll('[data-close="missionCompletionModal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById('missionCompletionModal');
        if (modal) modal.classList.add('hidden');
      });
    });

    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        const modal = document.getElementById('missionCompletionModal');
        if (modal) modal.classList.add('hidden');
        this.resetMission();
      });
    }

    const freePlayBtn = document.getElementById('freePlayBtn');
    if (freePlayBtn) {
      freePlayBtn.addEventListener('click', () => {
        const modal = document.getElementById('missionCompletionModal');
        if (modal) modal.classList.add('hidden');
      });
    }
  }

  openIntroModal() {
    this.renderChecklist();
    const modal = document.getElementById('missionIntroModal');
    if (modal) modal.classList.remove('hidden');
    window.festiveAudio.playDiyaChime();
  }

  closeIntroModal() {
    const modal = document.getElementById('missionIntroModal');
    if (modal) modal.classList.add('hidden');
  }

  showCompletionModal() {
    const modal = document.getElementById('missionCompletionModal');
    if (!modal) return;

    // Calculate time taken
    let timeStr = '6m 20s';
    if (this.state.startTime && this.state.completedTime) {
      const diffSec = Math.round((this.state.completedTime - this.state.startTime) / 1000);
      const mins = Math.floor(diffSec / 60);
      const secs = diffSec % 60;
      timeStr = `${mins}m ${secs}s`;
    }

    document.getElementById('statTimeTaken').textContent = timeStr;
    document.getElementById('statCoinsCollected').textContent = `${this.state.coinsCollected.length} / 5`;
    document.getElementById('statHousesDecorated').textContent = `${this.state.housesDecorated.length} / 6`;
    document.getElementById('statChallengesCompleted').textContent = `${this.state.challengesCompleted.length} / 3`;

    modal.classList.remove('hidden');
    window.festiveAudio.playTempleBell();
  }

  renderChecklist() {
    const container = document.getElementById('missionChecklistContainer');
    if (!container) return;

    const exploredCount = this.getExplorationCount();
    const coinsCount = this.state.coinsCollected.length;
    const housesCount = this.state.housesDecorated.length;
    const shopCount = (this.state.itemsPurchased > 0 || this.state.itemsUsed > 0);
    const challengesCount = this.state.challengesCompleted.length;
    const finaleReady = this.canTriggerMahaDeepotsav();

    const items = [
      {
        title: '1. Explore Shanti Colony',
        desc: 'Visit the Mandir, Festival Bazaar, Central Chowk, and Residential Enclaves.',
        progress: `${exploredCount}/4 Areas`,
        done: exploredCount >= 4
      },
      {
        title: '2. Collect Colony Blessings',
        desc: 'Find 5 golden blessing coins scattered throughout the neighborhood courtyards.',
        progress: `${coinsCount}/5 Coins`,
        done: coinsCount >= 5
      },
      {
        title: '3. Shop & Place Decorations',
        desc: 'Visit the Shubh Deepawali Bazaar, acquire virtual fireworks or diyas, and ignite them.',
        progress: shopCount ? 'Completed' : 'Pending',
        done: shopCount
      },
      {
        title: '4. Illuminate the Residences',
        desc: 'Approach residential houses, toggle fairy light strings, and set doorstep diyas.',
        progress: `${housesCount}/3 Houses`,
        done: housesCount >= 3
      },
      {
        title: '5. Complete a Festive Challenge',
        desc: 'Master the Diya Sprint, Rangoli Artisan, or Cultural Trivia mini-game.',
        progress: `${challengesCount}/1 Challenge`,
        done: challengesCount >= 1
      },
      {
        title: '6. Grand Finale: Maha Deepotsav',
        desc: 'Light up the Colony Altar at Central Chowk to illuminate the entire neighborhood in unison!',
        progress: this.state.completed ? 'Illuminated! ✨' : (finaleReady ? 'Ready at Chowk!' : 'Locked'),
        done: this.state.completed
      }
    ];

    container.innerHTML = items.map(item => `
      <div class="mission-check-item ${item.done ? 'completed' : ''}">
        <div class="check-box">${item.done ? '✓' : ''}</div>
        <div class="check-content">
          <div class="check-title-row">
            <span class="check-title">${item.title}</span>
            <span class="check-badge ${item.done ? 'badge-done' : ''}">${item.progress}</span>
          </div>
          <p class="check-desc">${item.desc}</p>
        </div>
      </div>
    `).join('');

    // Update start button text
    const startBtn = document.getElementById('startMissionBtn');
    if (startBtn) {
      if (this.state.completed) {
        startBtn.textContent = 'Mission Completed ✨';
        startBtn.disabled = true;
      } else if (this.state.started) {
        startBtn.textContent = 'Continue Mission ➔';
        startBtn.disabled = false;
      } else {
        startBtn.textContent = 'Start Mission ➔';
        startBtn.disabled = false;
      }
    }
  }

  updateHUDTracker() {
    const trackerWidget = document.getElementById('missionTrackerWidget');
    if (!trackerWidget) return;

    if (!this.state.started) {
      trackerWidget.innerHTML = `
        <div class="tracker-header">
          <span class="tracker-icon">📜</span>
          <span class="tracker-title">Diwali Night Mission</span>
        </div>
        <div class="tracker-status">Tap to Start Mission ➔</div>
      `;
      return;
    }

    if (this.state.completed) {
      trackerWidget.innerHTML = `
        <div class="tracker-header">
          <span class="tracker-icon">🏆</span>
          <span class="tracker-title">Diwali Champion</span>
        </div>
        <div class="tracker-status" style="color:var(--gold-bright);">All Objectives Complete! ✨</div>
      `;
      return;
    }

    // Determine current active objective description
    let activeSummary = '';
    const expCount = this.getExplorationCount();
    const coinCount = this.state.coinsCollected.length;
    const houseCount = this.state.housesDecorated.length;
    const shopDone = (this.state.itemsPurchased > 0 || this.state.itemsUsed > 0);
    const chalDone = this.state.challengesCompleted.length >= 1;

    let completedTasks = 0;
    if (expCount >= 4) completedTasks++;
    if (coinCount >= 5) completedTasks++;
    if (shopDone) completedTasks++;
    if (houseCount >= 3) completedTasks++;
    if (chalDone) completedTasks++;

    if (expCount < 4) {
      activeSummary = `Explore: ${expCount}/4 Areas`;
    } else if (coinCount < 5) {
      activeSummary = `Coins: ${coinCount}/5 Picked`;
    } else if (!shopDone) {
      activeSummary = 'Shop at Bazaar & Use Item';
    } else if (houseCount < 3) {
      activeSummary = `Decorate: ${houseCount}/3 Houses`;
    } else if (!chalDone) {
      activeSummary = 'Play Mini-Game Challenge';
    } else {
      activeSummary = '✨ Ignite Chowk Maha Altar!';
    }

    trackerWidget.innerHTML = `
      <div class="tracker-header">
        <span class="tracker-icon">📜</span>
        <span class="tracker-title">Mission (${completedTasks}/5)</span>
      </div>
      <div class="tracker-status">${activeSummary}</div>
    `;
  }

  showMissionNotification(message) {
    const prompt = document.getElementById('interactionPrompt');
    const msg = document.getElementById('promptMessage');
    const key = document.getElementById('promptKeyBadge');
    if (prompt && msg) {
      msg.textContent = message;
      if (key) key.textContent = '📜';
      prompt.classList.remove('hidden');
      setTimeout(() => {
        prompt.classList.add('hidden');
      }, 4000);
    }
  }

  showMissionIncompleteNotice() {
    this.openIntroModal();
    this.showMissionNotification('⚠️ Complete all mandatory mission objectives first to unlock Maha Deepotsav!');
  }
}

// Global instance
window.diwaliMission = new DiwaliMissionManager();
window.addEventListener('DOMContentLoaded', () => {
  window.diwaliMission.init();
});

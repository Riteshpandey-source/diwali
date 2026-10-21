// ========================================================
// COLONY DECORATION & MAHA DEEPOTSAV CELEBRATION MANAGER
// ========================================================

class ColonyDecorationManager {
  constructor() {
    this.storageKey = 'diwali_colony_decorations_v1';
    this.currentEditingHouse = null;
    this.selectedLightStyle = 'golden';
    this.mahaMode = false;
  }

  init() {
    this.loadSavedDecorations();
    this.setupUI();
  }

  loadSavedDecorations() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && window.diwaliWorld) {
        const parsed = JSON.parse(saved);
        window.diwaliWorld.houses.forEach(h => {
          if (parsed[h.id]) {
            h.lights = parsed[h.id].lights || h.lights;
            h.decor = parsed[h.id].decor || h.decor;
          }
        });
      }
    } catch (e) {
      console.warn('Could not read saved decorations from localStorage', e);
    }
  }

  saveDecorations() {
    try {
      if (!window.diwaliWorld) return;
      const data = {};
      window.diwaliWorld.houses.forEach(h => {
        data[h.id] = {
          lights: h.lights,
          decor: h.decor
        };
      });
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save decorations', e);
    }
  }

  openDecoratorModal(house) {
    this.currentEditingHouse = house;
    this.selectedLightStyle = house.lights.on ? house.lights.style : 'off';

    const titleEl = document.getElementById('decoratorHouseTitle');
    if (titleEl) titleEl.textContent = `Decorate ${house.name}`;

    // Update style buttons
    document.querySelectorAll('.light-style-btn').forEach(btn => {
      const style = btn.getAttribute('data-style');
      if (style === this.selectedLightStyle) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });

    // Update checkboxes
    const checkDiyas = document.getElementById('checkDoorstepDiyas');
    const checkToran = document.getElementById('checkMarigoldToran');
    const checkKandil = document.getElementById('checkHangingKandil');

    if (checkDiyas) checkDiyas.checked = !!house.decor.diyas;
    if (checkToran) checkToran.checked = !!house.decor.toran;
    if (checkKandil) checkKandil.checked = !!house.decor.kandil;

    const modal = document.getElementById('decoratorModal');
    if (modal) modal.classList.remove('hidden');

    window.festiveAudio.playDiyaChime();
  }

  setupUI() {
    // Light style selection
    document.querySelectorAll('.light-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.light-style-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedLightStyle = btn.getAttribute('data-style');
      });
    });

    // Save Decoration button
    const saveBtn = document.getElementById('saveDecorationBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (!this.currentEditingHouse) return;

        const h = this.currentEditingHouse;
        if (this.selectedLightStyle === 'off') {
          h.lights.on = false;
        } else {
          h.lights.on = true;
          h.lights.style = this.selectedLightStyle;
        }

        const checkDiyas = document.getElementById('checkDoorstepDiyas');
        const checkToran = document.getElementById('checkMarigoldToran');
        const checkKandil = document.getElementById('checkHangingKandil');

        h.decor.diyas = checkDiyas ? checkDiyas.checked : true;
        h.decor.toran = checkToran ? checkToran.checked : true;
        h.decor.kandil = checkKandil ? checkKandil.checked : true;

        this.saveDecorations();

        // Sync with multiplayer room if connected
        if (window.diwaliMultiplayer && window.diwaliMultiplayer.isConnected) {
          window.diwaliMultiplayer.sendLightToggle(h.id, h.lights.on, h.lights.style);
        }

        // Close modal
        const modal = document.getElementById('decoratorModal');
        if (modal) modal.classList.add('hidden');

        // Play temple bell and reward coins
        window.festiveAudio.playTempleBell();
        if (window.diwaliShop) {
          window.diwaliShop.addCoins(25, `Decorated ${h.name}`);
        }

        // Notify Diwali Night Mission
        if (window.diwaliMission && h.lights.on) {
          window.diwaliMission.onHouseDecorated(h);
        }
      });
    }

    // Close buttons
    document.querySelectorAll('[data-close="decoratorModal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById('decoratorModal');
        if (modal) modal.classList.add('hidden');
      });
    });
  }

  // Maha Deepotsav: Colony-Wide Grand Celebration Mode
  triggerMahaDeepotsav(initiatorName = 'You') {
    if (this.mahaMode) return;
    this.mahaMode = true;

    // 1. Turn on all house lights in magnificent golden & rainbow style
    if (window.diwaliWorld) {
      window.diwaliWorld.houses.forEach((h, idx) => {
        h.lights.on = true;
        h.lights.style = idx % 2 === 0 ? 'golden' : 'rainbow';
        h.decor.diyas = true;
        h.decor.toran = true;
        h.decor.kandil = true;

        // Launch celebratory sky rockets from each house roof!
        setTimeout(() => {
          if (window.diwaliFireworks) {
            window.diwaliFireworks.launchRocket(h.x + h.width / 2, h.y - 45);
          }
        }, idx * 400);
      });

      // Temple lights
      window.diwaliWorld.temple.lightsOn = true;
    }

    // 2. Play Grand Temple Bell & Shlokas
    window.festiveAudio.playTempleBell();

    // 3. Update HUD badge
    const badge = document.getElementById('colonyCelebrationBadge');
    const label = document.getElementById('colonyModeLabel');
    if (badge) badge.classList.add('maha');
    if (label) label.textContent = 'Maha Deepotsav Active!';

    // 4. Show Celebration Banner
    const banner = document.getElementById('grandCelebrationBanner');
    const initText = document.getElementById('celebrationInitiatorText');
    if (initText) {
      initText.textContent = `${initiatorName} has illuminated the entire colony with divine light!`;
    }
    if (banner) {
      banner.classList.remove('hidden');
      setTimeout(() => {
        banner.classList.add('hidden');
      }, 7000);
    }

    // 5. Reward Coins
    if (window.diwaliShop) {
      window.diwaliShop.addCoins(100, 'Maha Deepotsav Illumination Milestone');
    }

    // 6. Broadcast to multiplayer peers
    if (window.diwaliMultiplayer && window.diwaliMultiplayer.isConnected) {
      window.diwaliMultiplayer.sendGrandCelebration();
    }

    // 7. Notify Diwali Night Mission
    if (window.diwaliMission) {
      window.diwaliMission.onMahaDeepotsavTriggered();
    }

    // Save
    this.saveDecorations();
  }
}

// Global instance
window.colonyDecoration = new ColonyDecorationManager();
window.addEventListener('DOMContentLoaded', () => {
  window.colonyDecoration.init();
});

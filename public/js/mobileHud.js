// ===================================================================
// DIWALI MOBILE HUD & QUICK DRAWER CONTROLLER
// Streamlined, clean, spacious mobile interface for 320px - 430px phones.
// Consolidates secondary menus into a drawer, organizes mobile controls,
// and ensures essential HUD information remains easily accessible.
// ===================================================================

class DiwaliMobileHUD {
  constructor() {
    this.drawer = null;
    this.isOpen = false;
    this.isInventoryOpen = false;

    // Item metadata for mobile inventory button
    this.itemMetadata = {
      phuljhadi: { name: 'Sparkler', icon: '✨' },
      anar:      { name: 'Anar',     icon: '🌋' },
      chakri:    { name: 'Chakri',   icon: '🌀' },
      rocket:    { name: 'Rocket',   icon: '🚀' },
      diya:      { name: 'Diya',     icon: '🪔' },
      kandil:    { name: 'Lantern',  icon: '🏮' }
    };

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        this.init();
      }
    }
  }

  init() {
    this.drawer = document.getElementById('mobileNavDrawer');
    this.drawerBackdrop = document.getElementById('mobileNavBackdrop') || document.getElementById('mobileDrawerBackdrop');
    this.menuBtn = document.getElementById('mobileMenuToggleBtn');
    this.closeBtn = document.getElementById('mobileNavCloseBtn') || document.getElementById('closeMobileDrawerBtn');

    this.invToggleBtn = document.getElementById('mobileInventoryToggleBtn');
    this.activeIcon = document.getElementById('mobileActiveItemIcon');
    this.activeName = document.getElementById('mobileActiveItemName');
    this.quickTray = document.querySelector('.quick-inventory-tray');

    this.bindEvents();
    this.setupAartiMobileResponsive();
    this.listenToInventoryChanges();
  }

  bindEvents() {
    // 1. Mobile Menu Drawer Toggle
    if (this.menuBtn) {
      this.menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openDrawer();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', () => this.closeDrawer());
    }

    // 2. Wire Drawer Action Tiles to existing buttons
    const tileMappings = [
      { tileId: 'drawerShopBtn',        targetId: 'openShopBtn' },
      { tileId: 'drawerMissionBtn',     targetId: 'openMissionBtn' },
      { tileId: 'drawerGamesBtn',       targetId: 'openGamesBtn' },
      { tileId: 'drawerEmotesBtn',      targetId: 'openEmoteMenuBtn' },
      { tileId: 'drawerSkyShowBtn',     targetId: 'skyShowBtn' },
      { tileId: 'drawerMultiplayerBtn', targetId: 'multiplayerModalBtn' },
      { tileId: 'drawerSettingsBtn',    targetId: 'settingsModalBtn' },
      { tileId: 'drawerGreetingBtn',    targetId: 'returnToGreetingBtn' }
    ];

    tileMappings.forEach(({ tileId, targetId }) => {
      const tile = document.getElementById(tileId);
      const target = document.getElementById(targetId);
      if (tile && target) {
        tile.addEventListener('click', () => {
          this.closeDrawer();
          setTimeout(() => {
            target.click();
          }, 150);
        });
      }
    });

    // Special Aarti tile in drawer
    const drawerAartiBtn = document.getElementById('drawerAartiBtn');
    if (drawerAartiBtn) {
      drawerAartiBtn.addEventListener('click', () => {
        this.closeDrawer();
        if (window.diwaliAartiController) {
          if (window.diwaliAartiController.isMinimized) {
            window.diwaliAartiController.toggleMinimize();
          }
          window.diwaliAartiController.showCard();
        }
      });
    }

    // 3. Mobile Inventory Selector Toggle
    if (this.invToggleBtn && this.quickTray) {
      this.invToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileInventory();
      });

      // Close mobile inventory if tapping elsewhere
      document.addEventListener('click', (e) => {
        if (this.isInventoryOpen && !this.quickTray.contains(e.target) && e.target !== this.invToggleBtn) {
          this.closeMobileInventory();
        }
      });
    }

    // 4. Close drawer on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeDrawer();
      }
    });
  }

  openDrawer() {
    if (!this.drawer) return;
    this.isOpen = true;
    this.drawer.classList.remove('hidden');
    this.drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mobile-drawer-open');
  }

  closeDrawer() {
    if (!this.drawer) return;
    this.isOpen = false;
    this.drawer.classList.add('hidden');
    this.drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mobile-drawer-open');
  }

  toggleDrawer() {
    if (this.isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  toggleInventory() {
    this.toggleMobileInventory();
  }

  toggleMobileInventory() {
    if (!this.quickTray) return;
    this.isInventoryOpen = !this.isInventoryOpen;
    if (this.isInventoryOpen) {
      this.quickTray.classList.add('mobile-tray-open');
    } else {
      this.quickTray.classList.remove('mobile-tray-open');
    }
  }

  closeMobileInventory() {
    if (!this.quickTray) return;
    this.isInventoryOpen = false;
    this.quickTray.classList.remove('mobile-tray-open');
  }

  listenToInventoryChanges() {
    const slots = document.querySelectorAll('.item-slot');
    slots.forEach(slot => {
      slot.addEventListener('click', () => {
        const itemType = slot.dataset.item;
        if (itemType && this.itemMetadata[itemType]) {
          const meta = this.itemMetadata[itemType];
          if (this.activeIcon) this.activeIcon.textContent = meta.icon;
          if (this.activeName) this.activeName.textContent = meta.name;
        }
        if (window.innerWidth <= 768) {
          this.closeMobileInventory();
        }
      });
    });
  }

  minimizeAarti() {
    if (typeof window !== 'undefined' && window.diwaliAartiController) {
      if (!window.diwaliAartiController.isMinimized) {
        window.diwaliAartiController.toggleMinimize();
      }
    }
  }

  expandAarti() {
    if (typeof window !== 'undefined' && window.diwaliAartiController) {
      if (window.diwaliAartiController.isMinimized) {
        window.diwaliAartiController.toggleMinimize();
      }
    }
  }

  setupAartiMobileResponsive() {
    // On narrow screens (phones), default Aarti player to minimized floating badge without automatic audio
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      this.minimizeAarti();
    }
  }
}

// Global Singleton
if (typeof window !== 'undefined') {
  window.DiwaliMobileHUD = DiwaliMobileHUD;
  window.diwaliMobileHUD = new DiwaliMobileHUD();
}

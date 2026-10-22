// ===================================================================
// GOKUL KUNJ CO-OP HOUSING SOCIETY - INTERACTIONS & EVENT ORCHESTRATION
// Interactive NPC Dialogues, Society Noticeboard, Apartment Transitions,
// and the Grand Society-Wide Coordinated Diwali Celebration Event.
// ===================================================================

class SocietyInteractions3D {
  constructor(engine3D) {
    this.engine3D = engine3D;
    this.world3D = engine3D.world3D;
    this.player3D = engine3D.player3D;
    this.npcManager3D = engine3D.npcManager3D;
    this.fireworks3D = engine3D.fireworks3D;

    // Character Registry
    const RegistryClass = (typeof window !== 'undefined' && window.SocietyCharacterRegistry) || (typeof SocietyCharacterRegistry !== 'undefined' && SocietyCharacterRegistry);
    this.registry = RegistryClass ? new RegistryClass() : null;

    // DOM UI elements
    this.createDialogueUI();
    this.createNoticeboardUI();

    // Audio helper
    this.audio = window.festiveAudio || {};

    // Coordinated Event State
    this.isSocietyEventActive = false;
  }

  // -----------------------------------------------------------------
  // 1. DIALOGUE UI MODAL & INTERACTION
  // -----------------------------------------------------------------
  createDialogueUI() {
    if (document.getElementById('societyDialogueModal')) return;

    const modal = document.createElement('div');
    modal.id = 'societyDialogueModal';
    modal.className = 'society-modal-backdrop hidden';
    modal.innerHTML = `
      <div class="society-dialogue-card">
        <div class="dialogue-header">
          <div class="character-avatar" id="dialogueAvatar">🪔</div>
          <div class="character-meta">
            <h3 id="dialogueCharName">Resident Name</h3>
            <span id="dialogueCharRole" class="character-role-tag">Society Resident</span>
          </div>
          <button id="closeDialogueBtn" class="modal-close-btn">&times;</button>
        </div>

        <div class="dialogue-body">
          <div class="speech-bubble">
            <p id="dialogueText">Shubh Deepawali! Gokul Kunj society mein aapka swagat hai!</p>
          </div>

          <div class="dialogue-options">
            <button class="dialogue-btn" data-topic="greeting">✨ Happy Diwali bolna</button>
            <button class="dialogue-btn" data-topic="aboutDiwali">🪔 Taiyari ke baare mein poochna</button>
            <button class="dialogue-btn" data-topic="aboutSociety">🏠 Society ke baare mein poochna</button>
            <button class="dialogue-btn" data-topic="taskNotice">📋 Aaj ke karyakram ki jaankari</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Event Listeners
    const closeBtn = modal.querySelector('#closeDialogueBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeDialogue();
      });
    }

    modal.querySelectorAll('.dialogue-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topic = e.target.getAttribute('data-topic');
        this.handleDialogueTopic(topic);
      });
    });
  }

  openDialogueForCharacter(characterId) {
    const char = this.registry.getCharacter(characterId);
    if (!char) return;

    this.activeCharacter = char;

    const modal = document.getElementById('societyDialogueModal');
    const nameEl = document.getElementById('dialogueCharName');
    const roleEl = document.getElementById('dialogueCharRole');
    const textEl = document.getElementById('dialogueText');
    const avatarEl = document.getElementById('dialogueAvatar');

    nameEl.textContent = char.displayName;
    roleEl.textContent = char.role.replace('_', ' ').toUpperCase();
    textEl.textContent = char.dialogues.greeting;

    // Icons based on role
    const icons = {
      business_owner: '👔',
      mother: '🥻',
      society_secretary: '📋',
      writer: '✍️',
      boisterous_friend: '💥',
      doctor: '🩺',
      scientist: '🔬',
      reporter: '📰',
      shopkeeper: '🥤',
      child_boy: '🎆',
      child_girl: '🪔',
      priest: '🕉️'
    };
    avatarEl.textContent = icons[char.role] || '🪔';

    modal.classList.remove('hidden');

    if (window.festiveAudio && window.festiveAudio.playDiyaChime) {
      window.festiveAudio.playDiyaChime();
    }
  }

  handleDialogueTopic(topic) {
    if (!this.activeCharacter) return;
    const textEl = document.getElementById('dialogueText');
    const lines = this.activeCharacter.dialogues;

    if (lines[topic]) {
      textEl.textContent = lines[topic];
    } else {
      textEl.textContent = lines.greeting;
    }

    if (window.festiveAudio && window.festiveAudio.playCoinClink) {
      window.festiveAudio.playCoinClink();
    }
  }

  closeDialogue() {
    const modal = document.getElementById('societyDialogueModal');
    if (modal) modal.classList.add('hidden');
    this.activeCharacter = null;
  }

  // -----------------------------------------------------------------
  // 2. SOCIETY NOTICEBOARD UI MODAL
  // -----------------------------------------------------------------
  createNoticeboardUI() {
    if (document.getElementById('societyNoticeboardModal')) return;

    const modal = document.createElement('div');
    modal.id = 'societyNoticeboardModal';
    modal.className = 'society-modal-backdrop hidden';
    modal.innerHTML = `
      <div class="society-noticeboard-card">
        <div class="nb-paper">
          <div class="nb-letterhead">
            <div class="nb-om">ॐ</div>
            <h2>GOKUL KUNJ CO-OPERATIVE HOUSING SOCIETY LTD.</h2>
            <p class="nb-sub">Reg. No: BOM/HSG/2026/GOKUL • Powder Galli, Goregaon (East), Mumbai - 400063</p>
            <div class="nb-divider"></div>
          </div>

          <div class="nb-content">
            <h3 class="nb-title">📋 NOTICE: GRAND DIWALI CELEBRATION UTSAV 2026</h3>
            <p class="nb-date">Date: 21st October 2026 • Circular No: 2026/DW-07</p>

            <p class="nb-intro">
              Respected Members & Residents,<br>
              Managing Committee cordially invites all members and their families to the grand Diwali Utsav in our society courtyard and community hall.
            </p>

            <div class="nb-schedule-box">
              <h4>✨ OFFICIAL FESTIVAL PROGRAM ✨</h4>
              <ul>
                <li><strong>09:00 AM:</strong> Floral Rangoli Competition in Central Courtyard (Judged by Madhavi Tai & Babita Ji)</li>
                <li><strong>06:00 PM:</strong> Shree Mandir Maha Lakshmi Pujan & Aarti (Conducted by Pandit Satyanarayan)</li>
                <li><strong>07:30 PM:</strong> Community Hall Sneh Milan & Sweets Distribution (Peda, Kaju Katli & Sharbat by Abdul)</li>
                <li><strong>08:30 PM:</strong> Grand Society Fireworks & Sky Lantern Display (Supervised at Fireworks Pad)</li>
              </ul>
            </div>

            <div class="nb-rules">
              <strong>⚠️ Secretary's Strict Instructions:</strong>
              <p>1. Kindly burst crackers ONLY on the designated Promanade Fireworks Pad. 2. Please keep corridors clean. 3. Discipline and unity is the hallmark of Gokul Kunj!</p>
            </div>

            <div class="nb-signatures">
              <div class="sig-box">
                <span class="sig-name">Aatmaram Tukaram Bhide</span>
                <span class="sig-role">Hon. Secretary (एकमेव सेक्रेटरी)</span>
              </div>
              <div class="sig-box">
                <span class="sig-name">Jatin Patel</span>
                <span class="sig-role">Festival Committee In-Charge</span>
              </div>
            </div>
          </div>

          <div class="nb-actions">
            <button id="triggerCelebrationEventBtn" class="btn btn-gold">
              🎆 Trigger Grand Society Diwali Celebration!
            </button>
            <button id="closeNoticeboardBtn" class="btn btn-secondary">
              Close Notice
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeNbBtn = modal.querySelector('#closeNoticeboardBtn');
    if (closeNbBtn) {
      closeNbBtn.addEventListener('click', () => {
        this.closeNoticeboard();
      });
    }

    const triggerBtn = modal.querySelector('#triggerCelebrationEventBtn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        this.closeNoticeboard();
        this.triggerGrandSocietyCelebration();
      });
    }
  }

  openNoticeboard() {
    const modal = document.getElementById('societyNoticeboardModal');
    if (modal) modal.classList.remove('hidden');
    if (window.festiveAudio && window.festiveAudio.playDiyaChime) {
      window.festiveAudio.playDiyaChime();
    }
  }

  closeNoticeboard() {
    const modal = document.getElementById('societyNoticeboardModal');
    if (modal) modal.classList.add('hidden');
  }

  // -----------------------------------------------------------------
  // 3. GRAND COORDINATED SOCIETY DIWALI CELEBRATION EVENT
  // -----------------------------------------------------------------
  triggerGrandSocietyCelebration() {
    if (this.isSocietyEventActive) return;
    this.isSocietyEventActive = true;

    // 1. Show Grand Celebration Banner
    const banner = document.getElementById('grandCelebrationBanner');
    if (banner) {
      const initText = document.getElementById('celebrationInitiatorText');
      if (initText) {
        initText.textContent = 'Gokul Kunj Co-op Housing Society • Samast Parivar Maha Deepotsav!';
      }
      banner.classList.remove('hidden');
      setTimeout(() => banner.classList.add('hidden'), 5500);
    }

    // 2. Play Devotional Aarti & Temple Chime
    if (window.festiveAudio && window.festiveAudio.playTempleBell) {
      window.festiveAudio.playTempleBell();
    }

    // 3. Direct NPCs to Courtyard & Fireworks Pad
    if (this.npcManager3D) {
      this.npcManager3D.npcs.forEach(npc => {
        // Move towards courtyard center or temple
        const targetWp = Math.random() > 0.5 ? 'chowk_center' : 'temple_front';
        npc.setDestination(targetWp, 2.8);
      });
    }

    // 4. Trigger Grand Fireworks & Sky Lantern Sequence
    if (this.fireworks3D) {
      // Step A: Ground Golden Anars & Spinning Chakris
      setTimeout(() => {
        this.fireworks3D.placeAnar(650, 580, false);
        this.fireworks3D.placeAnar(1410, 800, false);
        this.fireworks3D.placeChakri(620, 600);
      }, 1500);

      // Step B: Ascending Glowing Akash Kandils (Sky Lanterns)
      setTimeout(() => {
        this.fireworks3D.launchLantern(650, 580, false);
        this.fireworks3D.launchLantern(1455, 450, false);
        this.fireworks3D.launchLantern(300, 360, false);
      }, 3500);

      // Step C: Grand Choreographed Sky Rockets over Society Skyline
      setTimeout(() => {
        this.fireworks3D.startSkyFireworksShow(16000);
      }, 5500);
    }

    // 5. Celebration Toast Notification
    const toast = document.createElement('div');
    toast.className = 'society-toast-notification';
    toast.innerHTML = '✨ <strong>Gokul Kunj Diwali Mahotsav:</strong> Entire society is illuminated with joy, sweets & lights! ✨';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 7000);

    // Reset event flag after completion
    setTimeout(() => {
      this.isSocietyEventActive = false;
    }, 22000);
  }
}

window.SocietyInteractions3D = SocietyInteractions3D;

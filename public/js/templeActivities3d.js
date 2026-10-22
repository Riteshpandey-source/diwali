// ===================================================================
// DIWALI 3D TEMPLE PUJA, AARTI & SACRED DECORATION ACTIVITIES
// Orchestrates active temple worship at Shree Mandir, timed ceremonial
// aarti with brass deepam, resonant bell chimes, and volunteer decorating.
// ===================================================================

class DiwaliTempleActivities3D {
  constructor(npcManager) {
    this.mgr = npcManager;
    this.isAartiActive = false;
    this.aartiTimer = 15.0; // Initial time before first aarti
    this.aartiCooldown = 50.0; // Repeat cycle
    this.aartiDuration = 18.0;
    this.aartiStateTimer = 0;
    this.gatheredNpcs = [];
  }

  setupTempleNPCs() {
    // 1. Temple Head Priest (Panditji at the Sacred Mandapa Altar: x=71.8, y=1.6, z=8.0 facing West: rot = -PI/2)
    this.priest = this.mgr.spawnNPC({
      id: 'temple_panditji',
      name: 'Panditji (Head Priest)',
      role: 'priest',
      homeWp: 'temple_altar',
      x: 71.8,
      y: 1.6,
      z: 5.6,
      rotation: -Math.PI / 3,
      colors: { main: 0xea580c, accent: 0xfbbf24, turban: 0xd97706, bottom: 0xea580c, skin: 0xcf9268 },
      prop: 'aarti_lamp'
    });
    this.priest.state = NPCState.IDLE;

    // 2. Devotees Gathering in Temple Mandapa (Facing East toward Altar: rot = PI/2)
    this.devotee1 = this.mgr.spawnNPC({
      id: 'devotee_shanti',
      name: 'Shanti Didi (Devotee)',
      role: 'mother',
      homeWp: 'temple_devotees',
      x: 67.5,
      y: 1.6,
      z: 6.8,
      rotation: Math.PI / 2,
      colors: { main: 0xf59e0b, accent: 0xfbbf24, turban: 0xd97706, bottom: 0xb45309, skin: 0xd49b73 }
    });
    this.devotee1.state = NPCState.PRAYING;

    this.devotee2 = this.mgr.spawnNPC({
      id: 'devotee_gopal',
      name: 'Gopal Ji (Devotee)',
      role: 'father',
      homeWp: 'temple_devotees',
      x: 67.5,
      y: 1.6,
      z: 9.2,
      rotation: Math.PI / 2,
      colors: { main: 0x0284c7, accent: 0xfbbf24, turban: 0x0369a1, bottom: 0xf8fafc, skin: 0xd49b73 }
    });
    this.devotee2.state = NPCState.PRAYING;

    this.devotee3 = this.mgr.spawnNPC({
      id: 'devotee_radha',
      name: 'Radha (Student)',
      role: 'child_girl',
      homeWp: 'temple_devotees',
      x: 66.5,
      y: 1.6,
      z: 8.0,
      rotation: Math.PI / 2,
      colors: { main: 0xdb2777, accent: 0xfbbf24, turban: 0xf43f5e, bottom: 0x7c3aed, skin: 0xdd9a6b }
    });
    this.devotee3.state = NPCState.PRAYING;

    // 3. Colony Volunteer Decorator (Placing marigold garlands & diyas)
    this.decorator = this.mgr.spawnNPC({
      id: 'temple_decorator_lata',
      name: 'Lata (Seva Volunteer)',
      role: 'decorator_woman',
      homeWp: 'temple_diya_s',
      x: 65.5,
      y: 1.6,
      z: 12.5,
      rotation: 0,
      colors: { main: 0x059669, accent: 0xf59e0b, turban: 0x047857, bottom: 0x065f46, skin: 0xd49b73 },
      prop: 'flower_basket'
    });
    this.decorator.state = NPCState.LIGHTING_DIYA;
  }

  update(delta) {
    if (this.isAartiActive) {
      this.aartiStateTimer += delta;
      this.updateAartiSequence();
    } else {
      this.aartiTimer -= delta;
      if (this.aartiTimer <= 0) {
        this.triggerAartiSequence('schedule');
      }
    }
  }

  // Trigger the timed ceremonial Aarti sequence
  triggerAartiSequence(source = 'schedule') {
    if (this.isAartiActive) return;

    this.isAartiActive = true;
    this.aartiStateTimer = 0;
    this.midwayBellRung = false;

    // 1. Resonant Temple Bells Chime
    if (typeof window !== 'undefined' && window.festiveAudio && typeof window.festiveAudio.playTempleBell === 'function') {
      window.festiveAudio.playTempleBell();
    }

    // 1b. Notify Mandir Aarti Controller (Single-stream protected, non-blocking)
    if (typeof window !== 'undefined' && window.diwaliAartiController && typeof window.diwaliAartiController.onTempleAartiStarted === 'function') {
      window.diwaliAartiController.onTempleAartiStarted(source);
    }

    // 2. Priest enters AARTI state with circular brass lamp motion
    if (this.priest) {
      this.priest.state = NPCState.AARTI;
      this.priest.showDialogue('ॐ श्री महालक्ष्म्यै नमः! ॐ गं गणपतये नमः! Deepawali Maha Aarti begins!', 4.8);
    }

    // 3. Resident Devotees join hands in Anjali Mudra prayer bow
    const devotees = [this.devotee1, this.devotee2, this.devotee3];
    devotees.forEach(d => {
      if (d) {
        d.state = NPCState.PRAYING;
        d.stateDuration = this.aartiDuration;
      }
    });

    // 4. Nearby Colony NPCs gather and respectfully participate
    this.gatheredNpcs = [];
    if (this.mgr && Array.isArray(this.mgr.npcs)) {
      this.mgr.npcs.forEach(npc => {
        if (!npc || npc === this.priest || npc === this.devotee1 || npc === this.devotee2 || npc === this.devotee3) return;
        const dist = Math.hypot(npc.x - 70.0, npc.z - 8.0);
        if (dist <= 30.0) {
          this.gatheredNpcs.push(npc);
          // Face the sacred altar (x=73.4, z=8.0)
          npc.targetRotation = Math.atan2(8.0 - npc.z, 73.4 - npc.x);
          npc.state = NPCState.PRAYING;
          npc.stateDuration = this.aartiDuration;
          if (Math.random() < 0.6) {
            const chants = ['✨ Jai Maa Lakshmi!', '🪔 Ganpati Bappa Morya!', '🙏 Shubh Deepawali!', '✨ Har Har Mahadev!'];
            npc.showDialogue(chants[Math.floor(Math.random() * chants.length)], 3.5);
          }
        }
      });
    }

    if (source === 'player' && typeof window !== 'undefined' && window.diwaliEngine3D) {
      window.diwaliEngine3D.showToastNotice('🔔 Sacred Deepawali Maha Aarti commenced at Shree Mandir!');
    }
  }

  updateAartiSequence() {
    const t = this.aartiStateTimer;

    // Midway bell chime & divine praise
    if (t > 8.0 && !this.midwayBellRung) {
      this.midwayBellRung = true;
      if (typeof window !== 'undefined' && window.festiveAudio && typeof window.festiveAudio.playTempleBell === 'function') {
        window.festiveAudio.playTempleBell();
      }
      if (this.devotee1) {
        this.devotee1.showDialogue('ॐ जय जगदीश हरे... Jai Lakshmi-Ganesha!', 3.8);
      }
    }

    // Volunteer places flower garland on balustrade
    if (t > 12.0 && this.decorator && this.decorator.state !== NPCState.LIGHTING_DIYA) {
      this.decorator.state = NPCState.LIGHTING_DIYA;
      this.decorator.stateTimer = 0;
    }

    // Conclude Aarti and return NPCs to normal routines
    if (t >= this.aartiDuration) {
      this.isAartiActive = false;
      this.midwayBellRung = false;
      this.aartiTimer = this.aartiCooldown;

      if (this.priest) {
        this.priest.state = NPCState.IDLE;
        this.priest.showDialogue('ॐ महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि तन्नो लक्ष्मीः प्रचोदयात्। Happy Diwali!', 5.0);
      }

      const devotees = [this.devotee1, this.devotee2, this.devotee3];
      devotees.forEach(d => {
        if (d) {
          d.state = NPCState.PRAYING;
          d.stateTimer = 0;
          d.stateDuration = 5.0;
        }
      });

      // Gathered NPCs return smoothly to their autonomous life
      if (Array.isArray(this.gatheredNpcs)) {
        this.gatheredNpcs.forEach(npc => {
          if (npc) {
            npc.state = NPCState.IDLE;
            npc.stateTimer = 0;
            npc.stateDuration = 2.0 + Math.random() * 3.0;
            if (this.mgr.nav && typeof npc.selectNextAutonomousActivity === 'function') {
              npc.selectNextAutonomousActivity(this.mgr.nav);
            }
          }
        });
        this.gatheredNpcs = [];
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.DiwaliTempleActivities3D = DiwaliTempleActivities3D;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiwaliTempleActivities3D;
}

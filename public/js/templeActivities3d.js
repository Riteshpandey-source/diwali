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
  }

  setupTempleNPCs() {
    // 1. Temple Head Priest (Panditji at the Sacred Sanctum Altar: x=73.5, z=8.0 facing West: rot = -PI/2)
    this.priest = this.mgr.spawnNPC({
      id: 'temple_panditji',
      name: 'Panditji (Head Priest)',
      role: 'priest',
      homeWp: 'temple_altar',
      x: 73.5,
      z: 8.0,
      rotation: -Math.PI / 2,
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
      x: 68.0,
      z: 7.2,
      rotation: Math.PI / 2,
      colors: { main: 0xf59e0b, accent: 0xfbbf24, turban: 0xd97706, bottom: 0xb45309, skin: 0xd49b73 }
    });
    this.devotee1.state = NPCState.PRAYING;

    this.devotee2 = this.mgr.spawnNPC({
      id: 'devotee_gopal',
      name: 'Gopal Ji (Devotee)',
      role: 'father',
      homeWp: 'temple_devotees',
      x: 68.0,
      z: 9.0,
      rotation: Math.PI / 2,
      colors: { main: 0x0284c7, accent: 0xfbbf24, turban: 0x0369a1, bottom: 0xf8fafc, skin: 0xd49b73 }
    });
    this.devotee2.state = NPCState.PRAYING;

    this.devotee3 = this.mgr.spawnNPC({
      id: 'devotee_radha',
      name: 'Radha (Student)',
      role: 'child_girl',
      homeWp: 'temple_devotees',
      x: 67.2,
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
      z: 13.5,
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

    // 1. Resonant Temple Bells Chime
    if (typeof window !== 'undefined' && window.festiveAudio && typeof window.festiveAudio.playTempleBell === 'function') {
      window.festiveAudio.playTempleBell();
    }

    // 2. Priest enters AARTI state with circular brass lamp motion
    if (this.priest) {
      this.priest.state = NPCState.AARTI;
      this.priest.showDialogue('ॐ जय जगदीश हरे... Shubh Deepawali Aarti begins!', 4.5);
    }

    // 3. Devotees join hands in Anjali Mudra prayer bow
    const devotees = [this.devotee1, this.devotee2, this.devotee3];
    devotees.forEach(d => {
      if (d) {
        d.state = NPCState.PRAYING;
        d.stateDuration = this.aartiDuration;
      }
    });

    if (source === 'player' && typeof window !== 'undefined' && window.diwaliEngine3D) {
      window.diwaliEngine3D.showToastNotice('🔔 Sacred Deepawali Aarti commenced at Shree Mandir!');
    }
  }

  updateAartiSequence() {
    const t = this.aartiStateTimer;

    // Midway bell chime
    if (t > 8.0 && !this.midwayBellRung) {
      this.midwayBellRung = true;
      if (typeof window !== 'undefined' && window.festiveAudio && typeof window.festiveAudio.playTempleBell === 'function') {
        window.festiveAudio.playTempleBell();
      }
      if (this.devotee1) {
        this.devotee1.showDialogue('Jai Lakshmi Mata! Har Har Mahadev!', 3.5);
      }
    }

    // Volunteer places flower garland on balustrade
    if (t > 12.0 && this.decorator && this.decorator.state !== NPCState.LIGHTING_DIYA) {
      this.decorator.state = NPCState.LIGHTING_DIYA;
      this.decorator.stateTimer = 0;
    }

    // Conclude Aarti
    if (t >= this.aartiDuration) {
      this.isAartiActive = false;
      this.midwayBellRung = false;
      this.aartiTimer = this.aartiCooldown;

      if (this.priest) {
        this.priest.state = NPCState.IDLE;
        this.priest.showDialogue('May the divine light of Deepawali bless all with health and peace!', 4.0);
      }

      const devotees = [this.devotee1, this.devotee2, this.devotee3];
      devotees.forEach(d => {
        if (d) {
          d.state = NPCState.IDLE;
          d.stateTimer = 0;
          d.stateDuration = 4.0;
        }
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.DiwaliTempleActivities3D = DiwaliTempleActivities3D;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiwaliTempleActivities3D;
}

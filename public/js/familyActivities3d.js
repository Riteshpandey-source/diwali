// ===================================================================
// DIWALI 3D FAMILY ACTIVITIES & RESIDENTIAL CELEBRATIONS
// Coordinates autonomous residential family groups, playful children,
// bazaar errands, and synchronized group fireworks celebrations.
// ===================================================================

class DiwaliFamilyActivities3D {
  constructor(npcManager) {
    this.mgr = npcManager;
    this.familyGroups = [];
    this.activeFireworksTimers = [];
  }

  // Set up resident families outside their respective homes
  setupFamilies() {
    // -------------------------------------------------------------
    // FAMILY 1: SHARMA FAMILY (Outside Sharma Niwas Haveli: x=-59, z=-17)
    // -------------------------------------------------------------
    const ramesh = this.mgr.spawnNPC({
      id: 'sharma_ramesh',
      name: 'Ramesh (Father)',
      role: 'father',
      homeWp: 'home_sharma',
      x: -56.5,
      z: -16.5,
      rotation: Math.PI / 2,
      colors: { main: 0x0284c7, accent: 0xfbbf24, turban: 0xe11d48, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    const pooja = this.mgr.spawnNPC({
      id: 'sharma_pooja',
      name: 'Pooja (Mother)',
      role: 'mother',
      homeWp: 'home_sharma',
      x: -58.0,
      z: -15.8,
      rotation: Math.PI / 2,
      colors: { main: 0xe11d48, accent: 0xfbbf24, turban: 0x991b1b, bottom: 0xbe123c, skin: 0xd49b73 }
    });

    const aarav = this.mgr.spawnNPC({
      id: 'sharma_aarav',
      name: 'Aarav (Son)',
      role: 'child_boy',
      homeWp: 'home_sharma',
      x: -54.0,
      z: -16.0,
      rotation: -Math.PI / 2,
      colors: { main: 0xf97316, accent: 0xfbbf24, turban: 0xf59e0b, bottom: 0xf8fafc, skin: 0xdd9a6b }
    });

    this.familyGroups.push({
      id: 'family_sharma',
      homeWp: 'home_sharma',
      playAreaWp: 'fw_court_sharma',
      adults: [ramesh, pooja],
      children: [aarav],
      cooldown: 24.0,
      timer: 10.0
    });

    // -------------------------------------------------------------
    // FAMILY 2: VERMA FAMILY (Outside Verma Villa: x=-24.5, z=-17)
    // -------------------------------------------------------------
    const vikram = this.mgr.spawnNPC({
      id: 'verma_vikram',
      name: 'Vikram (Father)',
      role: 'father',
      homeWp: 'home_verma',
      x: -22.5,
      z: -16.5,
      rotation: Math.PI / 4,
      colors: { main: 0x059669, accent: 0xfbbf24, turban: 0xd97706, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    const ananya = this.mgr.spawnNPC({
      id: 'verma_ananya',
      name: 'Ananya (Mother)',
      role: 'mother',
      homeWp: 'home_verma',
      x: -24.0,
      z: -15.5,
      rotation: Math.PI / 3,
      colors: { main: 0x7c3aed, accent: 0xfbbf24, turban: 0x6d28d9, bottom: 0x5b21b6, skin: 0xd49b73 }
    });

    const meera = this.mgr.spawnNPC({
      id: 'verma_meera',
      name: 'Meera (Daughter)',
      role: 'child_girl',
      homeWp: 'home_verma',
      x: -20.5,
      z: -16.0,
      rotation: -Math.PI / 3,
      colors: { main: 0xdb2777, accent: 0xf59e0b, turban: 0xf43f5e, bottom: 0x9333ea, skin: 0xdd9a6b }
    });

    this.familyGroups.push({
      id: 'family_verma',
      homeWp: 'home_verma',
      playAreaWp: 'fw_court_verma',
      adults: [vikram, ananya],
      children: [meera],
      cooldown: 28.0,
      timer: 18.0
    });

    // -------------------------------------------------------------
    // FAMILY 3: GUPTA ELDER (Outside Gupta Bhavan: x=10.5, z=-17)
    // -------------------------------------------------------------
    const dadaji = this.mgr.spawnNPC({
      id: 'gupta_dadaji',
      name: 'Dadaji (Elder)',
      role: 'grandparent',
      homeWp: 'home_gupta',
      x: 10.5,
      z: -16.0,
      rotation: 0,
      colors: { main: 0xfef3c7, accent: 0xd97706, turban: 0x94a3b8, bottom: 0xf8fafc, skin: 0xc88f68 }
    });

    // -------------------------------------------------------------
    // GROUP FIREWORKS CELEBRATION (On Promenade Fireworks Pad: x=52, z=-18)
    // -------------------------------------------------------------
    const kunal = this.mgr.spawnNPC({
      id: 'group_kunal',
      name: 'Kunal (Resident)',
      role: 'father',
      homeWp: 'prom_north',
      x: 51.5,
      z: -18.0,
      rotation: -Math.PI / 4,
      colors: { main: 0xea580c, accent: 0xfbbf24, turban: 0xb45309, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    const neha = this.mgr.spawnNPC({
      id: 'group_neha',
      name: 'Neha (Resident)',
      role: 'mother',
      homeWp: 'prom_north',
      x: 53.5,
      z: -19.5,
      rotation: Math.PI / 2,
      colors: { main: 0x0284c7, accent: 0xfbbf24, turban: 0x0369a1, bottom: 0x0284c7, skin: 0xd49b73 }
    });

    const raj = this.mgr.spawnNPC({
      id: 'group_raj',
      name: 'Raj (Student)',
      role: 'father',
      homeWp: 'prom_north',
      x: 50.0,
      z: -19.0,
      rotation: 0,
      colors: { main: 0x10b981, accent: 0xfbbf24, turban: 0x047857, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    this.groupCelebration = {
      lead: kunal,
      observers: [neha, raj],
      padWp: 'fw_promenade',
      cooldown: 35.0,
      timer: 20.0
    };

    // -------------------------------------------------------------
    // BAZAAR SHOPKEEPER & ERRAND RESIDENT
    // -------------------------------------------------------------
    const shopkeeper = this.mgr.spawnNPC({
      id: 'bazaar_kaka',
      name: 'Ganesh Kaka (Shopkeeper)',
      role: 'shopkeeper',
      homeWp: 'bazaar_inside',
      x: 33.5,
      z: 9.0,
      rotation: Math.PI / 2,
      colors: { main: 0x854d0e, accent: 0xf59e0b, turban: 0xe11d48, bottom: 0xf8fafc, skin: 0xc88b62 }
    });

    const shopper = this.mgr.spawnNPC({
      id: 'errand_suresh',
      name: 'Suresh (Visitor)',
      role: 'father',
      homeWp: 'home_singh',
      x: 41.5,
      z: 9.0,
      rotation: -Math.PI / 2,
      colors: { main: 0x4f46e5, accent: 0xfbbf24, turban: 0x4338ca, bottom: 0xf8fafc, skin: 0xd49b73 }
    });
    shopper.state = NPCState.SHOPPING;
    shopper.stateDuration = 5.0;
  }

  update(delta) {
    // 1. Update Residential Family Routines
    for (let f of this.familyGroups) {
      f.timer -= delta;
      if (f.timer <= 0) {
        f.timer = f.cooldown + Math.random() * 5.0;
        this.triggerFamilyFireworks(f);
      }
    }

    // 2. Update Group Fireworks Celebration
    if (this.groupCelebration) {
      this.groupCelebration.timer -= delta;
      if (this.groupCelebration.timer <= 0) {
        this.groupCelebration.timer = this.groupCelebration.cooldown + Math.random() * 8.0;
        this.triggerGroupFireworks(this.groupCelebration);
      }
    }
  }

  triggerFamilyFireworks(family) {
    const child = family.children[0];
    const parent = family.adults[0];

    if (!child || !parent) return;

    // Child moves to residential celebration pad to light cracker
    child.state = NPCState.USING_VIRTUAL_FIREWORKS;
    child.stateTimer = 0;
    child.actionExecuted = false;
    child.showDialogue('Look Mama & Papa! Lighting my phuljhadi!', 3.5);

    // Parent turns towards child, raises hands celebrating
    setTimeout(() => {
      parent.state = NPCState.WATCHING_FIREWORKS;
      parent.stateTimer = 0;
      parent.stateDuration = 4.0;
      parent.showDialogue('Shabash Aarav! Shubh Deepawali!', 3.5);
    }, 1500);
  }

  triggerGroupFireworks(group) {
    const lead = group.lead;
    if (!lead) return;

    lead.state = NPCState.USING_VIRTUAL_FIREWORKS;
    lead.stateTimer = 0;
    lead.actionExecuted = false;
    lead.showDialogue('Happy Diwali everyone! Launching Sky Rocket!', 3.5);

    // Observers watch the sky
    setTimeout(() => {
      for (let obs of group.observers) {
        obs.state = NPCState.WATCHING_FIREWORKS;
        obs.stateTimer = 0;
        obs.stateDuration = 5.0;
      }
      if (group.observers[0]) {
        group.observers[0].showDialogue('Waah! Happy Diwali!', 3.0);
      }
    }, 2000);
  }
}

if (typeof window !== 'undefined') {
  window.DiwaliFamilyActivities3D = DiwaliFamilyActivities3D;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiwaliFamilyActivities3D;
}

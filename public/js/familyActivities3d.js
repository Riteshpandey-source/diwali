// ===================================================================
// GOKUL KUNJ CO-OP HOUSING SOCIETY - LIVING RESIDENTIAL FAMILIES
// Coordinates autonomous sitcom-inspired residential families, playful
// children (Tappu Sena), courtyard socializing, and festive celebrations.
// ===================================================================

class DiwaliFamilyActivities3D {
  constructor(npcManager) {
    this.mgr = npcManager;
    this.familyGroups = [];
    this.activeFireworksTimers = [];
  }

  // Set up resident families outside their respective homes in Gokul Kunj
  setupFamilies() {
    // -------------------------------------------------------------
    // FAMILY 1: PATEL / GADA FAMILY (Outside Wing D / Patel Niwas: x=-59, z=22)
    // -------------------------------------------------------------
    const jatin = this.mgr.spawnNPC({
      id: 'jatin_patel',
      name: 'Jatin Patel (Businessman)',
      role: 'business_owner',
      homeWp: 'home_patel',
      x: -56.5,
      z: 22.5,
      rotation: -Math.PI / 2,
      colors: { main: 0x0284c7, accent: 0xf59e0b, turban: 0x0284c7, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    const daya = this.mgr.spawnNPC({
      id: 'daya_ben',
      name: 'Daya Ben (Homemaker)',
      role: 'mother',
      homeWp: 'home_patel',
      x: -58.2,
      z: 21.8,
      rotation: -Math.PI / 2,
      colors: { main: 0xe11d48, accent: 0xfacc15, turban: 0xbe123c, bottom: 0x9f1239, skin: 0xd49b73 }
    });

    const tapu = this.mgr.spawnNPC({
      id: 'tapu_kid',
      name: 'Tipendra / Tapu (Child)',
      role: 'child_boy',
      homeWp: 'home_patel',
      x: -54.0,
      z: 20.0,
      rotation: Math.PI / 2,
      colors: { main: 0xf97316, accent: 0xfde047, turban: 0xea580c, bottom: 0xf8fafc, skin: 0xdd9a6b }
    });

    this.familyGroups.push({
      id: 'family_patel',
      homeWp: 'home_patel',
      playAreaWp: 'fw_court_sharma',
      adults: [jatin, daya],
      children: [tapu],
      cooldown: 25.0,
      timer: 10.0
    });

    // -------------------------------------------------------------
    // FAMILY 2: BHIDE FAMILY (Outside Wing B / Bhide Niwas: x=-24.5, z=-25)
    // -------------------------------------------------------------
    const bhide = this.mgr.spawnNPC({
      id: 'aatmaram_bhide',
      name: 'Aatmaram T. Bhide (Secretary)',
      role: 'society_secretary',
      homeWp: 'home_verma',
      x: -22.5,
      z: -24.5,
      rotation: Math.PI / 4,
      colors: { main: 0x059669, accent: 0xd97706, turban: 0x047857, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    const madhavi = this.mgr.spawnNPC({
      id: 'madhavi_bhide',
      name: 'Madhavi Tai (Businesswoman)',
      role: 'mother',
      homeWp: 'home_verma',
      x: -24.5,
      z: -23.5,
      rotation: Math.PI / 3,
      colors: { main: 0x7c3aed, accent: 0xfbbf24, turban: 0x6d28d9, bottom: 0x5b21b6, skin: 0xd49b73 }
    });

    const sonu = this.mgr.spawnNPC({
      id: 'sonu_kid',
      name: 'Sonu (Student)',
      role: 'child_girl',
      homeWp: 'home_verma',
      x: -20.5,
      z: -22.0,
      rotation: -Math.PI / 3,
      colors: { main: 0xec4899, accent: 0xf59e0b, turban: 0xdb2777, bottom: 0x7c3aed, skin: 0xdd9a6b }
    });

    this.familyGroups.push({
      id: 'family_bhide',
      homeWp: 'home_verma',
      playAreaWp: 'fw_court_verma',
      adults: [bhide, madhavi],
      children: [sonu],
      cooldown: 30.0,
      timer: 16.0
    });

    // -------------------------------------------------------------
    // FAMILY 3: TAARAK WRITER & ANJALI (Wing E / Courtyard Garden: x=-24.5, z=22)
    // -------------------------------------------------------------
    const taarak = this.mgr.spawnNPC({
      id: 'taarak_writer',
      name: 'Taarak (Writer & Thinker)',
      role: 'writer',
      homeWp: 'home_mukherjee',
      x: -22.0,
      z: 22.0,
      rotation: -Math.PI / 3,
      colors: { main: 0x2563eb, accent: 0x38bdf8, turban: 0x1d4ed8, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    const anjali = this.mgr.spawnNPC({
      id: 'anjali_resident',
      name: 'Anjali (Wellness Expert)',
      role: 'mother',
      homeWp: 'home_mukherjee',
      x: -24.0,
      z: 21.0,
      rotation: -Math.PI / 4,
      colors: { main: 0x10b981, accent: 0xf43f5e, turban: 0x059669, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    this.familyGroups.push({
      id: 'family_mehta',
      homeWp: 'home_mukherjee',
      playAreaWp: 'chowk_center',
      adults: [taarak, anjali],
      children: [],
      cooldown: 35.0,
      timer: 20.0
    });

    // -------------------------------------------------------------
    // FAMILY 4: SODHI & RESIDENTS (On Promenade Fireworks Pad: x=52, z=-18)
    // -------------------------------------------------------------
    const sodhi = this.mgr.spawnNPC({
      id: 'roshan_sodhi',
      name: 'Roshan Singh Sodhi (Resident)',
      role: 'boisterous_friend',
      homeWp: 'prom_north',
      x: 52.0,
      z: -18.0,
      rotation: -Math.PI / 4,
      colors: { main: 0xea580c, accent: 0xfde047, turban: 0xf97316, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    const roshanBhabhi = this.mgr.spawnNPC({
      id: 'roshan_bhabhi',
      name: 'Roshan Bhabhi (Resident)',
      role: 'mother',
      homeWp: 'prom_north',
      x: 53.5,
      z: -16.5,
      rotation: -Math.PI / 3,
      colors: { main: 0xdb2777, accent: 0xfacc15, turban: 0xbe185d, bottom: 0x9d174d, skin: 0xe2a882 }
    });

    this.groupCelebration = {
      lead: sodhi,
      participants: [roshanBhabhi],
      cooldown: 28.0,
      timer: 8.0
    };

    // -------------------------------------------------------------
    // COMMUNITY CHARACTERS: DR. HATHI, IYER, BABITA, POPATLAL, ABDUL
    // -------------------------------------------------------------
    const drHathi = this.mgr.spawnNPC({
      id: 'dr_hathi',
      name: 'Dr. Hansraj (Physician)',
      role: 'doctor',
      homeWp: 'bazaar_area',
      x: 50.0,
      z: 14.0,
      rotation: -Math.PI / 2,
      colors: { main: 0x0d9488, accent: 0xfbbf24, turban: 0x0f766e, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    const iyer = this.mgr.spawnNPC({
      id: 'subramaniam_iyer',
      name: 'Subramaniam Iyer (Scientist)',
      role: 'scientist',
      homeWp: 'home_singh',
      x: 10.5,
      z: 22.0,
      rotation: -Math.PI / 2,
      colors: { main: 0xfef9c3, accent: 0xb45309, turban: 0x78350f, bottom: 0xf8fafc, skin: 0xc88f68 }
    });

    const babita = this.mgr.spawnNPC({
      id: 'babita_ji',
      name: 'Babita (Resident)',
      role: 'mother',
      homeWp: 'home_singh',
      x: 12.0,
      z: 21.0,
      rotation: -Math.PI / 2,
      colors: { main: 0xec4899, accent: 0x38bdf8, turban: 0xdb2777, bottom: 0xbe185d, skin: 0xe2a882 }
    });

    const popat = this.mgr.spawnNPC({
      id: 'popat_patrakar',
      name: 'Popatlal (Reporter)',
      role: 'reporter',
      homeWp: 'chowk_center',
      x: -16.0,
      z: 0.0,
      rotation: Math.PI / 2,
      colors: { main: 0xfacc15, accent: 0xb91c1c, turban: 0xd97706, bottom: 0xf8fafc, skin: 0xd49b73 }
    });

    const abdul = this.mgr.spawnNPC({
      id: 'abdul_kaka',
      name: 'Abdul Kaka (All-in-One Store)',
      role: 'shopkeeper',
      homeWp: 'entrance_gate',
      x: -49.2,
      z: -11.5,
      rotation: -Math.PI / 2, // Facing West (-x) directly behind the counter towards players arriving outside the gate
      colors: { main: 0x047857, accent: 0xfbbf24, turban: 0x065f46, bottom: 0xf8fafc, skin: 0xc88f68 }
    });

    // Register Interactive Targets for each resident so player can talk to them!
    const allSocietyNPCs = [
      jatin, daya, tapu, bhide, madhavi, sonu, taarak, anjali,
      sodhi, roshanBhabhi, drHathi, iyer, babita, popat, abdul
    ];

    if (this.mgr.world3D && this.mgr.world3D.interactiveTargets) {
      allSocietyNPCs.forEach(npc => {
        if (!npc) return;
        this.mgr.world3D.interactiveTargets.push({
          id: 'npc_' + npc.id,
          name: npc.name,
          type: 'society_npc',
          x: npc.x,
          z: npc.z,
          radius: 2.8,
          prompt: `[E] Talk to ${npc.name}`,
          data: { characterId: npc.id, npcRef: npc }
        });
      });
    }
  }

  update(delta) {
    // 1. Update Residential Family Celebrations
    for (const f of this.familyGroups) {
      f.timer -= delta;
      if (f.timer <= 0) {
        f.timer = f.cooldown + Math.random() * 8.0;
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
    if (!family.children.length) return;
    const child = family.children[Math.floor(Math.random() * family.children.length)];
    if (!child || child.state !== NPCState.IDLE) return;

    // Direct child to safe festive play area
    child.setDestination(family.playAreaWp, 2.5);
    child.state = NPCState.USING_VIRTUAL_FIREWORKS;
    child.stateTimer = 0;
    child.actionExecuted = false;

    // Parents turn to watch child with festive joy
    family.adults.forEach(parent => {
      if (parent && parent.state === NPCState.IDLE) {
        parent.faceTarget(child.x, child.z);
        parent.state = NPCState.WATCHING_FIREWORKS;
        parent.stateTimer = 0;
        parent.stateDuration = 4.5;
      }
    });
  }

  triggerGroupFireworks(group) {
    const lead = group.lead;
    if (!lead || lead.state !== NPCState.IDLE) return;

    // Lead launches virtual fireworks at Promenade pad
    lead.state = NPCState.USING_VIRTUAL_FIREWORKS;
    lead.stateTimer = 0;
    lead.actionExecuted = false;

    // Observers react and cheer
    group.participants.forEach(obs => {
      if (obs && obs.state === NPCState.IDLE) {
        obs.faceTarget(lead.x, lead.z);
        obs.state = NPCState.WATCHING_FIREWORKS;
        obs.stateTimer = 0;
        obs.stateDuration = 5.0;
      }
    });
  }
}

window.DiwaliFamilyActivities3D = DiwaliFamilyActivities3D;

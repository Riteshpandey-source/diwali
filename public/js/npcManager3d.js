// ===================================================================
// DIWALI 3D NPC MANAGER - LIVING COLONY ORCHESTRATOR
// Manages the population of 3D Indian festive characters, coordinates
// autonomous navigation, family routines, temple puja, and educational kiosk.
// ===================================================================

class DiwaliNPCManager3D {
  constructor(scene, world3D, fireworks3D) {
    this.scene = scene;
    this.world3D = world3D;
    this.fireworks3D = fireworks3D;

    this.npcs = new Map(); // id -> DiwaliNPC3D instance

    // 1. Initialize Navigation Mesh / Waypoint Graph
    this.nav = new DiwaliNavigation3D(this.world3D);

    // 2. Initialize Subsystems
    this.familyActivities = new DiwaliFamilyActivities3D(this);
    this.templeActivities = new DiwaliTempleActivities3D(this);

    // Setup Families & Temple NPCs
    this.familyActivities.setupFamilies();
    this.templeActivities.setupTempleNPCs();

    // 3. Initialize Educational Area & Storyteller
    this.education3D = new DiwaliEducation3D(this.scene, this.world3D, this);

    console.log(`🌟 [NPCManager3D] Living 3D Diwali Colony populated with ${this.npcs.size} active Indian festive NPCs!`);
  }

  spawnNPC(config) {
    if (this.npcs.has(config.id)) {
      this.removeNPC(config.id);
    }

    if (config.y === undefined && this.world3D && typeof this.world3D.getElevation === 'function') {
      config.y = this.world3D.getElevation(config.x || 0, config.z || 0);
    }

    const npc = new DiwaliNPC3D(config);
    this.npcs.set(config.id, npc);
    this.scene.add(npc.group);
    return npc;
  }

  removeNPC(id) {
    const npc = this.npcs.get(id);
    if (npc) {
      this.scene.remove(npc.group);
      this.npcs.delete(id);
    }
  }

  getNPC(id) {
    return this.npcs.get(id);
  }

  // -------------------------------------------------------------
  // UPDATE LOOP (CALLED FROM ENGINE3D)
  // -------------------------------------------------------------
  update(delta, elapsedTime, player3D) {
    const playerX = player3D ? player3D.x : 0;
    const playerZ = player3D ? player3D.z : 0;

    // 1. Update Subsystem Routines
    if (this.familyActivities) {
      this.familyActivities.update(delta);
    }
    if (this.templeActivities) {
      this.templeActivities.update(delta);
    }
    if (this.education3D) {
      this.education3D.update(delta);
    }

    // 2. Update Individual NPCs with Distance LOD Optimization
    this.npcs.forEach(npc => {
      const distToPlayer = Math.hypot(npc.x - playerX, npc.z - playerZ);

      // LOD Tier 1: Far away (> 65m) - skip mesh & skeletal animations completely
      if (distToPlayer > 65.0) {
        npc.stateTimer += delta;
        return;
      }

      // LOD Tier 2: Mid-distance (35m - 65m) - update at half rate (30 FPS)
      if (distToPlayer > 35.0) {
        npc._lodFrame = (npc._lodFrame || 0) + 1;
        if (npc._lodFrame % 2 !== 0) return;
        npc.update(delta * 2, this.nav, this.fireworks3D, player3D);
        return;
      }

      // LOD Tier 3: Near player (<= 35m) - full 60 FPS smooth animation
      npc.update(delta, this.nav, this.fireworks3D, player3D);
    });
  }

  // Environmental Reaction: Called when a sky rocket or big firework bursts
  onFireworksBurst(x, y, z) {
    this.npcs.forEach(npc => {
      npc.onFireworksBurstNearby(x, y, z);
    });
  }

  // Trigger Temple Aarti sequence (interactively via [E] or auto)
  triggerTempleAarti() {
    if (this.templeActivities) {
      this.templeActivities.triggerAartiSequence('player');
    }
  }

  // Open Diwali Education Modal
  openEducationModal() {
    if (this.education3D) {
      this.education3D.openEducationModal();
    }
  }
}

if (typeof window !== 'undefined') {
  window.DiwaliNPCManager3D = DiwaliNPCManager3D;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiwaliNPCManager3D;
}

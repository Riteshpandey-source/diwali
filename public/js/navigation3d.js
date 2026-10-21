// ===================================================================
// DIWALI 3D COLONY NAVIGATION & WAYPOINT PATHFINDING
// Defines authentic walkable paths across colony roads, havelis,
// chowk piazza, bazaar promenade, and the Shree Mandir temple.
// ===================================================================

class DiwaliNavigation3D {
  constructor(world3D) {
    this.world3D = world3D;

    // Spatial translation matching engine (2D -> 3D)
    this.scale = 0.1;
    this.centerX = 890;
    this.centerZ = 610;

    // Colony Key Waypoints (in 3D coordinates)
    this.waypoints = {
      // 1. Residential North Road Fronts (Y_2D = 440 => Z_3D = -17.0)
      home_sharma:    { id: 'home_sharma',    x: -59.0, z: -17.0, label: 'Sharma Niwas Front' },
      home_verma:     { id: 'home_verma',     x: -24.5, z: -17.0, label: 'Verma Villa Front' },
      home_gupta:     { id: 'home_gupta',     x:  10.5, z: -17.0, label: 'Gupta Bhavan Front' },

      // 2. Residential South Road Fronts (Y_2D = 740 => Z_3D = +13.0)
      home_patel:     { id: 'home_patel',     x: -59.0, z:  13.0, label: 'Patel Sadan Front' },
      home_mukherjee: { id: 'home_mukherjee', x: -24.5, z:  13.0, label: 'Mukherjee Kunj Front' },
      home_singh:     { id: 'home_singh',     x:  10.5, z:  13.0, label: 'Singh Residence Front' },

      // 3. East-West Road Junctions & Spine Road
      road_nw:        { id: 'road_nw',        x: -75.0, z: -17.0, label: 'North-West Road Corner' },
      road_ne:        { id: 'road_ne',        x:  30.0, z: -17.0, label: 'North Road East Junction' },
      road_sw:        { id: 'road_sw',        x: -75.0, z:  13.0, label: 'South-West Road Corner' },
      road_se:        { id: 'road_se',        x:  30.0, z:  13.0, label: 'South Road East Junction' },

      // 4. Central Chowk Piazza (X_2D = 650, Y_2D = 580 => X_3D = -24.0, Z_3D = -3.0)
      chowk_center:   { id: 'chowk_center',   x: -24.0, z:  -3.0, label: 'Central Chowk Piazza' },
      chowk_north:    { id: 'chowk_north',    x: -24.0, z: -10.0, label: 'Chowk North Approach' },
      chowk_south:    { id: 'chowk_south',    x: -24.0, z:   6.0, label: 'Chowk South Approach' },
      chowk_east:     { id: 'chowk_east',     x: -12.0, z:  -3.0, label: 'Chowk East Open Area' },

      // 5. Grand Celebration Promenade & Avenue
      prom_north:     { id: 'prom_north',     x:  50.0, z: -30.0, label: 'Promenade North Entry' },
      prom_mid:       { id: 'prom_mid',       x:  50.5, z:   0.0, label: 'Promenade Center Vista' },
      prom_south:     { id: 'prom_south',     x:  50.5, z:  24.0, label: 'Promenade South Entry' },

      // 6. Diwali Bazaar Stalls (West side of Promenade)
      bazaar_front:   { id: 'bazaar_front',   x:  41.5, z:   9.0, label: 'Diwali Bazaar Counter' },
      bazaar_inside:  { id: 'bazaar_inside',  x:  33.5, z:   9.0, label: 'Bazaar Shopkeeper Stall' },
      rangoli_front:  { id: 'rangoli_front',  x:  41.5, z:  28.0, label: 'Rangoli Pavilion Counter' },

      // 7. Shree Mandir Temple Complex (East side of Promenade)
      temple_entry:   { id: 'temple_entry',   x:  58.0, z:   8.0, label: 'Temple Promenade Gateway' },
      temple_steps:   { id: 'temple_steps',   x:  64.0, z:   8.0, label: 'Temple Marble Steps' },
      temple_devotees:{ id: 'temple_devotees',x:  68.0, z:   8.0, label: 'Temple Devotees Area' },
      temple_altar:   { id: 'temple_altar',   x:  73.5, z:   8.0, label: 'Temple Altar Sanctum' },
      temple_diya_s:  { id: 'temple_diya_s',  x:  65.5, z:  13.5, label: 'Temple South Diya Row' },
      temple_diya_n:  { id: 'temple_diya_n',  x:  65.5, z:   2.5, label: 'Temple North Diya Row' },

      // 8. Fireworks Celebration Pads
      fw_chowk:       { id: 'fw_chowk',       x: -12.0, z:  -3.0, label: 'Chowk Fireworks Area' },
      fw_promenade:   { id: 'fw_promenade',   x:  52.0, z: -18.0, label: 'Promenade Fireworks Pad' },
      fw_court_sharma:{ id: 'fw_court_sharma',x: -48.0, z: -15.0, label: 'Sharma House Play Area' },
      fw_court_verma: { id: 'fw_court_verma', x: -14.0, z: -15.0, label: 'Verma House Play Area' },

      // 9. Diwali Educational Area ("Diwali Kyon Manate Hain?")
      edu_kiosk:      { id: 'edu_kiosk',      x:  54.0, z:   2.0, label: 'Diwali Education Kiosk' }
    };

    // Graph Connectivity (Adjacency List)
    this.adjacency = {
      home_sharma:    ['road_nw', 'fw_court_sharma', 'home_verma'],
      home_verma:     ['home_sharma', 'chowk_north', 'home_gupta', 'fw_court_verma'],
      home_gupta:     ['home_verma', 'road_ne'],

      home_patel:     ['road_sw', 'home_mukherjee'],
      home_mukherjee: ['home_patel', 'chowk_south', 'home_singh'],
      home_singh:     ['home_mukherjee', 'road_se'],

      road_nw:        ['home_sharma'],
      road_sw:        ['home_patel'],

      road_ne:        ['home_gupta', 'prom_north', 'bazaar_front'],
      road_se:        ['home_singh', 'prom_south', 'rangoli_front'],

      chowk_center:   ['chowk_north', 'chowk_south', 'chowk_east'],
      chowk_north:    ['home_verma', 'chowk_center'],
      chowk_south:    ['home_mukherjee', 'chowk_center'],
      chowk_east:     ['chowk_center', 'fw_chowk', 'prom_mid'],

      prom_north:     ['road_ne', 'prom_mid', 'fw_promenade', 'edu_kiosk'],
      prom_mid:       ['prom_north', 'prom_south', 'bazaar_front', 'temple_entry', 'edu_kiosk', 'chowk_east'],
      prom_south:     ['prom_mid', 'road_se', 'rangoli_front'],

      bazaar_front:   ['prom_mid', 'bazaar_inside', 'rangoli_front', 'road_ne'],
      bazaar_inside:  ['bazaar_front'],
      rangoli_front:  ['bazaar_front', 'prom_south', 'road_se'],

      temple_entry:   ['prom_mid', 'temple_steps', 'edu_kiosk'],
      temple_steps:   ['temple_entry', 'temple_devotees', 'temple_diya_s', 'temple_diya_n'],
      temple_devotees:['temple_steps', 'temple_altar'],
      temple_altar:   ['temple_devotees'],
      temple_diya_s:  ['temple_steps'],
      temple_diya_n:  ['temple_steps'],

      fw_chowk:       ['chowk_east'],
      fw_promenade:   ['prom_north', 'prom_mid'],
      fw_court_sharma:['home_sharma'],
      fw_court_verma: ['home_verma'],

      edu_kiosk:      ['prom_mid', 'prom_north', 'temple_entry']
    };
  }

  // Find nearest waypoint to given 3D position
  findNearestWaypoint(x, z) {
    let nearestId = null;
    let minDist = Infinity;

    for (let id in this.waypoints) {
      const wp = this.waypoints[id];
      const d = Math.hypot(wp.x - x, wp.z - z);
      if (d < minDist) {
        minDist = d;
        nearestId = id;
      }
    }
    return nearestId;
  }

  // BFS Shortest Path between two named waypoints
  findPath(startWpId, goalWpId) {
    if (!this.waypoints[startWpId] || !this.waypoints[goalWpId]) return [];
    if (startWpId === goalWpId) return [this.waypoints[goalWpId]];

    const queue = [[startWpId]];
    const visited = new Set([startWpId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === goalWpId) {
        return path.map(id => this.waypoints[id]);
      }

      const neighbors = this.adjacency[current] || [];
      for (let nextId of neighbors) {
        if (!visited.has(nextId)) {
          visited.add(nextId);
          queue.push([...path, nextId]);
        }
      }
    }

    // Fallback: direct line to goal if no connected route found
    return [this.waypoints[goalWpId]];
  }

  // Calculate steering vector towards target with collision & boundary protection
  steerTowards(currentX, currentZ, targetX, targetZ, speed, delta = 0.016) {
    const dx = targetX - currentX;
    const dz = targetZ - currentZ;
    const dist = Math.hypot(dx, dz);

    if (dist < 0.2) {
      return { x: currentX, z: currentZ, reached: true, angle: 0 };
    }

    const dirX = dx / dist;
    const dirZ = dz / dist;
    const moveDist = Math.min(dist, speed * delta);

    let nextX = currentX + dirX * moveDist;
    let nextZ = currentZ + dirZ * moveDist;

    // Verify against 3D colliders (walls, havelis, counters)
    if (this.world3D) {
      if (this.world3D.checkCollision(nextX, currentZ, 0.6)) {
        nextX = currentX; // Blocked on X axis
      }
      if (this.world3D.checkCollision(currentX, nextZ, 0.6)) {
        nextZ = currentZ; // Blocked on Z axis
      }
    }

    const angle = Math.atan2(dirX, dirZ);
    return { x: nextX, z: nextZ, reached: false, angle };
  }
}

if (typeof window !== 'undefined') {
  window.DiwaliNavigation3D = DiwaliNavigation3D;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiwaliNavigation3D;
}

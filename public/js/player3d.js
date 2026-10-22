// ===================================================================
// DIWALI 3D CINEMATIC CAMERA SYSTEM
// Cinematic, automatic camera behavior for Sky Rockets, Anar fountains,
// Sky Lanterns, and festival showcases with explicit state management.
// ===================================================================

const CameraState = {
  PLAYER_FOLLOW: 'PLAYER_FOLLOW',
  ENTRANCE_INTRO: 'ENTRANCE_INTRO',
  ROCKET_TRACK: 'ROCKET_TRACK',
  BURST_HOLD: 'BURST_HOLD',
  CAMERA_RETURN: 'CAMERA_RETURN',
  FOUNTAIN_FOCUS: 'FOUNTAIN_FOCUS',
  LANTERN_FLOAT: 'LANTERN_FLOAT',
  SHOWCASE_WIDE: 'SHOWCASE_WIDE'
};

class DiwaliCinematicCamera {
  constructor(camera, player) {
    this.camera = camera;
    this.player = player;

    // Current State
    this.state = CameraState.PLAYER_FOLLOW;
    this.stateTimer = 0;

    // Tracking Targets & Saved Snapshots
    this.trackedRocket = null;
    this.trackedObject = null;
    this.burstPosition = new THREE.Vector3();
    this.burstColor = null;

    // Saved Camera State for seamless return
    this.savedTarget = new THREE.Vector3();
    this.savedPosition = new THREE.Vector3();
    this.savedYaw = 0;
    this.savedPitch = 0.48;
    this.savedDistance = 16.0;

    // Current interpolated vectors
    this.currentTarget = new THREE.Vector3(player.x, 1.8, player.z);
    this.currentPosition = new THREE.Vector3().copy(camera.position);

    // Entrance Intro Cinematic State
    this.hasPlayedEntranceIntro = false;
    this.entranceIntroDuration = 5.0; // 5.0s total: Phase A (0.6s) -> Phase B1 (1.3s) -> Phase B2 Hold (2.0s) -> Phase C Return (1.1s)
    this.introBannerTarget = new THREE.Vector3(-48.75, 8.6, 0.0);
    this.introBannerCamPos = new THREE.Vector3(-63.5, 8.2, 0.0);
    this.introStartCamPos = new THREE.Vector3();
    this.introStartCamTarget = new THREE.Vector3();
    this.onEntranceIntroComplete = null;

    // Durations
    this.burstHoldDuration = 2.4; // Seconds to view the firework burst in the sky
    this.returnDuration = 1.4;    // Seconds to blend back to normal 3rd-person
    this.fountainDuration = 3.6;  // Seconds for ground fountain focus
    this.lanternDuration = 4.8;   // Seconds to follow sky lantern upward revealing moonlit colony
    this.showcaseDuration = 20.0;
  }

  isCinematicActive() {
    return this.state !== CameraState.PLAYER_FOLLOW;
  }

  getState() {
    return this.state;
  }

  triggerRocketCinematic(rocket) {
    if (!rocket || !rocket.group) return;
    if (this.player.isReducedMotion) return;

    // If already tracking another rocket, don't interrupt unless in hold or return
    if (this.state === CameraState.ROCKET_TRACK) return;

    // Snapshot current normal camera state
    this.savedYaw = this.player.cameraYaw;
    this.savedPitch = this.player.cameraPitch;
    this.savedDistance = this.player.cameraDistance;
    this.savedTarget.copy(this.currentTarget);
    this.savedPosition.copy(this.camera.position);

    this.trackedRocket = rocket;
    this.state = CameraState.ROCKET_TRACK;
    this.stateTimer = 0;
  }

  onRocketExploded(rocket, burstX, burstY, burstZ, burstColor) {
    // Only trigger burst hold if we were actively tracking this specific rocket
    if (this.state === CameraState.ROCKET_TRACK && (this.trackedRocket === rocket || !this.trackedRocket)) {
      this.state = CameraState.BURST_HOLD;
      this.stateTimer = 0;
      this.burstPosition.set(burstX, burstY, burstZ);
      this.burstColor = burstColor;
      this.trackedRocket = null;
    }
  }

  triggerAnarCinematic(fountain) {
    if (this.player.isReducedMotion || this.isCinematicActive()) return;

    this.savedYaw = this.player.cameraYaw;
    this.savedPitch = this.player.cameraPitch;
    this.savedDistance = this.player.cameraDistance;
    this.savedTarget.copy(this.currentTarget);
    this.savedPosition.copy(this.camera.position);

    this.trackedObject = fountain;
    this.state = CameraState.FOUNTAIN_FOCUS;
    this.stateTimer = 0;
  }

  triggerLanternCinematic(lantern) {
    if (this.player.isReducedMotion || this.isCinematicActive()) return;

    this.savedYaw = this.player.cameraYaw;
    this.savedPitch = this.player.cameraPitch;
    this.savedDistance = this.player.cameraDistance;
    this.savedTarget.copy(this.currentTarget);
    this.savedPosition.copy(this.camera.position);

    this.trackedObject = lantern;
    this.state = CameraState.LANTERN_FLOAT;
    this.stateTimer = 0;
  }

  triggerShowcaseCinematic(durationMs = 20000) {
    if (this.player.isReducedMotion || this.state === CameraState.SHOWCASE_WIDE) return;

    this.savedYaw = this.player.cameraYaw;
    this.savedPitch = this.player.cameraPitch;
    this.savedDistance = this.player.cameraDistance;
    this.savedTarget.copy(this.currentTarget);
    this.savedPosition.copy(this.camera.position);

    this.state = CameraState.SHOWCASE_WIDE;
    this.stateTimer = 0;
    this.showcaseDuration = durationMs / 1000;
  }

  triggerEntranceIntro(onComplete = null, force = false) {
    if (!force && this.hasPlayedEntranceIntro) return false;
    if (this.player.isReducedMotion) {
      this.hasPlayedEntranceIntro = true;
      if (typeof onComplete === 'function') onComplete();
      return false;
    }

    this.hasPlayedEntranceIntro = true;
    this.onEntranceIntroComplete = onComplete;

    // Dynamically retrieve exact world coordinates of West Entrance Signboard if present
    let resolvedSignPos = null;
    if (window.diwaliWorld3D && window.diwaliWorld3D.societyArchitecture) {
      const arch = window.diwaliWorld3D.societyArchitecture;
      if (arch.entranceSignMeshWest) {
        const signWorldPos = new THREE.Vector3();
        arch.entranceSignMeshWest.getWorldPosition(signWorldPos);
        if (!isNaN(signWorldPos.x) && signWorldPos.y > 0) {
          resolvedSignPos = signWorldPos;
        }
      }
    }

    if (resolvedSignPos) {
      this.introBannerTarget.copy(resolvedSignPos);
      // Frame signboard horizontally and vertically with decorated gate arch and pillars
      this.introBannerCamPos.set(resolvedSignPos.x - 14.75, resolvedSignPos.y - 0.4, resolvedSignPos.z);
    } else {
      this.introBannerTarget.set(-48.75, 8.6, 0.0);
      this.introBannerCamPos.set(-63.5, 8.2, 0.0);
    }

    // Save starting camera position at gate spawn
    const p = this.player;
    const hDist = p.cameraDistance * Math.cos(p.cameraPitch);
    const vDist = p.cameraDistance * Math.sin(p.cameraPitch) + (p.cameraHeight || 2.2);
    this.introStartCamPos.set(
      p.x + Math.sin(p.cameraYaw) * hDist,
      Math.max(1.4, vDist + (p.y || 0)),
      p.z + Math.cos(p.cameraYaw) * hDist
    );
    this.introStartCamTarget.set(p.x, 1.65 + (p.y || 0), p.z);

    this.savedYaw = p.cameraYaw;
    this.savedPitch = p.cameraPitch;
    this.savedDistance = p.cameraDistance;
    this.savedTarget.copy(this.introStartCamTarget);
    this.savedPosition.copy(this.introStartCamPos);

    this.currentPosition.copy(this.introStartCamPos);
    this.currentTarget.copy(this.introStartCamTarget);
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);

    this.state = CameraState.ENTRANCE_INTRO;
    this.stateTimer = 0;
    return true;
  }

  resetToPlayerFollow() {
    this.state = CameraState.PLAYER_FOLLOW;
    this.stateTimer = 0;
    this.trackedRocket = null;
    this.trackedObject = null;
  }

  update(delta = 0.016) {
    this.stateTimer += delta;

    switch (this.state) {
      case CameraState.PLAYER_FOLLOW:
        this.updatePlayerFollow(delta);
        break;

      case CameraState.ENTRANCE_INTRO:
        this.updateEntranceIntro(delta);
        break;

      case CameraState.ROCKET_TRACK:
        this.updateRocketTrack(delta);
        break;

      case CameraState.BURST_HOLD:
        this.updateBurstHold(delta);
        break;

      case CameraState.CAMERA_RETURN:
        this.updateCameraReturn(delta);
        break;

      case CameraState.FOUNTAIN_FOCUS:
        this.updateFountainFocus(delta);
        break;

      case CameraState.LANTERN_FLOAT:
        this.updateLanternFloat(delta);
        break;

      case CameraState.SHOWCASE_WIDE:
        this.updateShowcaseWide(delta);
        break;

      default:
        this.state = CameraState.PLAYER_FOLLOW;
        this.updatePlayerFollow(delta);
        break;
    }
  }

  // 1. Standard 3rd-Person Follow & Theater Seated Camera
  updatePlayerFollow(delta) {
    const p = this.player;

    // 1. THEATER CINEMA SEATED CAMERA MODE
    // When the player sits on any theater bench, automatically frame the entire cinema screen!
    if (p.isSitting && p.currentBench && p.currentBench.isTheaterBench) {
      const screenX = p.currentBench.screenPos?.x || 35.0;
      const screenY = p.currentBench.screenPos?.y || 4.4;
      const screenZ = p.currentBench.screenPos?.z || -14.0;

      let idealX, idealY, idealZ;
      const idealTargetX = screenX;
      const idealTargetY = screenY;
      const idealTargetZ = screenZ;

      const mode = p.theaterCamMode || 'cinema';

      if (mode === 'shoulder') {
        // Over-the-shoulder view: avatar in lower-left, perfectly framing the whole screen
        if (p.group) p.group.visible = true;
        idealX = p.x - 2.4;
        idealY = 2.45;
        idealZ = p.z + 1.5;
      } else {
        // Direct Cinema View: avatar hidden, zero obstruction, eye level, screen completely filling view!
        if (p.group) p.group.visible = false;
        idealX = p.x + 0.6;
        idealY = 2.3;
        idealZ = p.z;
      }

      const lerpSpeed = Math.min(1.0, 6.0 * delta);
      this.currentPosition.x += (idealX - this.currentPosition.x) * lerpSpeed;
      this.currentPosition.y += (idealY - this.currentPosition.y) * lerpSpeed;
      this.currentPosition.z += (idealZ - this.currentPosition.z) * lerpSpeed;
      this.camera.position.copy(this.currentPosition);

      this.currentTarget.x += (idealTargetX - this.currentTarget.x) * lerpSpeed;
      this.currentTarget.y += (idealTargetY - this.currentTarget.y) * lerpSpeed;
      this.currentTarget.z += (idealTargetZ - this.currentTarget.z) * lerpSpeed;
      this.camera.lookAt(this.currentTarget);

      p.cameraPosition.copy(this.currentPosition);
      p.cameraTarget.copy(this.currentTarget);
      return;
    }

    // Restore avatar visibility when not sitting in cinema mode
    if (p.group && !p.group.visible) {
      p.group.visible = true;
    }

    // 2. PROXIMITY THEATER AUTO-PITCH
    // When standing/walking near the stage screen, gracefully elevate look-at target so screen stays centered
    let targetElevY = 1.65;
    const stageDist = Math.hypot(p.x - 35.0, p.z - (-14.0));
    if (stageDist < 22.0 && p.x < 35.0) {
      const approachFactor = Math.max(0, 1.0 - stageDist / 22.0);
      targetElevY = 1.65 + approachFactor * 2.3; // tilts gaze upward towards screen center (4.4m)
    }

    const hDist = p.cameraDistance * Math.cos(p.cameraPitch);
    const vDist = p.cameraDistance * Math.sin(p.cameraPitch) + (p.cameraHeight || 2.2);

    const idealX = p.x + Math.sin(p.cameraYaw) * hDist;
    const idealZ = p.z + Math.cos(p.cameraYaw) * hDist;
    const playerY = p.y || 0;
    const idealY = Math.max(1.4, vDist + playerY);

    const lerpFactor = Math.min(1.0, (p.cameraLerp || 0.095) * (delta / 0.016));
    this.currentPosition.x += (idealX - this.currentPosition.x) * lerpFactor;
    this.currentPosition.y += (idealY - this.currentPosition.y) * lerpFactor;
    this.currentPosition.z += (idealZ - this.currentPosition.z) * lerpFactor;

    // Keep camera above ground
    this.currentPosition.y = Math.max(1.4 + playerY, this.currentPosition.y);
    this.camera.position.copy(this.currentPosition);

    this.currentTarget.x += (p.x - this.currentTarget.x) * lerpFactor;
    this.currentTarget.y += ((targetElevY + playerY) - this.currentTarget.y) * lerpFactor;
    this.currentTarget.z += (p.z - this.currentTarget.z) * lerpFactor;

    this.camera.lookAt(this.currentTarget);
    p.cameraPosition.copy(this.currentPosition);
    p.cameraTarget.copy(this.currentTarget);
  }

  // 2. Cinematic Rocket Ascent Tracking
  updateRocketTrack(delta) {
    // Fail-safe: if rocket disappeared or timed out (> 6s), transition to return
    if (!this.trackedRocket || !this.trackedRocket.group || this.stateTimer > 6.0) {
      this.state = CameraState.CAMERA_RETURN;
      this.stateTimer = 0;
      return;
    }

    const rPos = this.trackedRocket.group.position;

    // Target tracks rocket, smoothly leading upward
    const targetX = rPos.x;
    const targetY = rPos.y + 0.6;
    const targetZ = rPos.z;

    const trackSpeed = Math.min(1.0, 7.5 * delta);
    this.currentTarget.x += (targetX - this.currentTarget.x) * trackSpeed;
    this.currentTarget.y += (targetY - this.currentTarget.y) * trackSpeed;
    this.currentTarget.z += (targetZ - this.currentTarget.z) * trackSpeed;

    // Camera position: positioned backward along launch angle, smoothly elevating
    // to keep rocket framed majestically against the night sky
    const camOffsetDist = 14.5;
    const desiredCamX = rPos.x + Math.sin(this.savedYaw) * camOffsetDist;
    const desiredCamZ = rPos.z + Math.cos(this.savedYaw) * camOffsetDist;
    // Elevate camera gradually as rocket ascends to give cinematic low-to-mid angle parallax
    const desiredCamY = Math.max(2.2, 3.5 + rPos.y * 0.28);

    const posSpeed = Math.min(1.0, 4.5 * delta);
    this.currentPosition.x += (desiredCamX - this.currentPosition.x) * posSpeed;
    this.currentPosition.y += (desiredCamY - this.currentPosition.y) * posSpeed;
    this.currentPosition.z += (desiredCamZ - this.currentPosition.z) * posSpeed;
    this.currentPosition.y = Math.max(1.5, this.currentPosition.y);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }

  // 3. Burst Hold on Aerial Peony Explosion
  updateBurstHold(delta) {
    if (this.stateTimer >= this.burstHoldDuration) {
      this.state = CameraState.CAMERA_RETURN;
      this.stateTimer = 0;
      return;
    }

    // Gentle cinematic drift while admiring the explosion
    const t = this.stateTimer;
    const subtleDrift = Math.sin(t * 1.5) * 0.35;

    // Keep camera target centered on explosion burst
    this.currentTarget.x = this.burstPosition.x;
    this.currentTarget.y = this.burstPosition.y - t * 0.15; // Slow downward drift as sparks fall
    this.currentTarget.z = this.burstPosition.z;

    this.currentPosition.x += subtleDrift * delta;
    this.currentPosition.y = Math.max(2.0, this.currentPosition.y + 0.15 * delta);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }

  // 4. Smooth Return to Third-Person Player Camera
  updateCameraReturn(delta) {
    const p = this.player;
    const hDist = p.cameraDistance * Math.cos(p.cameraPitch);
    const vDist = p.cameraDistance * Math.sin(p.cameraPitch) + (p.cameraHeight || 2.2);

    const desiredCamX = p.x + Math.sin(p.cameraYaw) * hDist;
    const desiredCamZ = p.z + Math.cos(p.cameraYaw) * hDist;
    const desiredCamY = Math.max(1.4, vDist);

    const desiredTargetX = p.x;
    const desiredTargetY = 1.65;
    const desiredTargetZ = p.z;

    // Smooth ease-out lerp back to player
    const blendRate = Math.min(1.0, 4.2 * delta);
    this.currentPosition.x += (desiredCamX - this.currentPosition.x) * blendRate;
    this.currentPosition.y += (desiredCamY - this.currentPosition.y) * blendRate;
    this.currentPosition.z += (desiredCamZ - this.currentPosition.z) * blendRate;
    this.currentPosition.y = Math.max(1.5, this.currentPosition.y);

    this.currentTarget.x += (desiredTargetX - this.currentTarget.x) * blendRate;
    this.currentTarget.y += (desiredTargetY - this.currentTarget.y) * blendRate;
    this.currentTarget.z += (desiredTargetZ - this.currentTarget.z) * blendRate;

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);

    const posDist = Math.hypot(
      desiredCamX - this.currentPosition.x,
      desiredCamY - this.currentPosition.y,
      desiredCamZ - this.currentPosition.z
    );
    const targetDist = Math.hypot(
      desiredTargetX - this.currentTarget.x,
      desiredTargetY - this.currentTarget.y,
      desiredTargetZ - this.currentTarget.z
    );

    if (this.stateTimer >= this.returnDuration || (posDist < 0.25 && targetDist < 0.15)) {
      this.resetToPlayerFollow();
    }
  }

  // 5. Ground Fountain (Anar) Framing
  updateFountainFocus(delta) {
    if (this.stateTimer >= this.fountainDuration) {
      this.state = CameraState.CAMERA_RETURN;
      this.stateTimer = 0;
      return;
    }

    const p = this.player;
    // Lower camera pitch slightly and pull back slightly to frame ground + sparks
    const cinPitch = Math.max(0.24, this.savedPitch * 0.72);
    const cinDist = this.savedDistance + 2.5;

    const hDist = cinDist * Math.cos(cinPitch);
    const vDist = cinDist * Math.sin(cinPitch);

    const desiredCamX = p.x + Math.sin(this.savedYaw) * hDist;
    const desiredCamZ = p.z + Math.cos(this.savedYaw) * hDist;
    const desiredCamY = Math.max(1.8, vDist);

    const blendRate = Math.min(1.0, 3.5 * delta);
    this.currentPosition.x += (desiredCamX - this.currentPosition.x) * blendRate;
    this.currentPosition.y += (desiredCamY - this.currentPosition.y) * blendRate;
    this.currentPosition.z += (desiredCamZ - this.currentPosition.z) * blendRate;

    // Look halfway up the golden sparks fountain (approx 2.4m elevation)
    const targetX = p.x;
    const targetY = 2.4;
    const targetZ = p.z;
    this.currentTarget.x += (targetX - this.currentTarget.x) * blendRate;
    this.currentTarget.y += (targetY - this.currentTarget.y) * blendRate;
    this.currentTarget.z += (targetZ - this.currentTarget.z) * blendRate;

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }

  // 6. Sky Lantern Gentle Float Tracking
  updateLanternFloat(delta) {
    if (this.stateTimer >= this.lanternDuration || !this.trackedObject || !this.trackedObject.group) {
      this.state = CameraState.CAMERA_RETURN;
      this.stateTimer = 0;
      return;
    }

    const lanPos = this.trackedObject.group.position;
    const blendRate = Math.min(1.0, 3.2 * delta);

    // Gently tilt target up towards lantern
    this.currentTarget.x += (lanPos.x - this.currentTarget.x) * blendRate;
    this.currentTarget.y += ((lanPos.y + 0.8) - this.currentTarget.y) * blendRate;
    this.currentTarget.z += (lanPos.z - this.currentTarget.z) * blendRate;

    // Gently elevate camera slightly to reveal the moonlit colony and temple below
    const desiredCamY = Math.max(2.4, 2.5 + Math.min(4.2, lanPos.y * 0.35));
    this.currentPosition.y += (desiredCamY - this.currentPosition.y) * (blendRate * 0.6);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }

  // 7. Grand Sky Fireworks Showcase Panoramic View
  updateShowcaseWide(delta) {
    if (this.stateTimer >= this.showcaseDuration) {
      this.state = CameraState.CAMERA_RETURN;
      this.stateTimer = 0;
      return;
    }

    const p = this.player;
    const wideDist = 26.0;
    const widePitch = 0.35; // Lower pitch looking up across colony sky
    const hDist = wideDist * Math.cos(widePitch);
    const vDist = wideDist * Math.sin(widePitch);

    const desiredCamX = p.x + Math.sin(p.cameraYaw) * hDist;
    const desiredCamZ = p.z + Math.cos(p.cameraYaw) * hDist;
    const desiredCamY = Math.max(4.0, vDist);

    const blendRate = Math.min(1.0, 2.0 * delta);
    this.currentPosition.x += (desiredCamX - this.currentPosition.x) * blendRate;
    this.currentPosition.y += (desiredCamY - this.currentPosition.y) * blendRate;
    this.currentPosition.z += (desiredCamZ - this.currentPosition.z) * blendRate;

    // Look towards the sky above the colony center
    const desiredTargetX = p.x;
    const desiredTargetY = 12.0; // Elevated sky view
    const desiredTargetZ = p.z;

    this.currentTarget.x += (desiredTargetX - this.currentTarget.x) * blendRate;
    this.currentTarget.y += (desiredTargetY - this.currentTarget.y) * blendRate;
    this.currentTarget.z += (desiredTargetZ - this.currentTarget.z) * blendRate;

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }

  // 8. Gokuldham Society Gate & Banner Automatic Cinematic Entrance Intro
  updateEntranceIntro(delta) {
    const p = this.player;
    const total = this.entranceIntroDuration; // 5.0 seconds

    // If player touches movement controls or triggers movement during intro,
    // safely fast-forward to Phase C (smooth return) so user is never locked or disrupted
    if (this.stateTimer > 0.4 && p.isMoving && this.stateTimer < 3.9) {
      this.stateTimer = 3.9;
    }

    // Smootherstep (Hermite quintic: 6t^5 - 15t^4 + 10t^3) for zero starting/ending acceleration
    const smooth = (min, max, val) => {
      const x = Math.max(0, Math.min(1, (val - min) / (max - min)));
      return x * x * x * (x * (x * 6 - 15) + 10);
    };

    // Calculate dynamic third-person gameplay camera position to seamlessly return to
    const hDist = p.cameraDistance * Math.cos(p.cameraPitch);
    const vDist = p.cameraDistance * Math.sin(p.cameraPitch) + (p.cameraHeight || 2.2);
    const playCamX = p.x + Math.sin(p.cameraYaw) * hDist;
    const playCamY = Math.max(1.4, vDist + (p.y || 0));
    const playCamZ = p.z + Math.cos(p.cameraYaw) * hDist;
    const playTarX = p.x;
    const playTarY = 1.65 + (p.y || 0);
    const playTarZ = p.z;

    if (this.stateTimer < 0.6) {
      // Phase A (0.0s - 0.6s): Show player at normal starting gate position
      this.currentPosition.copy(this.introStartCamPos);
      this.currentTarget.copy(this.introStartCamTarget);
    } else if (this.stateTimer < 1.9) {
      // Phase B1 (0.6s - 1.9s): Smooth cinematic tilt & elevation to frame the "GOKULDHAM SOCIETY" banner
      const t = smooth(0.6, 1.9, this.stateTimer);
      this.currentPosition.lerpVectors(this.introStartCamPos, this.introBannerCamPos, t);
      this.currentTarget.lerpVectors(this.introStartCamTarget, this.introBannerTarget, t);
    } else if (this.stateTimer < 3.9) {
      // Phase B2 (1.9s - 3.9s): Hold banner composition for 2.0s with subtle breathing float
      const holdTime = this.stateTimer - 1.9;
      const subtleFloat = Math.sin(holdTime * 1.5) * 0.08;
      this.currentPosition.copy(this.introBannerCamPos);
      this.currentPosition.y += subtleFloat;
      this.currentTarget.copy(this.introBannerTarget);
    } else if (this.stateTimer < total) {
      // Phase C (3.9s - 5.0s): Smooth ease-out transition back to 3rd-person gameplay camera
      const t = smooth(3.9, total, this.stateTimer);
      this.currentPosition.lerpVectors(this.introBannerCamPos, new THREE.Vector3(playCamX, playCamY, playCamZ), t);
      this.currentTarget.lerpVectors(this.introBannerTarget, new THREE.Vector3(playTarX, playTarY, playTarZ), t);
    } else {
      // Completed intro: seamlessly restore third-person player follow
      this.resetToPlayerFollow();
      if (typeof this.onEntranceIntroComplete === 'function') {
        const cb = this.onEntranceIntroComplete;
        this.onEntranceIntroComplete = null;
        cb();
      }
      return;
    }

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
    p.cameraPosition.copy(this.currentPosition);
    p.cameraTarget.copy(this.currentTarget);
  }
}

class DiwaliPlayer3D {
  constructor(scene, camera, startX = 370, startY = 610) {
    this.scene = scene;
    this.camera = camera;

    // Spatial Position in 3D (scale: 0.1, center: 890, 610)
    // Default: startX = 370, startY = 610 => x = -52.0, z = 0.0 (Gokuldham Society Gate entrance)
    this.scale = 0.1;
    this.centerX = 890;
    this.centerZ = 610;

    this.x = (startX - this.centerX) * this.scale;
    this.y = 0;
    this.z = (startY - this.centerZ) * this.scale;

    this.radius = 0.45; // 3D capsule collision radius (human scale)
    this.speed = 9.5; // meters per second (walking)
    this.sprintSpeed = 15.0; // meters per second (sprint)
    this.rotation = Math.PI / 2; // Facing East towards Gokuldham Society
    this.targetRotation = Math.PI / 2;

    this.isMoving = false;
    this.isSprinting = false;
    this.walkCycle = 0;

    // Seated state on benches
    this.isSitting = false;
    this.currentBench = null;

    // Customization Attributes
    this.name = 'You';
    this.kurtaColorHex = 0xfaf5eb; // Luxurious Cream / Ivory Silk
    this.turbanColorHex = 0xb91c1c; // Deep Royal Ruby Red
    this.stoleColorHex = 0x991b1b;  // Embroidered Crimson Stole

    // Sparkler state
    this.sparklerActive = true;
    this.sparklerParticles = [];

    // Camera follow & orbit parameters (Cinematic third-person lower-center framing)
    this.cameraDistance = 6.2;
    this.cameraHeight = 2.3;
    this.cameraPitch = 0.15; // Low-to-mid elevation framing street, bazaar, temple & sky
    this.cameraYaw = -Math.PI / 2; // Facing East through the gate
    this.cameraTarget = new THREE.Vector3();
    this.cameraPosition = new THREE.Vector3();
    this.cameraLerp = 0.095;

    // Emote display state
    this.activeEmote = null;
    this.isReducedMotion = false;

    // Cinematic Camera Controller with explicit states
    this.cameraController = new DiwaliCinematicCamera(this.camera, this);

    // Build the 3D Character Mesh Hierarchy
    this.group = this.buildCharacterModel();
    this.group.rotation.y = Math.PI / 2;
    this.scene.add(this.group);

    // Immediately position camera on frame 0
    const hDist = this.cameraDistance * Math.cos(this.cameraPitch);
    const vDist = this.cameraDistance * Math.sin(this.cameraPitch) + this.cameraHeight;
    this.cameraPosition.set(
      this.x + Math.sin(this.cameraYaw) * hDist,
      Math.max(1.4, vDist),
      this.z + Math.cos(this.cameraYaw) * hDist
    );
    this.camera.position.copy(this.cameraPosition);
    this.cameraTarget.set(this.x, 1.65, this.z);
    this.camera.lookAt(this.cameraTarget);
  }

  setPosition(x, y, z) {
    this.x = x;
    this.y = y !== undefined ? y : 0;
    this.z = z;
    if (this.group) {
      this.group.position.set(this.x, this.y, this.z);
    }
  }

  set2DPosition(x2d, y2d) {
    this.x = (x2d - this.centerX) * this.scale;
    this.z = (y2d - this.centerZ) * this.scale;
    if (this.group) {
      this.group.position.set(this.x, this.y, this.z);
    }
  }

  respawnAtGate() {
    this.x = -52.0;
    this.y = 0;
    this.z = 0.0;
    this.rotation = Math.PI / 2;
    this.targetRotation = Math.PI / 2;
    this.cameraYaw = -Math.PI / 2;
    if (this.group) {
      this.group.position.set(this.x, 0, this.z);
      this.group.rotation.y = Math.PI / 2;
    }
    if (this.camera) {
      const hDist = this.cameraDistance * Math.cos(this.cameraPitch);
      const vDist = this.cameraDistance * Math.sin(this.cameraPitch) + this.cameraHeight;
      this.cameraPosition.set(
        this.x + Math.sin(this.cameraYaw) * hDist,
        Math.max(1.4, vDist),
        this.z + Math.cos(this.cameraYaw) * hDist
      );
      this.camera.position.copy(this.cameraPosition);
      this.cameraTarget.set(this.x, 1.65, this.z);
      this.camera.lookAt(this.cameraTarget);
    }
  }

  // Convert 3D position to legacy 2D coordinates for UI & server compatibility
  get x2d() {
    return this.x / this.scale + this.centerX;
  }

  get y2d() {
    return this.z / this.scale + this.centerZ;
  }

  set2DPosition(px, py) {
    this.x = (px - this.centerX) * this.scale;
    this.z = (py - this.centerZ) * this.scale;
    if (this.group) {
      this.group.position.set(this.x, 0, this.z);
    }
  }

  buildCharacterModel() {
    const root = new THREE.Group();
    root.name = 'PlayerAvatar';
    root.position.set(this.x, 0, this.z);

    // Materials - Authentic Indian Festive Silk & Gold
    this.skinMat = new THREE.MeshStandardMaterial({ color: 0xd49b73, roughness: 0.65 });
    this.kurtaMat = new THREE.MeshStandardMaterial({ color: this.kurtaColorHex, roughness: 0.52, metalness: 0.1 });
    this.turbanMat = new THREE.MeshStandardMaterial({ color: this.turbanColorHex, roughness: 0.55 });
    this.stoleMat = new THREE.MeshStandardMaterial({ color: this.stoleColorHex, roughness: 0.48 });
    this.dhotiMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 });
    this.goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.22 });
    this.shoeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });

    // 1. Torso & Kurta (Silk Sherwani with Nehru collar & gold brocade)
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 1.6;

    const chestGeo = new THREE.BoxGeometry(0.85, 0.9, 0.5);
    this.chest = new THREE.Mesh(chestGeo, this.kurtaMat);
    this.chest.castShadow = true;
    this.torsoGroup.add(this.chest);

    // Flared lower Kurta hem (hanging over waist)
    const flareGeo = new THREE.ConeGeometry(0.58, 0.65, 8);
    this.flare = new THREE.Mesh(flareGeo, this.kurtaMat);
    this.flare.position.y = -0.55;
    this.flare.castShadow = true;
    this.torsoGroup.add(this.flare);

    // Embroidered Golden Collar / Nehru Neckline
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.15, 8), this.goldTrimMat);
    collar.position.y = 0.5;
    this.torsoGroup.add(collar);

    // Golden Embroidered Placket & Buttons (Center Front)
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.05), this.goldTrimMat);
    placket.position.set(0, 0.1, 0.26);
    this.torsoGroup.add(placket);

    // Golden Embroidered Waist Sash (Kamabandh)
    const sash = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.54), this.goldTrimMat);
    sash.position.y = -0.3;
    this.torsoGroup.add(sash);

    // 2. Draped Festive Dupatta / Stole (Angavastram over Left Shoulder)
    const stoleGroup = new THREE.Group();
    stoleGroup.name = 'FestiveDupattaStole';

    // Shoulder Wrap Piece
    const sWrap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.58), this.stoleMat);
    sWrap.position.set(-0.35, 0.44, 0);
    sWrap.castShadow = true;
    stoleGroup.add(sWrap);

    // Front Hanging Stole Panel with Golden Border
    const sFront = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.85, 0.06), this.stoleMat);
    sFront.position.set(-0.34, -0.05, 0.28);
    sFront.castShadow = true;
    stoleGroup.add(sFront);

    const sFrontBorder = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 0.07), this.goldTrimMat);
    sFrontBorder.position.set(-0.34, -0.44, 0.28);
    stoleGroup.add(sFrontBorder);

    // Back Cascading Stole Panel (Flowing down the back, prominent from camera view)
    const sBack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.15, 0.06), this.stoleMat);
    sBack.position.set(-0.34, -0.18, -0.28);
    sBack.castShadow = true;
    stoleGroup.add(sBack);

    const sBackBorder = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.07), this.goldTrimMat);
    sBackBorder.position.set(-0.34, -0.72, -0.28);
    stoleGroup.add(sBackBorder);

    this.torsoGroup.add(stoleGroup);
    root.add(this.torsoGroup);

    // 3. Head & Royal Indian Pagri / Turban with Golden Kalgi Feather
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 2.35, 0);

    const headGeo = new THREE.SphereGeometry(0.32, 12, 12);
    const head = new THREE.Mesh(headGeo, this.skinMat);
    head.castShadow = true;
    this.headGroup.add(head);

    // Royal Indian Turban (Safaa / Pagri with folds)
    const turbanGeo = new THREE.TorusGeometry(0.34, 0.16, 8, 16);
    turbanGeo.rotateX(Math.PI / 2);
    this.turban = new THREE.Mesh(turbanGeo, this.turbanMat);
    this.turban.position.y = 0.12;
    this.turban.castShadow = true;
    this.headGroup.add(this.turban);

    const turbanTop = new THREE.Mesh(new THREE.SphereGeometry(0.31, 10, 10), this.turbanMat);
    turbanTop.position.y = 0.25;
    turbanTop.castShadow = true;
    this.headGroup.add(turbanTop);

    // Turban Golden Brooch Base
    const kalgiBrooch = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8), this.goldTrimMat);
    kalgiBrooch.position.set(0, 0.35, 0.32);
    kalgiBrooch.rotation.x = Math.PI / 2;
    this.headGroup.add(kalgiBrooch);

    // Upright Golden Kalgi Jewel Plume Feather (Prominent from behind)
    const featherGeo = new THREE.ConeGeometry(0.09, 0.38, 6);
    const kalgiFeather = new THREE.Mesh(featherGeo, this.goldTrimMat);
    kalgiFeather.position.set(0, 0.58, 0.18);
    kalgiFeather.rotation.x = -0.15;
    kalgiFeather.castShadow = true;
    this.headGroup.add(kalgiFeather);

    // Secondary subtle rear turban tail pleat
    const tailGeo = new THREE.BoxGeometry(0.16, 0.42, 0.06);
    const turbanTail = new THREE.Mesh(tailGeo, this.turbanMat);
    turbanTail.position.set(0, 0.05, -0.34);
    this.headGroup.add(turbanTail);

    root.add(this.headGroup);

    // 3. Articulated Arms
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.54, 1.95, 0);
    const armGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.85, 8);
    armGeo.translate(0, -0.4, 0);
    this.leftArm = new THREE.Mesh(armGeo, this.kurtaMat);
    this.leftArm.castShadow = true;
    this.leftArmGroup.add(this.leftArm);
    root.add(this.leftArmGroup);

    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.54, 1.95, 0);
    this.rightArm = new THREE.Mesh(armGeo, this.kurtaMat);
    this.rightArm.castShadow = true;
    this.rightArmGroup.add(this.rightArm);

    // Handheld Phuljhadi (Festive Sparkler) in Right Hand
    this.sparklerGroup = new THREE.Group();
    this.sparklerGroup.position.set(0, -0.85, 0.25);
    this.sparklerGroup.rotation.x = Math.PI / 4;

    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), this.goldTrimMat);
    this.sparklerGroup.add(stick);

    // Sparkler Burning Tip & Glow
    const tipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.sparklerTip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), tipMat);
    this.sparklerTip.position.y = 0.3;
    this.sparklerGroup.add(this.sparklerTip);

    // Real dynamic point light emitted by sparkler
    this.sparklerLight = new THREE.PointLight(0xffb703, 2.2, 8);
    this.sparklerLight.position.set(0, 0.32, 0);
    this.sparklerGroup.add(this.sparklerLight);

    this.rightArmGroup.add(this.sparklerGroup);
    root.add(this.rightArmGroup);

    // 4. Articulated Legs (White Dhoti / Churidar & Pointed Juttis with Bending Knees)
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.24, 0.95, 0);

    const thighGeo = new THREE.CylinderGeometry(0.13, 0.115, 0.48, 8);
    thighGeo.translate(0, -0.24, 0);
    this.leftThigh = new THREE.Mesh(thighGeo, this.dhotiMat);
    this.leftThigh.castShadow = true;
    this.leftLegGroup.add(this.leftThigh);

    this.leftKneeGroup = new THREE.Group();
    this.leftKneeGroup.position.set(0, -0.48, 0);

    const calfGeo = new THREE.CylinderGeometry(0.115, 0.095, 0.48, 8);
    calfGeo.translate(0, -0.24, 0);
    this.leftCalf = new THREE.Mesh(calfGeo, this.dhotiMat);
    this.leftCalf.castShadow = true;
    this.leftKneeGroup.add(this.leftCalf);

    const kneeJointL = new THREE.Mesh(new THREE.SphereGeometry(0.115, 8, 8), this.dhotiMat);
    this.leftKneeGroup.add(kneeJointL);

    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.42), this.shoeMat);
    leftShoe.position.set(0, -0.46, 0.1);
    this.leftKneeGroup.add(leftShoe);

    this.leftLegGroup.add(this.leftKneeGroup);
    root.add(this.leftLegGroup);

    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.24, 0.95, 0);

    this.rightThigh = new THREE.Mesh(thighGeo, this.dhotiMat);
    this.rightThigh.castShadow = true;
    this.rightLegGroup.add(this.rightThigh);

    this.rightKneeGroup = new THREE.Group();
    this.rightKneeGroup.position.set(0, -0.48, 0);

    this.rightCalf = new THREE.Mesh(calfGeo, this.dhotiMat);
    this.rightCalf.castShadow = true;
    this.rightKneeGroup.add(this.rightCalf);

    const kneeJointR = new THREE.Mesh(new THREE.SphereGeometry(0.115, 8, 8), this.dhotiMat);
    this.rightKneeGroup.add(kneeJointR);

    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.42), this.shoeMat);
    rightShoe.position.set(0, -0.46, 0.1);
    this.rightKneeGroup.add(rightShoe);

    this.rightLegGroup.add(this.rightKneeGroup);
    root.add(this.rightLegGroup);

    // 5. Overhead 3D Name Tag Sprite (Removed to prevent blocking third-person camera & stage view)
    this.nameSprite = null;

    return root;
  }

  createNameSprite(text) {
    if (typeof document === 'undefined') {
      const mat = new THREE.SpriteMaterial({ color: 0xfef08a, transparent: true });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(3.5, 0.85, 1);
      return sprite;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.roundRect(16, 12, 224, 40, 20);
    ctx.fill();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.roundRect(16, 12, 224, 40, 20);
    ctx.stroke();

    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.5, 0.85, 1);
    return sprite;
  }

  updateName(newName) {
    this.name = newName;
    if (this.nameSprite) {
      this.group.remove(this.nameSprite);
      this.nameSprite = null;
    }
  }

  updateOutfit(kurtaHex, turbanHex) {
    if (kurtaHex) {
      this.kurtaColorHex = kurtaHex;
      this.kurtaMat.color.set(kurtaHex);
    }
    if (turbanHex) {
      this.turbanColorHex = turbanHex;
      this.turbanMat.color.set(turbanHex);
    }
  }

  sitOnBench(benchData) {
    if (!benchData) return;
    this.isSitting = true;
    this.currentBench = benchData;
    this.isMoving = false;
    this.walkCycle = 0;
    this.theaterCamMode = 'cinema'; // Default to crystal clear direct cinema view

    if (typeof document !== 'undefined') {
      document.body.classList.add('player-is-seated');
      if (benchData.isTheaterBench) {
        document.body.classList.add('theater-seated');
      }
      const standBtn = document.getElementById('stageStandUpBtn');
      if (standBtn) standBtn.style.display = benchData.isTheaterBench ? 'inline-flex' : 'none';
    }

    // Place character precisely at bench seat
    this.x = benchData.seatX;
    this.z = benchData.seatZ;
    // Lower character slightly so thighs rest flush with bench seat slats (seatY is 0.82)
    this.y = (benchData.seatY || 0.82) - 0.95;
    this.rotation = benchData.rotY;
    this.targetRotation = benchData.rotY;

    // In theater, orient camera forward toward the cinema screen (+X) and hide avatar in cinema view
    if (benchData.isTheaterBench) {
      this.cameraYaw = -Math.PI / 2;
      if (this.group) this.group.visible = false;
      const camText = document.getElementById('stageCamViewText');
      if (camText) camText.textContent = 'Cinema';
    }

    if (this.group) {
      this.group.position.set(this.x, this.y, this.z);
      this.group.rotation.y = this.rotation;
    }

    // Sitting Posture Articulation
    // 1. Thighs forward 90 degrees
    if (this.leftLegGroup) this.leftLegGroup.rotation.set(-Math.PI / 2, 0, 0);
    if (this.rightLegGroup) this.rightLegGroup.rotation.set(-Math.PI / 2, 0, 0);

    // 2. Knees bent 90 degrees downward so calves hang down naturally
    if (this.leftKneeGroup) this.leftKneeGroup.rotation.set(Math.PI / 2, 0, 0);
    if (this.rightKneeGroup) this.rightKneeGroup.rotation.set(Math.PI / 2, 0, 0);

    // 3. Relaxed seated arms resting on lap/knees
    if (this.leftArmGroup) this.leftArmGroup.rotation.set(-0.35, 0, 0.15);
    if (this.rightArmGroup) this.rightArmGroup.rotation.set(-0.35, 0, -0.15);

    // 4. Relaxed torso lean back against wooden backrest
    if (this.torsoGroup) {
      this.torsoGroup.position.y = 1.6;
      this.torsoGroup.rotation.set(-0.06, 0, 0);
    }
  }

  standUp() {
    if (!this.isSitting) return;
    this.isSitting = false;
    this.currentBench = null;

    if (typeof document !== 'undefined') {
      document.body.classList.remove('player-is-seated', 'theater-seated');
      const standBtn = document.getElementById('stageStandUpBtn');
      if (standBtn) standBtn.style.display = 'none';
    }

    // Reset vertical offset
    this.y = 0;

    // Step forward 1.2m from bench in facing direction
    this.x += Math.sin(this.rotation) * 1.2;
    this.z += Math.cos(this.rotation) * 1.2;

    if (this.group) {
      this.group.visible = true;
      this.group.position.set(this.x, 0, this.z);
      this.group.rotation.y = this.rotation;
    }

    // Reset limb rotations to upright stance
    if (this.leftLegGroup) this.leftLegGroup.rotation.set(0, 0, 0);
    if (this.rightLegGroup) this.rightLegGroup.rotation.set(0, 0, 0);
    if (this.leftKneeGroup) this.leftKneeGroup.rotation.set(0, 0, 0);
    if (this.rightKneeGroup) this.rightKneeGroup.rotation.set(0, 0, 0);
    if (this.leftArmGroup) this.leftArmGroup.rotation.set(0, 0, 0);
    if (this.rightArmGroup) this.rightArmGroup.rotation.set(0, 0, 0);
    if (this.torsoGroup) {
      this.torsoGroup.position.y = 1.7;
      this.torsoGroup.rotation.set(0, 0, 0);
    }
  }

  // Toggle Camera View Mode when in Theater / Seated
  toggleTheaterCamView() {
    this.theaterCamMode = this.theaterCamMode === 'cinema' ? 'shoulder' : 'cinema';
    if (this.group) {
      this.group.visible = this.theaterCamMode === 'shoulder';
    }
    const label = this.theaterCamMode === 'cinema' ? '🎬 Direct Cinema View' : '🪔 Seated Over-Shoulder View';
    if (window.diwaliEngine && typeof window.diwaliEngine.showToastNotice === 'function') {
      window.diwaliEngine.showToastNotice(`🎥 Camera: ${label}`);
    }
    const camText = document.getElementById('stageCamViewText');
    if (camText) camText.textContent = this.theaterCamMode === 'cinema' ? 'Cinema' : 'Seated';
  }

  // -------------------------------------------------------------
  // MOVEMENT, ANIMATION & COLLISION UPDATE
  // -------------------------------------------------------------
  update(keys, joystickVector, world3D, delta = 0.016) {
    keys = keys || {};
    // If sitting on a bench, check for stand-up input or hold sitting pose
    if (this.isSitting) {
      const isW = !!(keys['KeyW'] || keys['ArrowUp'] || keys['w'] || keys['W']);
      const isS = !!(keys['KeyS'] || keys['ArrowDown'] || keys['s'] || keys['S']);
      const isA = !!(keys['KeyA'] || keys['ArrowLeft'] || keys['a'] || keys['A']);
      const isD = !!(keys['KeyD'] || keys['ArrowRight'] || keys['d'] || keys['D']);
      const hasJoy = joystickVector && (Math.abs(joystickVector.x) > 0.1 || Math.abs(joystickVector.y) > 0.1);

      if (isW || isS || isA || isD || hasJoy) {
        this.standUp();
      } else {
        // Enforce seated posture each frame while sitting
        if (this.group) {
          this.group.position.set(this.x, this.y, this.z);
          this.group.rotation.y = this.rotation;
        }
        if (this.leftLegGroup) this.leftLegGroup.rotation.set(-Math.PI / 2, 0, 0);
        if (this.rightLegGroup) this.rightLegGroup.rotation.set(-Math.PI / 2, 0, 0);
        if (this.leftKneeGroup) this.leftKneeGroup.rotation.set(Math.PI / 2, 0, 0);
        if (this.rightKneeGroup) this.rightKneeGroup.rotation.set(Math.PI / 2, 0, 0);
        if (this.leftArmGroup) this.leftArmGroup.rotation.set(-0.35, 0, 0.15);
        if (this.rightArmGroup) this.rightArmGroup.rotation.set(-0.35, 0, -0.15);
        if (this.torsoGroup) {
          this.torsoGroup.position.y = 1.6;
          this.torsoGroup.rotation.set(-0.06, 0, 0);
        }

        // Sparkler flickering while seated
        if (this.sparklerActive) {
          const flicker = 1.8 + Math.random() * 0.8;
          this.sparklerLight.intensity = flicker;
          this.sparklerGroup.visible = true;
        } else {
          this.sparklerLight.intensity = 0;
          this.sparklerGroup.visible = false;
        }

        this.updateCameraFollow(delta);
        return;
      }
    }

    let forward = 0;
    let strafe = 0;

    // Case-insensitive key checks (prevents Shift or CapsLock from stopping character)
    const isW = !!(keys['KeyW'] || keys['ArrowUp'] || keys['w'] || keys['W']);
    const isS = !!(keys['KeyS'] || keys['ArrowDown'] || keys['s'] || keys['S']);
    const isA = !!(keys['KeyA'] || keys['ArrowLeft'] || keys['a'] || keys['A']);
    const isD = !!(keys['KeyD'] || keys['ArrowRight'] || keys['d'] || keys['D']);

    if (isW) forward += 1;
    if (isS) forward -= 1;
    if (isA) strafe -= 1;
    if (isD) strafe += 1;

    // Mobile touch joystick
    if (joystickVector && (joystickVector.x !== 0 || joystickVector.y !== 0)) {
      strafe += joystickVector.x;
      forward -= joystickVector.y;
    }

    // Sprint modifier
    this.isSprinting = !!(keys['ShiftLeft'] || keys['ShiftRight'] || window.mobileSprintActive);
    const curSpeed = this.isSprinting ? this.sprintSpeed : this.speed;

    const inputLen = Math.hypot(strafe, forward);
    if (inputLen > 0.05) {
      this.isMoving = true;
      const nStrafe = strafe / inputLen;
      const nForward = forward / inputLen;

      // Project input onto camera coordinate frame (camera-relative locomotion)
      const forwardX = -Math.sin(this.cameraYaw);
      const forwardZ = -Math.cos(this.cameraYaw);
      const rightX = -forwardZ;
      const rightZ = forwardX;

      // Scale move distance by delta for smooth framerate independence
      const moveDist = curSpeed * Math.min(delta, 0.05);
      const ndx = (forwardX * nForward + rightX * nStrafe) * moveDist;
      const ndz = (forwardZ * nForward + rightZ * nStrafe) * moveDist;

      // Desired heading angle
      this.targetRotation = Math.atan2(ndx, ndz);

      // Smooth collision movement with wall sliding and depenetration unsticking
      if (world3D && typeof world3D.resolveMovement === 'function') {
        const resolved = world3D.resolveMovement(this.x, this.z, ndx, ndz, this.radius);
        this.x = resolved.x;
        this.z = resolved.z;
      } else {
        const nextX = this.x + ndx;
        if (!world3D || !world3D.checkCollision(nextX, this.z, this.radius)) this.x = nextX;
        const nextZ = this.z + ndz;
        if (!world3D || !world3D.checkCollision(this.x, nextZ, this.radius)) this.z = nextZ;
      }

      // Progress walk cycle animation
      this.walkCycle += (this.isSprinting ? 12 : 8) * delta;
    } else {
      this.isMoving = false;
      this.walkCycle = 0;
    }

    // Smooth heading rotation interpolation
    let rotDiff = (this.targetRotation - this.rotation) % (Math.PI * 2);
    if (isNaN(rotDiff)) rotDiff = 0;
    while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
    while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
    this.rotation += rotDiff * 0.18;

    // Smoothly adapt vertical elevation to terrain/temple stairs and plinth
    if (world3D && typeof world3D.getElevation === 'function') {
      const targetY = world3D.getElevation(this.x, this.z);
      this.y += (targetY - this.y) * Math.min(1.0, 12.0 * delta);
    }

    // Update root group transform
    this.group.position.set(this.x, this.y, this.z);
    this.group.rotation.y = this.rotation;

    // Articulated Limb Swing Animations
    if (this.isMoving) {
      const swing = Math.sin(this.walkCycle) * (this.isSprinting ? 0.75 : 0.55);
      this.leftLegGroup.rotation.x = swing;
      this.rightLegGroup.rotation.x = -swing;
      if (this.leftKneeGroup) this.leftKneeGroup.rotation.x = swing < 0 ? -swing * 0.6 : 0;
      if (this.rightKneeGroup) this.rightKneeGroup.rotation.x = swing > 0 ? swing * 0.6 : 0;
      this.leftArmGroup.rotation.x = -swing * 0.8;
      this.rightArmGroup.rotation.x = swing * 0.4; // Arm holding sparkler swings subtly

      // Subtle vertical body bobbing
      this.torsoGroup.position.y = 1.6 + Math.abs(Math.sin(this.walkCycle * 2)) * 0.08;
    } else {
      // Return smoothly to idle stance
      this.leftLegGroup.rotation.x *= 0.8;
      this.rightLegGroup.rotation.x *= 0.8;
      if (this.leftKneeGroup) this.leftKneeGroup.rotation.x *= 0.8;
      if (this.rightKneeGroup) this.rightKneeGroup.rotation.x *= 0.8;
      this.leftArmGroup.rotation.x *= 0.8;
      this.rightArmGroup.rotation.x *= 0.8;
      this.torsoGroup.position.y = 1.6;
      this.torsoGroup.rotation.set(0, 0, 0);
    }

    // Sparkler tip flickering and dynamic light pulse
    if (this.sparklerActive) {
      const flicker = 1.8 + Math.random() * 0.8;
      this.sparklerLight.intensity = flicker;
      this.sparklerGroup.visible = true;
    } else {
      this.sparklerLight.intensity = 0;
      this.sparklerGroup.visible = false;
    }

    // Smooth Third-Person / Cinematic Camera Tracking
    this.updateCameraFollow(delta);
  }

  setReducedMotion(enabled) {
    this.isReducedMotion = !!enabled;
  }

  // -------------------------------------------------------------
  // THIRD-PERSON & CINEMATIC CAMERA UPDATE
  // -------------------------------------------------------------
  updateCameraFollow(delta = 0.016) {
    if (this.cameraController) {
      this.cameraController.update(delta);
    }
  }

  // Show overhead emote message
  showEmote(text, emoji) {
    if (this.activeEmote) {
      this.group.remove(this.activeEmote);
    }
    const sprite = this.createNameSprite(`${emoji} ${text}`);
    sprite.position.set(0, 4.0, 0);
    this.activeEmote = sprite;
    this.group.add(sprite);

    setTimeout(() => {
      if (this.activeEmote === sprite) {
        this.group.remove(sprite);
        this.activeEmote = null;
      }
    }, 3200);
  }
}

window.CameraState = CameraState;
window.DiwaliCinematicCamera = DiwaliCinematicCamera;
window.DiwaliPlayer3D = DiwaliPlayer3D;
